'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import type { FinanceKPIs } from '../types'
import { AddIncomeModal } from './AddIncomeModal'
import { AddExpenseModal } from './AddExpenseModal'

export function FinanceHero({ kpis }: { kpis: FinanceKPIs }) {
  const [incomeOpen, setIncomeOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)

  const syncTime = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })

  return (
    <>
      <section
        className="relative overflow-hidden rounded-[18px]"
        style={{
          border: '1px solid rgba(52,211,153,.16)',
          background: `
            radial-gradient(70% 110% at 16% 50%, rgba(52,211,153,.20), transparent 55%),
            radial-gradient(40% 80% at 90% 0%, rgba(52,211,153,.07), transparent 60%),
            radial-gradient(40% 100% at 50% 130%, rgba(52,211,153,.05), transparent 60%),
            linear-gradient(180deg, #0c0c11 0%, #08080a 100%)
          `,
          boxShadow: `
            0 0 0 1px rgba(52,211,153,.05),
            0 0 100px -40px rgba(52,211,153,.45),
            0 50px 100px -50px rgba(0,0,0,.9),
            inset 0 1px 0 rgba(255,255,255,.035)
          `,
        }}
      >
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(0deg,  rgba(255,255,255,.018) 0 1px, transparent 1px 44px),
              repeating-linear-gradient(90deg, rgba(255,255,255,.018) 0 1px, transparent 1px 44px)
            `,
            WebkitMaskImage: 'radial-gradient(70% 90% at 18% 50%, #000, transparent 80%)',
            maskImage: 'radial-gradient(70% 90% at 18% 50%, #000, transparent 80%)',
          }}
        />
        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(110% 60% at 80% 100%, transparent 40%, rgba(0,0,0,.55) 100%),
              linear-gradient(180deg, transparent 60%, rgba(0,0,0,.25) 100%)
            `,
          }}
        />

        <div className="relative z-10 grid grid-cols-[160px_1fr_auto] items-center gap-8 px-10 py-10">
          {/* Emblem */}
          <div className="relative flex h-[160px] w-[160px] items-center justify-center">
            <div
              className="absolute inset-[-30px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(52,211,153,.25), rgba(52,211,153,0) 65%)',
                filter: 'blur(8px)',
                animation: 'halo 6s ease-in-out infinite',
              }}
            />
            <svg viewBox="0 0 200 200" fill="none" className="relative z-10 h-[160px] w-[160px]">
              <defs>
                <radialGradient id="haloCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="rgba(52,211,153,.55)" />
                  <stop offset="55%" stopColor="rgba(52,211,153,.12)" />
                  <stop offset="100%" stopColor="rgba(52,211,153,0)" />
                </radialGradient>
                <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" />
                </filter>
                <linearGradient id="markPanel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0e1014" />
                  <stop offset="1" stopColor="#08090b" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="95" fill="url(#haloCore)" />
              <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(52,211,153,.22)" strokeWidth="1" strokeDasharray="3 7" />
              <circle cx="100" cy="100" r="74" fill="none" stroke="rgba(52,211,153,.32)" strokeWidth="1" />
              <g stroke="rgba(52,211,153,.5)" strokeWidth="1.2" strokeLinecap="round">
                <line x1="100" y1="22" x2="100" y2="29" />
                <line x1="100" y1="171" x2="100" y2="178" />
                <line x1="22" y1="100" x2="29" y2="100" />
                <line x1="171" y1="100" x2="178" y2="100" />
              </g>
              <rect x="56" y="56" width="88" height="88" rx="18" fill="url(#markPanel)" stroke="rgba(52,211,153,.5)" strokeWidth="1.4" />
              <line x1="68" y1="128" x2="132" y2="128" stroke="rgba(52,211,153,.25)" strokeWidth="1" strokeDasharray="2 3" />
              <g stroke="rgba(52,211,153,.5)" strokeWidth="6" strokeLinecap="round" filter="url(#softGlow)" opacity=".75">
                <line x1="72" y1="128" x2="72" y2="116" />
                <line x1="86" y1="128" x2="86" y2="104" />
                <line x1="100" y1="128" x2="100" y2="90" />
                <line x1="114" y1="128" x2="114" y2="82" />
                <line x1="128" y1="128" x2="128" y2="70" />
              </g>
              <g stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round">
                <line x1="72" y1="128" x2="72" y2="116" />
                <line x1="86" y1="128" x2="86" y2="104" />
                <line x1="100" y1="128" x2="100" y2="90" />
                <line x1="114" y1="128" x2="114" y2="82" />
                <line x1="128" y1="128" x2="128" y2="70" />
              </g>
              <path d="M72,116 Q86,104 100,90 T128,70" stroke="rgba(255,255,255,.85)" strokeWidth="1.1" fill="none" strokeDasharray="2 3" opacity=".7" />
              <circle cx="128" cy="70" r="7" fill="#34d399" filter="url(#softGlow)" opacity=".7" />
              <circle cx="128" cy="70" r="3.5" fill="#0a0a0c" stroke="#34d399" strokeWidth="1.6" />
              <circle cx="128" cy="70" r="1.4" fill="#34d399" />
              <g fill="rgba(52,211,153,.55)">
                <circle cx="38" cy="68" r="1.6" />
                <circle cx="162" cy="138" r="2" />
                <circle cx="46" cy="148" r="1.2" />
                <circle cx="158" cy="48" r="1" />
              </g>
            </svg>
          </div>

          {/* Content */}
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[.28em]" style={{ color: '#34d399' }}>
              <span className="h-[5px] w-[5px] rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px #34d399' }} />
              Módulo · 01 · principal
            </div>
            <h1
              className="mb-3 text-[72px] font-bold leading-none tracking-wide"
              style={{ color: '#e8e6e1', textShadow: '0 0 80px rgba(52,211,153,.15)' }}
            >
              Finanzas
            </h1>
            <p className="mb-5 max-w-[520px] text-[14.5px] leading-relaxed text-muted-foreground/60">
              Registra y entiende tu dinero — de dónde viene y hacia dónde va.{' '}
              <span className="text-foreground/80">Sistema local-first</span> · sin software corporativo de por medio.
            </p>
            <div className="flex flex-wrap gap-2">
              <MetaChip label="movimientos" value={kpis.movimientosCount} />
              <MetaChip label="fuentes activas" value={kpis.fuentesCount} />
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10.5px]"
                style={{ border: '1px solid rgba(52,211,153,.35)', background: 'rgba(52,211,153,.10)', color: '#34d399' }}
              >
                <span className="h-[5px] w-[5px] rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px #34d399' }} />
                sync · <b>{syncTime}</b>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex min-w-[170px] flex-col gap-2">
            <button
              onClick={() => setIncomeOpen(true)}
              className="flex items-center justify-center gap-2 rounded-[10px] px-4 py-3 font-mono text-[12px] font-medium tracking-[.06em] transition-all"
              style={{
                border: '1px solid rgba(52,211,153,.35)',
                background: 'linear-gradient(180deg, rgba(52,211,153,.18), rgba(52,211,153,.06))',
                color: '#34d399',
                boxShadow: '0 0 30px -10px rgba(52,211,153,.5), inset 0 1px 0 rgba(255,255,255,.06)',
              }}
            >
              <Plus className="h-[13px] w-[13px]" />
              ingreso
            </button>
            <button
              onClick={() => setExpenseOpen(true)}
              className="flex items-center justify-center gap-2 rounded-[10px] border border-white/[0.08] bg-transparent px-4 py-3 font-mono text-[12px] font-medium tracking-[.06em] text-foreground/60 transition-all hover:border-white/[0.12] hover:text-foreground/80"
            >
              <Minus className="h-[13px] w-[13px]" />
              gasto
            </button>
            <p className="mt-1 text-center font-mono text-[9.5px] uppercase tracking-[.12em] text-muted-foreground/30">
              ⌘ N nuevo · ⌘ K buscar
            </p>
          </div>
        </div>
      </section>

      <AddIncomeModal open={incomeOpen} onClose={() => setIncomeOpen(false)} />
      <AddExpenseModal open={expenseOpen} onClose={() => setExpenseOpen(false)} />
    </>
  )
}

function MetaChip({ label, value }: { label: string; value: number }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10.5px] text-muted-foreground/55"
      style={{ border: '1px solid rgba(255,255,255,.07)', background: 'rgba(255,255,255,.018)' }}
    >
      <span className="h-[5px] w-[5px] rounded-full bg-muted-foreground/25" />
      <b className="text-foreground/70">{value}</b> {label}
    </span>
  )
}
