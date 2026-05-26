'use client'
import { useState, useMemo } from 'react'
import { Search, Check } from 'lucide-react'
import type { Movement } from '../types'
import { cn } from '@/lib/utils/cn'

function fmt(n: number) {
  return '$ ' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}

type TypeFilter = 'all' | 'in' | 'out'
type RangeFilter = '7d' | '30d' | '90d'

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export function MovimientosTable({ movements }: { movements: Movement[] }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>('30d')

  const rangeCutoff = rangeFilter === '7d' ? daysAgo(7) : rangeFilter === '30d' ? daysAgo(30) : daysAgo(90)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return movements.filter(m => {
      if (typeFilter !== 'all' && m.type !== typeFilter) return false
      if (m.date < rangeCutoff) return false
      if (q && !m.concept.toLowerCase().includes(q) && !m.category.toLowerCase().includes(q) && !m.source.toLowerCase().includes(q)) return false
      return true
    })
  }, [movements, typeFilter, rangeFilter, search, rangeCutoff])

  const totals = useMemo(() => {
    const inSum = filtered.filter(m => m.type === 'in').reduce((s, m) => s + m.amount, 0)
    const outSum = filtered.filter(m => m.type === 'out').reduce((s, m) => s + m.amount, 0)
    return { inSum, outSum, net: inSum - outSum }
  }, [filtered])

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-4 pb-3">
        <div className="flex flex-1 items-center gap-2.5 rounded-[10px] border border-border/50 bg-background/50 px-3.5 py-2.5">
          <Search className="h-[13px] w-[13px] shrink-0 text-muted-foreground/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="buscar concepto, fuente o categoría…"
            className="flex-1 bg-transparent font-mono text-[11.5px] text-foreground/70 placeholder:text-muted-foreground/30 outline-none"
          />
          <kbd className="rounded border border-border/50 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground/30">⌘K</kbd>
        </div>
        <div className="flex items-center gap-0.5 rounded-[10px] border border-border/50 bg-background/50 p-[3px]">
          {(['7d', '30d', '90d'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRangeFilter(r)}
              className={cn(
                'rounded-[7px] px-3 py-1.5 font-mono text-[10.5px] transition-all',
                rangeFilter === r
                  ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(52,211,153,.3)]'
                  : 'text-muted-foreground/40 hover:text-muted-foreground/60'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-7 border-y px-5 py-3.5" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
        {(['all', 'in', 'out'] as const).map(t => {
          const active = typeFilter === t
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                'flex items-center gap-1.5 font-mono text-[11px] transition-all',
                active
                  ? 'rounded-[7px] border border-emerald-500/28 bg-emerald-500/[0.08] px-2.5 py-1 text-emerald-400'
                  : 'text-muted-foreground/35 hover:text-muted-foreground/55'
              )}
            >
              tipo ·{' '}
              <b className={active ? 'text-emerald-400' : 'text-foreground/60'}>
                {t === 'all' ? 'todos' : t === 'in' ? 'ingresos' : 'gastos'}
              </b>
              {active && <span className="ml-1 text-emerald-400/60">×</span>}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ fontVariantNumeric: 'tabular-nums' }}>
          <thead>
            <tr>
              {['Fecha', 'Concepto', 'Categoría', 'Fuente', 'Estado', 'Monto'].map((h, i) => (
                <th
                  key={h}
                  className="border-b py-3.5 font-mono text-[9.5px] uppercase tracking-[.22em] text-muted-foreground/30 font-medium"
                  style={{
                    borderColor: 'rgba(255,255,255,.06)',
                    textAlign: i === 5 ? 'right' : 'left',
                    paddingLeft: i === 0 ? '20px' : '14px',
                    paddingRight: i === 5 ? '20px' : '14px',
                    width: i === 0 ? '90px' : i === 5 ? '170px' : undefined,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center font-mono text-[11px] text-muted-foreground/30">
                  {movements.length === 0 ? 'sin movimientos registrados' : 'no hay resultados para esta búsqueda'}
                </td>
              </tr>
            ) : (
              filtered.map(m => (
                <tr
                  key={m.id}
                  className="group transition-colors hover:bg-white/[0.014]"
                >
                  <td className="relative border-b py-4 pl-5 pr-3.5 align-middle" style={{ borderColor: 'rgba(255,255,255,.025)' }}>
                    <span
                      className="absolute bottom-3 left-0 top-3 w-[2px] rounded-r-sm transition-all"
                      style={{
                        background: m.type === 'in' ? '#34d399' : '#c79a5c',
                        opacity: m.type === 'in' ? 0.42 : 0.30,
                      }}
                    />
                    <span className="font-mono text-[11px] text-foreground/55">{fmtDate(m.date)}</span>
                  </td>
                  <td className="max-w-[260px] border-b px-3.5 py-4 align-middle" style={{ borderColor: 'rgba(255,255,255,.025)' }}>
                    <div className="text-[13.5px] font-medium leading-snug text-foreground/85">{m.concept}</div>
                    {m.subconcept && (
                      <div className="mt-0.5 truncate font-mono text-[10.5px] text-muted-foreground/35">{m.subconcept}</div>
                    )}
                  </td>
                  <td className="border-b px-3.5 py-4 align-middle" style={{ borderColor: 'rgba(255,255,255,.025)' }}>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/55">
                      <span
                        className="h-[6px] w-[6px] shrink-0 rounded-full"
                        style={{ background: m.type === 'in' ? '#34d399' : '#c79a5c', boxShadow: m.type === 'in' ? '0 0 6px rgba(52,211,153,.5)' : '0 0 6px rgba(199,154,92,.4)' }}
                      />
                      {m.category}
                    </span>
                  </td>
                  <td className="border-b px-3.5 py-4 align-middle" style={{ borderColor: 'rgba(255,255,255,.025)' }}>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/45">
                      <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-muted-foreground/25" />
                      {m.source}
                    </span>
                  </td>
                  <td className="border-b px-3.5 py-4 align-middle" style={{ borderColor: 'rgba(255,255,255,.025)' }}>
                    {m.status === 'received' ? (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-medium text-emerald-400"
                        style={{ border: '1px solid rgba(52,211,153,.22)', background: 'rgba(52,211,153,.09)' }}
                      >
                        <Check className="h-2.5 w-2.5 stroke-[1.6]" />
                        conciliado
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-medium"
                        style={{ border: '1px solid rgba(199,154,92,.24)', background: 'rgba(199,154,92,.08)', color: '#c79a5c' }}
                      >
                        <span
                          className="h-[7px] w-[7px] rounded-full"
                          style={{ background: '#c79a5c', animation: 'pulse-pending 1.8s infinite' }}
                        />
                        pendiente
                      </span>
                    )}
                  </td>
                  <td
                    className="border-b py-4 pl-3.5 pr-5 text-right align-middle font-mono text-[15px] font-medium"
                    style={{
                      borderColor: 'rgba(255,255,255,.025)',
                      color: m.type === 'in' ? '#34d399' : '#c79a5c',
                      textShadow: m.type === 'in' ? '0 0 18px rgba(52,211,153,.28)' : undefined,
                    }}
                  >
                    <span style={{ opacity: .55, fontWeight: 400 }}>{m.type === 'in' ? '+' : '−'}</span>
                    {fmt(m.amount)}
                    <span className="ml-1 font-mono text-[10px] font-normal text-muted-foreground/35">{m.currency}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t px-5 py-4" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
        <div className="font-mono text-[10.5px] text-muted-foreground/35">
          mostrando <b className="text-foreground/55">{filtered.length}</b> de <b className="text-foreground/55">{movements.length}</b> movimientos
        </div>
        <div className="flex gap-6 border-l border-r px-6" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
          {[
            { label: 'ingresos', value: `+ ${fmt(totals.inSum)}`, color: '#34d399' },
            { label: 'gastos', value: `− ${fmt(totals.outSum)}`, color: '#c79a5c' },
            { label: 'neto', value: `${totals.net >= 0 ? '+' : ''} ${fmt(totals.net)}`, color: 'rgba(255,255,255,.7)' },
          ].map(item => (
            <div key={item.label}>
              <div className="font-mono text-[9.5px] uppercase tracking-[.12em] text-muted-foreground/30">{item.label}</div>
              <div className="font-mono text-[13px] font-medium" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
