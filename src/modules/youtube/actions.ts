'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { YoutubeIdea, YoutubeScript } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDB = any

const ideaSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  tag: z.string().optional(),
  channel: z.string().optional(),
})

const scriptSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  type: z.enum(['idea', 'borrador', 'guion']).optional(),
  channel: z.string().optional(),
  status: z.enum(['idea', 'borrador', 'revision', 'aprobado']).optional(),
})

// ──── Ideas ────────────────────────────────────────────────────

export async function createIdea(
  formData: FormData
): Promise<{ idea?: YoutubeIdea; error?: string }> {
  const supabase = (await createClient()) as AnyDB
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const parsed = ideaSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const { data, error } = await supabase
    .from('youtube_ideas')
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      tag: parsed.data.tag || null,
      channel: parsed.data.channel || 'personal',
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/youtube')
  return { idea: data as YoutubeIdea }
}

export async function deleteIdea(id: string): Promise<{ error?: string }> {
  const supabase = (await createClient()) as AnyDB
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('youtube_ideas')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/youtube')
  return {}
}

// ──── Scripts ──────────────────────────────────────────────────

export async function createScript(
  formData: FormData
): Promise<{ script?: YoutubeScript; error?: string }> {
  const supabase = (await createClient()) as AnyDB
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const parsed = scriptSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const { data, error } = await supabase
    .from('youtube_scripts')
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      type: parsed.data.type ?? 'borrador',
      channel: parsed.data.channel ?? 'personal',
      status: parsed.data.status ?? 'borrador',
      progress: 0,
      content: '',
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/youtube')
  return { script: data as YoutubeScript }
}

export async function updateScriptContent(
  id: string,
  title: string,
  content: string,
  type: string
): Promise<{ error?: string }> {
  const supabase = (await createClient()) as AnyDB
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('youtube_scripts')
    .update({ title, content, type, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return {}
}

export async function updateScriptStatus(
  id: string,
  status: string,
  progress: number
): Promise<{ error?: string }> {
  const supabase = (await createClient()) as AnyDB
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('youtube_scripts')
    .update({ status, progress, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/youtube')
  return {}
}

export async function deleteScript(id: string): Promise<{ error?: string }> {
  const supabase = (await createClient()) as AnyDB
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('youtube_scripts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/youtube')
  return {}
}
