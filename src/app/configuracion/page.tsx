import { Settings } from 'lucide-react'

export const metadata = { title: 'Configuración — Personal OS' }

export default function ConfiguracionPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="rounded-xl border border-zinc-500/20 bg-gradient-to-br from-zinc-500/10 via-card to-card p-6 shadow-lg shadow-zinc-500/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-500/15 border border-zinc-500/25">
            <Settings className="h-5 w-5 text-zinc-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Configuración</h1>
            <p className="text-sm text-muted-foreground">Preferencias del sistema</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground text-sm">Módulo en construcción</p>
      </div>
    </div>
  )
}
