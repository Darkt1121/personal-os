'use client'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, type TooltipProps,
} from 'recharts'
import type { MonthlyPoint } from '../types'

function fmt(n: number) {
  return '$ ' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-[10px] px-3.5 py-3"
      style={{
        background: 'linear-gradient(180deg, #14151c, #0d0f14)',
        border: '1px solid rgba(255,255,255,.09)',
        boxShadow: '0 8px 28px -8px rgba(0,0,0,.8)',
      }}
    >
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground/40">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center gap-2.5 font-mono text-[12px]">
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{ background: entry.name === 'ingresos' ? '#34d399' : '#c79a5c' }}
          />
          <span className="text-muted-foreground/50">{entry.name}</span>
          <span
            className="ml-auto font-medium"
            style={{ color: entry.name === 'ingresos' ? '#34d399' : '#c79a5c' }}
          >
            {fmt(entry.value ?? 0)}
          </span>
        </div>
      ))}
    </div>
  )
}

type Props = {
  data: MonthlyPoint[]
  currentMonthIngresos: number
  currentMonthGastos: number
}

export function EvolutionChart({ data, currentMonthIngresos, currentMonthGastos }: Props) {
  return (
    <div>
      {/* Chart header */}
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[9.5px] uppercase tracking-[.18em] text-muted-foreground/40">Ingresos · mes actual</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-[52px] font-bold leading-none text-emerald-400">{fmt(currentMonthIngresos)}</span>
          </div>
          <p className="mt-1 font-mono text-[10.5px] text-muted-foreground/35">
            promedio 12M · <b className="text-foreground/50">{data.length > 0 ? fmt(Math.round(data.reduce((s, d) => s + d.ingresos, 0) / (data.filter(d => d.ingresos > 0).length || 1))) : '—'}</b>
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[9.5px] uppercase tracking-[.18em] text-muted-foreground/40">Gastos · mes actual</p>
          <div className="mt-1 flex items-baseline justify-end gap-3">
            <span className="text-[36px] font-bold leading-none" style={{ color: '#c79a5c' }}>{fmt(currentMonthGastos)}</span>
          </div>
          <p className="mt-1 font-mono text-[10.5px] text-muted-foreground/35">
            promedio 12M · <b className="text-foreground/50">{data.length > 0 ? fmt(Math.round(data.reduce((s, d) => s + d.gastos, 0) / (data.filter(d => d.gastos > 0).length || 1))) : '—'}</b>
          </p>
        </div>
      </div>

      {/* Recharts area chart */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.42} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c79a5c" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#c79a5c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="rgba(255,255,255,.04)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: '#4a4a50' }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: '#4a4a50' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v === 0 ? '' : `$${(v / 1000).toFixed(0)}k`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,.06)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="gastos"
            stroke="#c79a5c"
            strokeWidth={1.4}
            strokeDasharray="4 4"
            fill="url(#expenseArea)"
            dot={false}
            activeDot={{ r: 4, fill: '#c79a5c', stroke: '#0a0a0c', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="ingresos"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#incomeArea)"
            dot={false}
            activeDot={{ r: 4, fill: '#34d399', stroke: '#0a0a0c', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
        <div className="flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground/50">
          <span className="h-[2px] w-[10px] rounded-full bg-emerald-400" />
          ingresos
        </div>
        <div className="flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground/50">
          <span className="h-0 w-[10px] border-t-[1.5px] border-dashed" style={{ borderColor: '#c79a5c' }} />
          gastos
        </div>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground/30">datos locales · últimos 12 meses</span>
      </div>
    </div>
  )
}
