import { TrendingUp } from 'lucide-react'

export const metadata = { title: 'Finanzas — Personal OS' }

export default function FinanzasPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 shadow-lg shadow-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/25">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Finanzas</h1>
            <p className="text-sm text-muted-foreground">Ingresos, gastos y balance</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground text-sm">Módulo en construcción</p>
      </div>
    </div>
  )
}
