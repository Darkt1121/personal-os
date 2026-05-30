export type YoutubeIdea = {
  id: string
  user_id: string
  title: string
  tag: string | null
  channel: string
  notes: string | null
  created_at: string
}

export type YoutubeScript = {
  id: string
  user_id: string
  title: string
  type: 'idea' | 'borrador' | 'guion'
  channel: string
  status: 'idea' | 'borrador' | 'revision' | 'aprobado'
  progress: number
  content: string
  created_at: string
  updated_at: string
}

export type YoutubeVideo = {
  id: string
  user_id: string
  title: string
  channel: string
  published_date: string | null
  scheduled_date: string | null
  duration: string | null
  views: number
  avg_watch_time: string | null
  ctr: number
  retention: number
  status: 'published' | 'scheduled'
  created_at: string
}

export type YoutubePageData = {
  ideas: YoutubeIdea[]
  scripts: YoutubeScript[]
  lastVideo: YoutubeVideo | null
  nextScheduled: YoutubeVideo | null
  monthlyVideos: YoutubeVideo[]
  pipeline: {
    ideas: number
    investigacion: number
    guiones: number
    grabacion: number
    edicion: number
    publicados: number
  }
}
