import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { YoutubePageData, YoutubeIdea, YoutubeScript, YoutubeVideo } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDB = any

async function rows<T>(q: AnyDB): Promise<T[]> {
  const { data } = await q
  return (data ?? []) as T[]
}

const EMPTY: YoutubePageData = {
  ideas: [],
  scripts: [],
  lastVideo: null,
  nextScheduled: null,
  monthlyVideos: [],
  pipeline: { ideas: 0, investigacion: 0, guiones: 0, grabacion: 0, edicion: 0, publicados: 0 },
}

export async function getYoutubePageData(): Promise<YoutubePageData> {
  const supabase = (await createClient()) as AnyDB
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return EMPTY

  const uid = user.id
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)

  const [ideas, scripts, videos] = await Promise.all([
    rows<YoutubeIdea>(
      supabase.from('youtube_ideas')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
    ),
    rows<YoutubeScript>(
      supabase.from('youtube_scripts')
        .select('*')
        .eq('user_id', uid)
        .order('updated_at', { ascending: false })
    ),
    rows<YoutubeVideo>(
      supabase.from('youtube_videos')
        .select('*')
        .eq('user_id', uid)
        .order('published_date', { ascending: false })
    ),
  ])

  const lastVideo = videos.find(v => v.status === 'published') ?? null
  const nextScheduled = videos.find(v => v.status === 'scheduled') ?? null
  const monthlyVideos = videos.filter(
    v => v.status === 'published' && v.published_date && v.published_date >= monthStart
  )

  const pipeline = {
    ideas: ideas.length,
    investigacion: 0,
    guiones: scripts.filter(s => s.status === 'borrador' || s.status === 'idea').length,
    grabacion: scripts.filter(s => s.status === 'aprobado').length,
    edicion: scripts.filter(s => s.status === 'revision').length,
    publicados: videos.filter(v => v.status === 'published').length,
  }

  return { ideas, scripts, lastVideo, nextScheduled, monthlyVideos, pipeline }
}
