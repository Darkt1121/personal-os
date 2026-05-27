'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type IncomeInsert = Database['public']['Tables']['income_entries']['Insert']
type ExpenseInsert = Database['public']['Tables']['expense_entries']['Insert']

// Parses Chilean and international number formats:
// "166.835" (CL thousand sep)  → 166835
// "166,83"  (CL decimal)       → 166.83
// "1.500.000"                  → 1500000
// "166.83"  (US decimal)       → 166.83
function parseAmount(val: unknown): number {
  const str = String(val ?? '').trim().replace(/\s/g, '')
  if (!str) return NaN
  if (str.includes(',')) {
    // Comma present → comma is decimal separator, dots are thousand separators
    return parseFloat(str.replace(/\./g, '').replace(',', '.'))
  }
  const parts = str.split('.')
  if (parts.length > 2) {
    // Multiple dots → all are thousand separators
    return parseFloat(parts.join(''))
  }
  if (parts.length === 2 && parts[1].length === 3) {
    // Single dot with exactly 3 digits after → thousand separator (e.g. 166.835)
    return parseFloat(parts.join(''))
  }
  return parseFloat(str)
}

const amountField = z.preprocess(parseAmount, z.number().positive())
const optionalAmountField = z.preprocess(
  (val) => (String(val ?? '').trim() === '' ? undefined : parseAmount(val)),
  z.number().positive().optional()
)

const incomeSchema = z.object({
  source: z.string().min(1),
  channel_name: z.string().optional(),
  amount_original: amountField,
  currency_original: z.string().min(1),
  amount_clp: optionalAmountField,
  payment_date: z.string().min(1),
  status: z.enum(['received', 'pending']),
  method: z.string().optional(),
  notes: z.string().optional(),
})

const expenseSchema = z.object({
  category: z.string().min(1),
  amount: amountField,
  currency_code: z.string().min(1),
  expense_date: z.string().min(1),
  description: z.string().optional(),
})

export async function createIncomeEntry(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const parsed = incomeSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Datos inválidos: ' + parsed.error.issues[0]?.message }

  const payload: IncomeInsert = {
    user_id: user.id as string,
    source: parsed.data.source,
    channel_name: parsed.data.channel_name ?? null,
    amount_original: parsed.data.amount_original,
    currency_original: parsed.data.currency_original,
    amount_clp: parsed.data.amount_clp ?? parsed.data.amount_original,
    payment_date: parsed.data.payment_date,
    status: parsed.data.status,
    method: parsed.data.method ?? null,
    notes: parsed.data.notes ?? null,
  }
  const { error } = await supabase.from('income_entries').insert(payload)

  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/finanzas')
  return { success: true }
}

export async function updateIncomeEntry(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const parsed = incomeSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Datos inválidos: ' + parsed.error.issues[0]?.message }

  const { error } = await supabase
    .from('income_entries')
    .update({
      source: parsed.data.source,
      channel_name: parsed.data.channel_name ?? null,
      amount_original: parsed.data.amount_original,
      currency_original: parsed.data.currency_original,
      amount_clp: parsed.data.amount_clp ?? parsed.data.amount_original,
      payment_date: parsed.data.payment_date,
      status: parsed.data.status,
      method: parsed.data.method ?? null,
      notes: parsed.data.notes ?? null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/finanzas')
  return { success: true }
}

export async function deleteIncomeEntry(id: string): Promise<{ success?: boolean; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('income_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/finanzas')
  return { success: true }
}

export async function createExpenseEntry(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const parsed = expenseSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Datos inválidos: ' + parsed.error.issues[0]?.message }

  const payload: ExpenseInsert = {
    user_id: user.id as string,
    category: parsed.data.category,
    amount: parsed.data.amount,
    currency_code: parsed.data.currency_code,
    expense_date: parsed.data.expense_date,
    description: parsed.data.description ?? null,
  }
  const { error } = await supabase.from('expense_entries').insert(payload)

  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/finanzas')
  return { success: true }
}

export async function updateExpenseEntry(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const parsed = expenseSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Datos inválidos: ' + parsed.error.issues[0]?.message }

  const { error } = await supabase
    .from('expense_entries')
    .update({
      category: parsed.data.category,
      amount: parsed.data.amount,
      currency_code: parsed.data.currency_code,
      expense_date: parsed.data.expense_date,
      description: parsed.data.description ?? null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/finanzas')
  return { success: true }
}

export async function deleteExpenseEntry(id: string): Promise<{ success?: boolean; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('expense_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/finanzas')
  return { success: true }
}
