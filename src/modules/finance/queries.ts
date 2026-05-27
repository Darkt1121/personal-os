import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'
import type { FinanceKPIs, MonthlyPoint, Movement, CategoryTotal, SourceTotal, MovementRaw } from './types'

type IncomeRow = Database['public']['Tables']['income_entries']['Row']
type ExpenseRow = Database['public']['Tables']['expense_entries']['Row']

const EMPTY_KPIS: FinanceKPIs = {
  ingresos: 0, gastos: 0, balance: 0, flujoNeto: 0, savingsRate: 0,
  ingresosPrevMonth: 0, gastosPrevMonth: 0, movimientosCount: 0, fuentesCount: 0,
}

// Supabase's generic Database type doesn't always flow through createServerClient
// so we cast the client to `any` and cast results to their known Row types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDB = any

async function rows<T>(q: AnyDB): Promise<T[]> {
  const { data } = await q
  return (data ?? []) as T[]
}

export async function getFinancePageData() {
  const supabase = (await createClient()) as AnyDB
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user as { id: string } | null

  if (!user) {
    return {
      kpis: EMPTY_KPIS,
      monthly: [] as MonthlyPoint[],
      movements: [] as Movement[],
      categories: [] as CategoryTotal[],
      sources: [] as SourceTotal[],
    }
  }

  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10)
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10)
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString().slice(0, 10)
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString().slice(0, 10)

  const uid = user.id

  const [
    incomeAll, expenseAll,
    incomeMonth, expensesMonth,
    incomePrev, expensesPrev,
    recentIncome, recentExpenses,
  ] = await Promise.all([
    rows<IncomeRow>(supabase.from('income_entries').select('*').eq('user_id', uid).gte('payment_date', twelveMonthsAgo)),
    rows<ExpenseRow>(supabase.from('expense_entries').select('*').eq('user_id', uid).gte('expense_date', twelveMonthsAgo)),
    rows<IncomeRow>(supabase.from('income_entries').select('*').eq('user_id', uid).gte('payment_date', currentMonthStart)),
    rows<ExpenseRow>(supabase.from('expense_entries').select('*').eq('user_id', uid).gte('expense_date', currentMonthStart)),
    rows<IncomeRow>(supabase.from('income_entries').select('*').eq('user_id', uid).gte('payment_date', prevMonthStart).lte('payment_date', prevMonthEnd)),
    rows<ExpenseRow>(supabase.from('expense_entries').select('*').eq('user_id', uid).gte('expense_date', prevMonthStart).lte('expense_date', prevMonthEnd)),
    rows<IncomeRow>(supabase.from('income_entries').select('*').eq('user_id', uid).gte('payment_date', thirtyDaysAgo).order('payment_date', { ascending: false }).limit(50)),
    rows<ExpenseRow>(supabase.from('expense_entries').select('*').eq('user_id', uid).gte('expense_date', thirtyDaysAgo).order('expense_date', { ascending: false }).limit(50)),
  ])

  const ingresos = incomeMonth.reduce((s, r) => s + Number(r.amount_clp ?? 0), 0)
  const gastos = expensesMonth.reduce((s, r) => s + Number(r.amount), 0)
  const totalIncome = incomeAll.reduce((s, r) => s + Number(r.amount_clp ?? 0), 0)
  const totalExpenses = expenseAll.reduce((s, r) => s + Number(r.amount), 0)
  const ingresosPrev = incomePrev.reduce((s, r) => s + Number(r.amount_clp ?? 0), 0)
  const gastosPrev = expensesPrev.reduce((s, r) => s + Number(r.amount), 0)
  const flujoNeto = ingresos - gastos

  const kpis: FinanceKPIs = {
    ingresos,
    gastos,
    balance: totalIncome - totalExpenses,
    flujoNeto,
    savingsRate: ingresos > 0 ? (flujoNeto / ingresos) * 100 : 0,
    ingresosPrevMonth: ingresosPrev,
    gastosPrevMonth: gastosPrev,
    movimientosCount: incomeMonth.length + expensesMonth.length,
    fuentesCount: new Set(incomeAll.map(r => r.source)).size,
  }

  // Monthly chart data — last 12 months
  const monthlyMap = new Map<string, { month: string; ingresos: number; gastos: number }>()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthlyMap.set(key, {
      month: d.toLocaleDateString('es-CL', { month: 'short' }),
      ingresos: 0,
      gastos: 0,
    })
  }
  incomeAll.forEach(r => {
    const entry = monthlyMap.get(r.payment_date.slice(0, 7))
    if (entry) entry.ingresos += Number(r.amount_clp ?? 0)
  })
  expenseAll.forEach(r => {
    const entry = monthlyMap.get(r.expense_date.slice(0, 7))
    if (entry) entry.gastos += Number(r.amount)
  })
  const monthly: MonthlyPoint[] = Array.from(monthlyMap.values())

  // Combined movements sorted by date desc
  const movements: Movement[] = []
  recentIncome.forEach(r => {
    const raw: MovementRaw = {
      type: 'in',
      source: r.source,
      channel_name: r.channel_name ?? null,
      amount_original: Number(r.amount_original),
      currency_original: r.currency_original ?? 'USD',
      amount_clp: r.amount_clp != null ? Number(r.amount_clp) : null,
      payment_date: r.payment_date,
      status: r.status ?? 'received',
      method: r.method ?? null,
      notes: r.notes ?? null,
    }
    movements.push({
      id: r.id,
      date: r.payment_date,
      concept: r.source + (r.channel_name ? ` · ${r.channel_name}` : ''),
      subconcept: r.notes ?? '',
      category: 'Ingresos digitales',
      source: r.source,
      status: r.status === 'pending' ? 'pending' : 'received',
      amount: Number(r.amount_clp ?? r.amount_original),
      currency: 'CLP',
      type: 'in',
      raw,
    })
  })
  recentExpenses.forEach(r => {
    const raw: MovementRaw = {
      type: 'out',
      category: r.category ?? 'Sin categoría',
      amount: Number(r.amount),
      currency_code: r.currency_code ?? 'CLP',
      expense_date: r.expense_date,
      description: r.description ?? null,
    }
    movements.push({
      id: r.id,
      date: r.expense_date,
      concept: r.description ?? r.category ?? 'Gasto',
      subconcept: r.category ?? '',
      category: r.category ?? 'Sin categoría',
      source: r.currency_code ?? 'CLP',
      status: 'received',
      amount: Number(r.amount),
      currency: r.currency_code ?? 'CLP',
      type: 'out',
      raw,
    })
  })
  movements.sort((a, b) => b.date.localeCompare(a.date))

  // Expense categories
  const catMap = new Map<string, number>()
  expensesMonth.forEach(r => {
    const cat = r.category ?? 'Sin categoría'
    catMap.set(cat, (catMap.get(cat) ?? 0) + Number(r.amount))
  })
  const totalGastos = gastos || 1
  const categories: CategoryTotal[] = Array.from(catMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / totalGastos) * 100),
    }))

  // Income sources
  const srcMap = new Map<string, { amount: number; channels: Set<string> }>()
  incomeMonth.forEach(r => {
    const s = srcMap.get(r.source) ?? { amount: 0, channels: new Set<string>() }
    s.amount += Number(r.amount_clp ?? 0)
    if (r.channel_name) s.channels.add(r.channel_name)
    srcMap.set(r.source, s)
  })
  const totalIngresos = ingresos || 1
  const sources: SourceTotal[] = Array.from(srcMap.entries())
    .sort((a, b) => b[1].amount - a[1].amount)
    .map(([source, { amount, channels }]) => ({
      source,
      channelName: Array.from(channels).join(', '),
      amount,
      percentage: Math.round((amount / totalIngresos) * 100),
      trend: 0,
    }))

  return { kpis, monthly, movements, categories, sources }
}
