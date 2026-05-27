import { NextResponse } from 'next/server'
import { createClient as createUserClient } from '@/lib/supabase/server'

// Dev-only seed endpoint — requires active browser session.
// Usage: navigate to /api/seed?token=dev-seed-2026 while logged in.
const SEED_TOKEN = 'dev-seed-2026'
const USD_TO_CLP = 920

function dateStr(monthsAgo: number, day: number): string {
  const d = new Date()
  d.setDate(day)
  d.setMonth(d.getMonth() - monthsAgo)
  return d.toISOString().slice(0, 10)
}

export async function GET(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== SEED_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // Use session cookies — must be called from the browser while logged in
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createUserClient()) as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado. Abre esta URL en el browser mientras estás logueado.' }, { status: 401 })
  }
  const uid = user.id

  // Clear existing data
  await supabase.from('income_entries').delete().eq('user_id', uid)
  await supabase.from('expense_entries').delete().eq('user_id', uid)

  // ─── Income — últimos 6 meses ────────────────────────────────────────────
  const incomeRows = [
    // 5 meses atrás
    { user_id: uid, source: 'YouTube', channel_name: 'Kevin Sanchez', amount_original: 312.50, currency_original: 'USD', amount_clp: Math.round(312.50 * USD_TO_CLP), payment_date: dateStr(5, 10), status: 'received', method: 'AdSense', notes: 'Monetización canal principal' },
    { user_id: uid, source: 'Facebook', channel_name: 'Kevin Rigs', amount_original: 145.00, currency_original: 'USD', amount_clp: Math.round(145.00 * USD_TO_CLP), payment_date: dateStr(5, 15), status: 'received', method: 'PayPal', notes: null },
    { user_id: uid, source: 'Consultoría', channel_name: null, amount_original: 800.00, currency_original: 'USD', amount_clp: Math.round(800.00 * USD_TO_CLP), payment_date: dateStr(5, 22), status: 'received', method: 'Wise', notes: 'Proyecto SEO cliente' },
    // 4 meses atrás
    { user_id: uid, source: 'YouTube', channel_name: 'Kevin Sanchez', amount_original: 478.20, currency_original: 'USD', amount_clp: Math.round(478.20 * USD_TO_CLP), payment_date: dateStr(4, 10), status: 'received', method: 'AdSense', notes: null },
    { user_id: uid, source: 'Facebook', channel_name: 'Kevin Rigs', amount_original: 210.00, currency_original: 'USD', amount_clp: Math.round(210.00 * USD_TO_CLP), payment_date: dateStr(4, 15), status: 'received', method: 'PayPal', notes: null },
    { user_id: uid, source: 'Consultoría', channel_name: null, amount_original: 1200.00, currency_original: 'USD', amount_clp: Math.round(1200.00 * USD_TO_CLP), payment_date: dateStr(4, 20), status: 'received', method: 'Wise', notes: 'Estrategia contenido Q2' },
    { user_id: uid, source: 'TikTok', channel_name: 'kevinrigs', amount_original: 95.50, currency_original: 'USD', amount_clp: Math.round(95.50 * USD_TO_CLP), payment_date: dateStr(4, 28), status: 'received', method: 'TikTok Creator', notes: null },
    // 3 meses atrás
    { user_id: uid, source: 'YouTube', channel_name: 'Kevin Sanchez', amount_original: 390.80, currency_original: 'USD', amount_clp: Math.round(390.80 * USD_TO_CLP), payment_date: dateStr(3, 10), status: 'received', method: 'AdSense', notes: null },
    { user_id: uid, source: 'Facebook', channel_name: 'Kevin Rigs', amount_original: 175.00, currency_original: 'USD', amount_clp: Math.round(175.00 * USD_TO_CLP), payment_date: dateStr(3, 15), status: 'received', method: 'PayPal', notes: null },
    { user_id: uid, source: 'Consultoría', channel_name: null, amount_original: 600.00, currency_original: 'USD', amount_clp: Math.round(600.00 * USD_TO_CLP), payment_date: dateStr(3, 18), status: 'received', method: 'Transferencia', notes: 'Auditoría canal YouTube' },
    // 2 meses atrás
    { user_id: uid, source: 'YouTube', channel_name: 'Kevin Sanchez', amount_original: 541.30, currency_original: 'USD', amount_clp: Math.round(541.30 * USD_TO_CLP), payment_date: dateStr(2, 10), status: 'received', method: 'AdSense', notes: null },
    { user_id: uid, source: 'Facebook', channel_name: 'Kevin Rigs', amount_original: 288.75, currency_original: 'USD', amount_clp: Math.round(288.75 * USD_TO_CLP), payment_date: dateStr(2, 15), status: 'received', method: 'PayPal', notes: null },
    { user_id: uid, source: 'Consultoría', channel_name: null, amount_original: 1500.00, currency_original: 'USD', amount_clp: Math.round(1500.00 * USD_TO_CLP), payment_date: dateStr(2, 22), status: 'received', method: 'Wise', notes: 'Proyecto mensual cliente A' },
    { user_id: uid, source: 'TikTok', channel_name: 'kevinrigs', amount_original: 120.00, currency_original: 'USD', amount_clp: Math.round(120.00 * USD_TO_CLP), payment_date: dateStr(2, 27), status: 'received', method: 'TikTok Creator', notes: null },
    // 1 mes atrás
    { user_id: uid, source: 'YouTube', channel_name: 'Kevin Sanchez', amount_original: 625.90, currency_original: 'USD', amount_clp: Math.round(625.90 * USD_TO_CLP), payment_date: dateStr(1, 10), status: 'received', method: 'AdSense', notes: null },
    { user_id: uid, source: 'Facebook', channel_name: 'Kevin Rigs', amount_original: 320.00, currency_original: 'USD', amount_clp: Math.round(320.00 * USD_TO_CLP), payment_date: dateStr(1, 15), status: 'received', method: 'PayPal', notes: null },
    { user_id: uid, source: 'Consultoría', channel_name: null, amount_original: 900.00, currency_original: 'USD', amount_clp: Math.round(900.00 * USD_TO_CLP), payment_date: dateStr(1, 20), status: 'received', method: 'Wise', notes: null },
    // Mes actual
    { user_id: uid, source: 'YouTube', channel_name: 'Kevin Sanchez', amount_original: 410.00, currency_original: 'USD', amount_clp: Math.round(410.00 * USD_TO_CLP), payment_date: dateStr(0, 10), status: 'received', method: 'AdSense', notes: null },
    { user_id: uid, source: 'Facebook', channel_name: 'Kevin Rigs', amount_original: 195.50, currency_original: 'USD', amount_clp: Math.round(195.50 * USD_TO_CLP), payment_date: dateStr(0, 15), status: 'received', method: 'PayPal', notes: null },
    { user_id: uid, source: 'Consultoría', channel_name: null, amount_original: 1100.00, currency_original: 'USD', amount_clp: Math.round(1100.00 * USD_TO_CLP), payment_date: dateStr(0, 18), status: 'pending', method: 'Wise', notes: 'Pendiente confirmación cliente' },
    { user_id: uid, source: 'TikTok', channel_name: 'kevinrigs', amount_original: 88.00, currency_original: 'USD', amount_clp: Math.round(88.00 * USD_TO_CLP), payment_date: dateStr(0, 20), status: 'received', method: 'TikTok Creator', notes: null },
  ]

  // ─── Expenses — últimos 6 meses ──────────────────────────────────────────
  const expenseRows: object[] = []
  for (let m = 5; m >= 0; m--) {
    expenseRows.push(
      { user_id: uid, category: 'Vivienda', amount: 420000, currency_code: 'CLP', expense_date: dateStr(m, 1), description: 'Arriendo departamento' },
      { user_id: uid, category: 'Suscripciones AI', amount: 20, currency_code: 'USD', expense_date: dateStr(m, 3), description: 'ChatGPT Plus' },
      { user_id: uid, category: 'Suscripciones AI', amount: 20, currency_code: 'USD', expense_date: dateStr(m, 4), description: 'Claude Pro' },
      { user_id: uid, category: 'Comida', amount: Math.round(140000 + Math.random() * 40000), currency_code: 'CLP', expense_date: dateStr(m, 15), description: 'Supermercado y delivery' },
      { user_id: uid, category: 'Transporte', amount: Math.round(35000 + Math.random() * 20000), currency_code: 'CLP', expense_date: dateStr(m, 20), description: 'Metro, Uber y bencina' },
      { user_id: uid, category: 'Servicios', amount: Math.round(25000 + Math.random() * 15000), currency_code: 'CLP', expense_date: dateStr(m, 8), description: 'Internet + telefonía' },
    )
    if (m % 2 === 0) {
      expenseRows.push(
        { user_id: uid, category: 'Producción', amount: 150, currency_code: 'USD', expense_date: dateStr(m, 12), description: 'Adobe Creative Cloud' },
        { user_id: uid, category: 'Producción', amount: Math.round(80000 + Math.random() * 60000), currency_code: 'CLP', expense_date: dateStr(m, 18), description: 'Equipamiento y accesorios' },
      )
    }
    if (m % 3 === 0) {
      expenseRows.push(
        { user_id: uid, category: 'Educación', amount: 89000, currency_code: 'CLP', expense_date: dateStr(m, 5), description: 'Matrícula universidad' },
      )
    }
    if (m <= 1) {
      expenseRows.push(
        { user_id: uid, category: 'Entretenimiento', amount: Math.round(30000 + Math.random() * 20000), currency_code: 'CLP', expense_date: dateStr(m, 25), description: 'Salidas y streaming' },
      )
    }
  }

  const { error: incomeError } = await supabase.from('income_entries').insert(incomeRows)
  if (incomeError) return NextResponse.json({ error: 'Income: ' + incomeError.message }, { status: 500 })

  const { error: expenseError } = await supabase.from('expense_entries').insert(expenseRows)
  if (expenseError) return NextResponse.json({ error: 'Expenses: ' + expenseError.message }, { status: 500 })

  return NextResponse.json({
    ok: true,
    income: incomeRows.length,
    expenses: expenseRows.length,
    message: `Seed completo: ${incomeRows.length} ingresos + ${expenseRows.length} gastos`,
  })
}
