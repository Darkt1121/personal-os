'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type IncomeInsert = Database['public']['Tables']['income_entries']['Insert']
type ExpenseInsert = Database['public']['Tables']['expense_entries']['Insert']

const incomeSchema = z.object({
  source: z.string().min(1),
  channel_name: z.string().optional(),
  amount_original: z.coerce.number().positive(),
  currency_original: z.string().min(1),
  amount_clp: z.coerce.number().positive().optional(),
  payment_date: z.string().min(1),
  status: z.enum(['received', 'pending']),
  method: z.string().optional(),
  notes: z.string().optional(),
})

const expenseSchema = z.object({
  category: z.string().min(1),
  amount: z.coerce.number().positive(),
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
