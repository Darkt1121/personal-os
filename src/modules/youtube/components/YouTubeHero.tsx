'use client'
import { useState } from 'react'
import { createIdea, createScript } from '../actions'

const YT = '#d96b5c'
const YT_SOFT = 'rgba(217,107,92,.10)'
const YT_LINE = 'rgba(217,107,92,.35)'
const YT_GLOW = 'rgba(217,107,92,.45)'

type Props = {
  ideasCount: number
  scriptsDraftCount: number
  productionCount: number
  currentScript: string | null
}

export function YouTubeHero({ ideasCount, scriptsDraftCount, productionCount, currentScript }: Props) {
  const [modal, setModal] = useState<'idea' | 'script' | null>(null)
  const [loading, setLoading] = useState(false)
  const [ideaTitle, setIdeaTitle] = useState('')
  const [ideaTag, setIdeaTag] = useState('')
  const [scriptTitle, setScriptTitle] = useState('')

  async function handleAddIdea(e: React.FormEvent) {
    e.preventDefault()
    if (!ideaTitle.trim()) return
    setLoading(true)
    const fd = new FormData()
    fd.set('title', ideaTitle)
    fd.set('tag', ideaTag)
    await createIdea(fd)
    setLoading(false)
    setModal(null)
    setIdeaTitle('')
    setIdeaTag('')
  }

  async function handleAddScript(e: React.FormEvent) {
    e.preventDefault()
    if (!scriptTitle.trim()) return
    setLoading(true)
    const fd = new FormData()
    fd.set('title', scriptTitle)
    await createScript(fd)
    setLoading(false)
    setModal(null)
    setScriptTitle('')
  }

  const syncTime = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })

  return (
    <>
      <section
        className="relative overflow-hidden rounded-[18px]"
        style={{
          border: `1px solid rgba(217,107,92,.16)`,
          background: `
            radial-gradient(70% 110% at 16% 50%, rgba(217,107,92,.22), transparent 55%),
            radial-gradient(40% 80% at 90% 0%, rgba(217,107,92,.07), transparent 60%),
            radial-gradient(40% 100% at 50% 130%, rgba(217,107,92,.05), transparent 60%),
            linear-gradient(180deg, #0c0c11 0%, #08080a 100%)
          `,
          boxShadow: `
            0 0 0 1px rgba(217,107,92,.05),
            0 0 100px -40px ${YT_GLOW},
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
              repeating-linear-gradient(0deg, rgba(255,255,255,.018) 0 1px, transparent 1px 44px),
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

        <div className="relative z-10 grid items-center gap-8 px-10 py-10" style={{ gridTemplateColumns: '170px 1fr auto' }}>
          {/* Emblem */}
          <div className="relative flex h-[170px] w-[170px] items-center justify-center">
            <div
              className="absolute rounded-full"
              style={{
                inset: '-30px',
                background: 'radial-gradient(circle, rgba(217,107,92,.25), rgba(217,107,92,0) 65%)',
                filter: 'blur(8px)',
                animation: 'halo 6s ease-in-out infinite',
              }}
            />
            <svg viewBox="0 0 200 200" fill="none" className="relative z-10 h-[170px] w-[170px]">
              <defs>
                <radialGradient id="haloYt" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="rgba(217,107,92,.55)" />
                  <stop offset="55%" stopColor="rgba(217,107,92,.12)" />
                  <stop offset="100%" stopColor="rgba(217,107,92,0)" />
                </radialGradient>
                <filter id="softGlowYt" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" />
                </filter>
                <linearGradient id="panelYt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#181214" />
                  <stop offset="1" stopColor="#09080a" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="95" fill="url(#haloYt)" />
              <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(217,107,92,.22)" strokeWidth="1" strokeDasharray="3 7" />
              <circle cx="100" cy="100" r="74" fill="none" stroke="rgba(217,107,92,.32)" strokeWidth="1" />
              <g stroke="rgba(217,107,92,.5)" strokeWidth="1.2" strokeLinecap="round">
                <line x1="100" y1="22" x2="100" y2="29" />
                <line x1="100" y1="171" x2="100" y2="178" />
                <line x1="22" y1="100" x2="29" y2="100" />
                <line x1="171" y1="100" x2="178" y2="100" />
              </g>
              <rect x="56" y="56" width="88" height="88" rx="20" fill="url(#panelYt)" stroke="rgba(217,107,92,.5)" strokeWidth="1.4" />
              <path d="M86 78 L122 100 L86 122 Z" fill="rgba(217,107,92,.55)" filter="url(#softGlowYt)" opacity=".7" />
              <path d="M86 78 L122 100 L86 122 Z" fill="#e88a7d" stroke="#d96b5c" strokeWidth="1.2" strokeLinejoin="round" />
              <g stroke="rgba(217,107,92,.45)" strokeWidth="1.1" strokeLinecap="round">
                <line x1="60" y1="156" x2="92" y2="156" />
                <line x1="60" y1="164" x2="105" y2="164" />
                <line x1="60" y1="172" x2="85" y2="172" />
                <line x1="112" y1="156" x2="140" y2="156" />
                <line x1="112" y1="164" x2="135" y2="164" />
              </g>
              <g fill="rgba(217,107,92,.55)">
                <circle cx="38" cy="68" r="1.6" />
                <circle cx="162" cy="138" r="2" />
                <circle cx="46" cy="148" r="1.2" />
                <circle cx="158" cy="48" r="1" />
              </g>
            </svg>
          </div>

          {/* Content */}
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[.28em]" style={{ color: YT }}>
              <span className="h-[5px] w-[5px] rounded-full" style={{ background: YT, boxShadow: `0 0 8px ${YT}` }} />
              Módulo · 03 · creativo
            </div>
            <h1
              className="mb-3 font-display font-bold leading-none"
              style={{ fontSize: '78px', letterSpacing: '.5px', color: '#e8e6e1', textShadow: `0 0 80px rgba(217,107,92,.15)` }}
            >
              YouTube
            </h1>
            <p className="mb-5 max-w-[540px] text-[14.5px] leading-relaxed" style={{ color: '#8a8a8f' }}>
              Captura ideas, escribe guiones y avanza videos. Tu{' '}
              <span style={{ color: '#e8e6e1', fontWeight: 500 }}>workspace creativo personal</span>{' '}
              — sin analytics ni métricas. Solo flujo entre pensar, escribir y producir.
            </p>
            <div className="flex flex-wrap gap-2">
              <MetaChip dot={false}><b style={{ color: '#e8e6e1' }}>{ideasCount}</b> ideas</MetaChip>
              <MetaChip dot={false}><b style={{ color: '#e8e6e1' }}>{scriptsDraftCount}</b> guiones en borrador</MetaChip>
              <MetaChip dot={false}><b style={{ color: '#e8e6e1' }}>{productionCount}</b> en producción</MetaChip>
              {currentScript && (
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10.5px]"
                  style={{ border: `1px solid ${YT_LINE}`, background: YT_SOFT, color: YT }}
                >
                  <span className="h-[5px] w-[5px] rounded-full" style={{ background: YT, boxShadow: `0 0 8px ${YT}` }} />
                  escribiendo · <b>{currentScript}</b>
                </span>
              )}
              <MetaChip dot={false}>sync · <b style={{ color: '#e8e6e1' }}>{syncTime}</b></MetaChip>
            </div>
          </div>

          {/* Actions */}
          <div className="flex min-w-[170px] flex-col gap-2">
            <button
              onClick={() => setModal('idea')}
              className="flex items-center justify-center gap-2 rounded-[10px] px-4 py-3 font-mono text-[12px] font-medium tracking-[.06em] transition-all"
              style={{
                border: `1px solid ${YT_LINE}`,
                background: `linear-gradient(180deg, rgba(217,107,92,.18), rgba(217,107,92,.06))`,
                color: YT,
                boxShadow: `0 0 30px -10px ${YT_GLOW}, inset 0 1px 0 rgba(255,255,255,.06)`,
              }}
            >
              <IcoIdea />
              idea
            </button>
            <button
              onClick={() => setModal('script')}
              className="flex items-center justify-center gap-2 rounded-[10px] border border-white/[0.08] bg-transparent px-4 py-3 font-mono text-[12px] font-medium tracking-[.06em] text-foreground/60 transition-all hover:border-white/[0.12] hover:text-foreground/80"
            >
              <IcoScript />
              guion
            </button>
            <p className="mt-1 text-center font-mono text-[9.5px] uppercase tracking-[.12em] text-muted-foreground/30">
              ⌘ N nuevo · ⌘ K buscar
            </p>
          </div>
        </div>
      </section>

      {/* Quick-add overlays */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-sm rounded-[14px] p-6"
            style={{
              background: '#0e0e12',
              border: `1.4px solid ${YT_LINE}`,
              boxShadow: `0 0 60px -20px ${YT_GLOW}`,
            }}
            onClick={e => e.stopPropagation()}
          >
            {modal === 'idea' ? (
              <form onSubmit={handleAddIdea}>
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[.22em]" style={{ color: YT }}>
                  nueva idea
                </p>
                <input
                  autoFocus
                  value={ideaTitle}
                  onChange={e => setIdeaTitle(e.target.value)}
                  placeholder="Título de la idea…"
                  className="mb-3 w-full rounded-[8px] border border-white/[.06] bg-white/[.03] px-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-white/[.12]"
                />
                <input
                  value={ideaTag}
                  onChange={e => setIdeaTag(e.target.value)}
                  placeholder="Etiqueta  (estrategia, producto, AI…)"
                  className="mb-4 w-full rounded-[8px] border border-white/[.06] bg-white/[.03] px-3 py-2.5 font-mono text-[12px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-white/[.12]"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading || !ideaTitle.trim()}
                    className="flex-1 rounded-[8px] py-2.5 font-mono text-[12px] font-medium tracking-[.06em] transition-all disabled:opacity-40"
                    style={{ background: YT_SOFT, border: `1px solid ${YT_LINE}`, color: YT }}
                  >
                    {loading ? 'guardando…' : 'guardar idea'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-[8px] border border-white/[.06] px-4 py-2.5 font-mono text-[12px] text-muted-foreground/60"
                  >
                    cancelar
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddScript}>
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[.22em]" style={{ color: YT }}>
                  nuevo guion
                </p>
                <input
                  autoFocus
                  value={scriptTitle}
                  onChange={e => setScriptTitle(e.target.value)}
                  placeholder="Título del guion…"
                  className="mb-4 w-full rounded-[8px] border border-white/[.06] bg-white/[.03] px-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-white/[.12]"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading || !scriptTitle.trim()}
                    className="flex-1 rounded-[8px] py-2.5 font-mono text-[12px] font-medium tracking-[.06em] transition-all disabled:opacity-40"
                    style={{ background: YT_SOFT, border: `1px solid ${YT_LINE}`, color: YT }}
                  >
                    {loading ? 'creando…' : 'crear guion'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-[8px] border border-white/[.06] px-4 py-2.5 font-mono text-[12px] text-muted-foreground/60"
                  >
                    cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function MetaChip({ children, dot = true }: { children: React.ReactNode; dot?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10.5px]"
      style={{ border: '1px solid rgba(255,255,255,.07)', background: 'rgba(255,255,255,.018)', color: '#8a8a8f' }}
    >
      {dot && <span className="h-[5px] w-[5px] rounded-full bg-muted-foreground/25" />}
      {children}
    </span>
  )
}

function IcoIdea() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13 L8 4 L11 13 M6.5 10 L9.5 10" />
    </svg>
  )
}

function IcoScript() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2 L13 2 L13 14 L3 14 Z" />
      <path d="M5 6 L11 6 M5 9 L11 9 M5 12 L8 12" />
    </svg>
  )
}
