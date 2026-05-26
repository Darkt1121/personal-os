import { BookOpen } from 'lucide-react'

export const metadata = { title: 'Aprendizaje — Personal OS' }

export default function AprendizajePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="rounded-xl border border-lime-500/20 bg-gradient-to-br from-lime-500/10 via-card to-card p-6 shadow-lg shadow-lime-500/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/15 border border-lime-500/25">
            <BookOpen className="h-5 w-5 text-lime-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Aprendizaje</h1>
            <p className="text-sm text-muted-foreground">Notas y recursos de crecimiento</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground text-sm">Módulo en construcción</p>
      </div>
    </div>
  )
}
