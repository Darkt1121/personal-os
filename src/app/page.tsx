import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function DashboardPage() {
  const now = new Date()
  const dateLabel = format(now, "EEEE d 'de' MMMM, yyyy", { locale: es })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Hero */}
      <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-card to-card p-6 shadow-lg shadow-blue-500/5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Live Overview
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm capitalize text-muted-foreground">{dateLabel}</p>
      </div>

      {/* Module grid placeholder */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Finanzas', color: 'emerald', hint: 'Ingresos, gastos, balance' },
          { label: 'Estudios', color: 'sky', hint: 'Evaluaciones y tareas' },
          { label: 'YouTube', color: 'rose', hint: 'Guiones e ideas' },
          { label: 'AI', color: 'violet', hint: 'Sesiones activas' },
        ].map(({ label, color, hint }) => (
          <div
            key={label}
            className={`rounded-xl border border-${color}-500/20 bg-gradient-to-br from-${color}-500/5 to-card p-4`}
          >
            <p className={`text-sm font-medium text-${color}-400`}>{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
