import { TrendingUp, TrendingDown, Minus, Triangle } from 'lucide-react'
import type { FinanceKPIs } from '../types'

function fmt(n: number) {
  return '$ ' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function pct(current: number, prev: number) {
  if (prev === 0) return 0
  return ((current - prev) / prev) * 100
}

export function KPIRow({ kpis }: { kpis: FinanceKPIs }) {
  const inPct = pct(kpis.ingresos, kpis.ingresosPrevMonth)
  const outPct = pct(kpis.gastos, kpis.gastosPrevMonth)

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

      {/* Ingresos */}
      <div className="card-premium card-emerald rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border icobox-emerald">
              <TrendingUp className="h-3 w-3" />
            </div>
            <span className="font-mono text-[9.5px] uppercase tracking-[.18em] text-muted-foreground/45">
              Ingresos
            </span>
          </div>
          <span className="font-mono text-[9px] text-muted-foreground/30">vs mes ant.</span>
        </div>
        <div className="mt-2.5 text-[38px] font-bold leading-none text-gradient-emerald tracking-tight">
          {fmt(kpis.ingresos)}
        </div>
        <div className="mt-2 font-mono text-[10.5px] text-muted-foreground/45">
          <span style={{ color: inPct >= 0 ? '#34d399' : '#fb7185' }}>
            {inPct >= 0 ? '▲' : '▼'} {Math.abs(inPct).toFixed(1)}%
          </span>
          {' · '}
          <b className="text-foreground/55">{fmt(kpis.ingresos - kpis.ingresosPrevMonth)}</b>
        </div>
        <div className="mt-3">
          <svg viewBox="0 0 200 36" className="h-9 w-full" preserveAspectRatio="none">
            <path d="M0,28 L25,24 L50,22 L75,18 L100,20 L125,14 L150,10 L175,8 L200,4 L200,36 L0,36 Z" fill="rgba(52,211,153,.25)" />
            <path d="M0,28 L25,24 L50,22 L75,18 L100,20 L125,14 L150,10 L175,8 L200,4" stroke="#34d399" strokeWidth="1.4" fill="none" />
          </svg>
        </div>
      </div>

      {/* Gastos */}
      <div className="card-premium card-amber rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border icobox-warn">
              <TrendingDown className="h-3 w-3" />
            </div>
            <span className="font-mono text-[9.5px] uppercase tracking-[.18em] text-muted-foreground/45">
              Gastos
            </span>
          </div>
          <span className="font-mono text-[9px] text-muted-foreground/30">vs mes ant.</span>
        </div>
        <div className="mt-2.5 text-[38px] font-bold leading-none tracking-tight" style={{ color: '#c79a5c' }}>
          {fmt(kpis.gastos)}
        </div>
        <div className="mt-2 font-mono text-[10.5px] text-muted-foreground/45">
          <span style={{ color: outPct <= 0 ? '#34d399' : '#c79a5c' }}>
            {outPct <= 0 ? '▼' : '▲'} {Math.abs(outPct).toFixed(1)}%
          </span>
          {' · '}
          <b className="text-foreground/55">{fmt(kpis.gastos - kpis.gastosPrevMonth)}</b>
        </div>
        <div className="mt-3">
          <svg viewBox="0 0 200 36" className="h-9 w-full" preserveAspectRatio="none">
            <path d="M0,12 L25,18 L50,14 L75,22 L100,20 L125,24 L150,22 L175,26 L200,22 L200,36 L0,36 Z" fill="rgba(199,154,92,.22)" />
            <path d="M0,12 L25,18 L50,14 L75,22 L100,20 L125,24 L150,22 L175,26 L200,22" stroke="#c79a5c" strokeWidth="1.4" fill="none" />
          </svg>
        </div>
      </div>

      {/* Balance */}
      <div className="card-premium rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border"
              style={{ borderColor: 'rgba(255,255,255,.10)', background: 'rgba(255,255,255,.03)', color: 'rgba(255,255,255,.35)' }}
            >
              <Minus className="h-3 w-3" />
            </div>
            <span className="font-mono text-[9.5px] uppercase tracking-[.18em] text-muted-foreground/45">
              Balance
            </span>
          </div>
          <span className="font-mono text-[9px] text-muted-foreground/30">acumulado</span>
        </div>
        <div className="mt-2.5 text-[38px] font-bold leading-none tracking-tight text-foreground/85">
          {kpis.balance >= 0 ? '+' : ''}{fmt(kpis.balance)}
        </div>
        <div className="mt-2 font-mono text-[10.5px] text-muted-foreground/45">
          runway estimado · <b className="text-foreground/55">—</b>
        </div>
        <div className="mt-3">
          <svg viewBox="0 0 200 36" className="h-9 w-full" preserveAspectRatio="none">
            <path d="M0,32 L40,26 L80,20 L120,22 L160,12 L200,8" stroke="rgba(255,255,255,.18)" strokeWidth="1.4" fill="none" />
            <circle cx="200" cy="8" r="2.5" fill="#34d399" />
          </svg>
        </div>
      </div>

      {/* Flujo neto */}
      <div className="card-premium card-emerald rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border icobox-emerald">
              <Triangle className="h-[10px] w-[10px] fill-emerald-400 stroke-none" />
            </div>
            <span className="font-mono text-[9.5px] uppercase tracking-[.18em] text-muted-foreground/45">
              Flujo neto
            </span>
          </div>
          <span className="font-mono text-[9px] text-muted-foreground/30">in − out</span>
        </div>
        <div className="mt-2.5 text-[38px] font-bold leading-none text-gradient-emerald tracking-tight">
          {kpis.flujoNeto >= 0 ? '+' : ''}{fmt(kpis.flujoNeto)}
        </div>
        <div className="mt-2 font-mono text-[10.5px] text-muted-foreground/45">
          ahorro · <b className="text-foreground/55">{kpis.savingsRate.toFixed(1)}%</b>
        </div>
        <div className="mt-3 flex items-end gap-[2px]" style={{ height: '36px' }}>
          {[42, 55, 48, 62, 70, 65, 75, 88, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: i === 8 ? '#34d399' : `rgba(52,211,153,${0.28 + i * 0.06})`,
                boxShadow: i === 8 ? '0 0 8px rgba(52,211,153,.5)' : undefined,
              }}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
