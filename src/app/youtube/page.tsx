import { Youtube } from 'lucide-react'

export const metadata = { title: 'YouTube — Personal OS' }

export default function YoutubePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 via-card to-card p-6 shadow-lg shadow-rose-500/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/25">
            <Youtube className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">YouTube</h1>
            <p className="text-sm text-muted-foreground">Guiones, ideas y análisis</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground text-sm">Módulo en construcción</p>
      </div>
    </div>
  )
}
