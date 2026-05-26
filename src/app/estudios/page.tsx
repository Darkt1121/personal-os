import { GraduationCap } from 'lucide-react'

export const metadata = { title: 'Estudios — Personal OS' }

export default function EstudiosPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-card to-card p-6 shadow-lg shadow-sky-500/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 border border-sky-500/25">
            <GraduationCap className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Estudios</h1>
            <p className="text-sm text-muted-foreground">Materias, evaluaciones y recursos</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground text-sm">Módulo en construcción</p>
      </div>
    </div>
  )
}
