'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import type { YoutubeIdea, YoutubeScript } from '../types'
import { createIdea, deleteIdea, createScript, updateScriptContent } from '../actions'

const YT = '#d96b5c'
const YT_SOFT = 'rgba(217,107,92,.10)'
const YT_LINE = 'rgba(217,107,92,.35)'
const YT_GLOW = 'rgba(217,107,92,.45)'
const CARD_BG = 'radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,.025), transparent 50%), linear-gradient(180deg, #0e0e12 0%, #0a0a0d 100%)'
const CARD_SHADOW = '0 0 0 1px rgba(255,255,255,.015), 0 30px 60px -40px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.025)'

function relativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const h = diffMs / 3_600_000
  if (h < 1) return 'ahora'
  if (h < 24) return `${Math.floor(h)} h`
  const d = Math.floor(h / 24)
  if (d === 1) return 'ayer'
  if (d < 7) return `${d} d`
  return `${Math.floor(d / 7)} sem`
}

function scriptAbbr(title: string): string {
  const words = title.split(/[\s\-–—]+/).filter(Boolean)
  if (words.length === 0) return 'SC'
  const first = words[0]?.toLowerCase()
  if (first === 'episodio' && words[1]) return `EP${words[1]}`
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase()
  return words.slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

type Props = {
  ideas: YoutubeIdea[]
  scripts: YoutubeScript[]
}

export function YouTubeContent({ ideas: initIdeas, scripts: initScripts }: Props) {
  const [ideas, setIdeas] = useState(initIdeas)
  const [scripts, setScripts] = useState(initScripts)
  const [activeId, setActiveId] = useState<string | null>(initScripts[0]?.id ?? null)

  // Editor local state
  const [edTitle, setEdTitle] = useState(initScripts[0]?.title ?? '')
  const [edContent, setEdContent] = useState(initScripts[0]?.content ?? '')
  const [edType, setEdType] = useState<'idea' | 'borrador' | 'guion'>(
    (initScripts[0]?.type as 'idea' | 'borrador' | 'guion') ?? 'borrador'
  )
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('saved')

  // Quick-add state
  const [addIdeaOpen, setAddIdeaOpen] = useState(false)
  const [addIdeaTitle, setAddIdeaTitle] = useState('')
  const [addIdeaTag, setAddIdeaTag] = useState('')
  const [addScriptOpen, setAddScriptOpen] = useState(false)
  const [addScriptTitle, setAddScriptTitle] = useState('')
  const [quickCapture, setQuickCapture] = useState('')
  const [quickLoading, setQuickLoading] = useState(false)

  // Auto-save refs
  const pendingRef = useRef<{ id: string; title: string; content: string; type: string } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const activeScript = scripts.find(s => s.id === activeId) ?? null

  // Sync editor when switching scripts
  useEffect(() => {
    if (activeScript) {
      setEdTitle(activeScript.title)
      setEdContent(activeScript.content)
      setEdType(activeScript.type as 'idea' | 'borrador' | 'guion')
      setSaveStatus('saved')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  const scheduleSave = useCallback((id: string, title: string, content: string, type: string) => {
    pendingRef.current = { id, title, content, type }
    setSaveStatus('idle')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      const data = pendingRef.current
      if (!data) return
      setSaveStatus('saving')
      await updateScriptContent(data.id, data.title, data.content, data.type)
      setSaveStatus('saved')
      pendingRef.current = null
    }, 2000)
  }, [])

  async function flushSave() {
    if (!pendingRef.current) return
    clearTimeout(timerRef.current)
    const data = pendingRef.current
    setSaveStatus('saving')
    await updateScriptContent(data.id, data.title, data.content, data.type)
    setSaveStatus('saved')
    pendingRef.current = null
  }

  async function switchScript(id: string) {
    await flushSave()
    setActiveId(id)
  }

  function handleTitleChange(val: string) {
    setEdTitle(val)
    if (activeId) scheduleSave(activeId, val, edContent, edType)
  }

  function handleContentChange(val: string) {
    setEdContent(val)
    if (activeId) scheduleSave(activeId, edTitle, val, edType)
  }

  async function handleTypeChange(type: 'idea' | 'borrador' | 'guion') {
    setEdType(type)
    if (activeId) scheduleSave(activeId, edTitle, edContent, type)
  }

  async function handleQuickCapture(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && quickCapture.trim()) {
      e.preventDefault()
      setQuickLoading(true)
      const fd = new FormData()
      fd.set('title', quickCapture.trim())
      const result = await createIdea(fd)
      if (result.idea) setIdeas(prev => [result.idea!, ...prev])
      setQuickCapture('')
      setQuickLoading(false)
    }
  }

  async function handleAddIdea(e: React.FormEvent) {
    e.preventDefault()
    if (!addIdeaTitle.trim()) return
    const fd = new FormData()
    fd.set('title', addIdeaTitle)
    fd.set('tag', addIdeaTag)
    const result = await createIdea(fd)
    if (result.idea) setIdeas(prev => [result.idea!, ...prev])
    setAddIdeaTitle('')
    setAddIdeaTag('')
    setAddIdeaOpen(false)
  }

  async function handleDeleteIdea(id: string) {
    setIdeas(prev => prev.filter(i => i.id !== id))
    await deleteIdea(id)
  }

  async function handleAddScript(e: React.FormEvent) {
    e.preventDefault()
    if (!addScriptTitle.trim()) return
    const fd = new FormData()
    fd.set('title', addScriptTitle)
    const result = await createScript(fd)
    if (result.script) {
      setScripts(prev => [result.script!, ...prev])
      setActiveId(result.script!.id)
    }
    setAddScriptTitle('')
    setAddScriptOpen(false)
  }

  const wordCount = edContent.trim() ? edContent.trim().split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.round(wordCount / 200))
  const saveLabel =
    saveStatus === 'saving' ? 'guardando…'
    : saveStatus === 'idle' ? 'sin guardar'
    : 'guardado'

  const showIdeas = ideas.slice(0, 5)

  return (
    <div className="flex flex-col gap-3.5">

      {/* ── Writing section ── */}
      <div>
        <div className="mb-3 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px]"
              style={{ border: `1.4px solid ${YT_LINE}`, background: YT_SOFT, color: YT, boxShadow: `0 0 18px -10px ${YT_GLOW}` }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M2 12 L12 2 L14 4 L4 14 L2 14 Z" />
              </svg>
            </div>
            <div>
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[.22em]" style={{ color: YT }}>
                tu espacio de escritura
              </div>
              <h2 className="font-display font-bold leading-none" style={{ fontSize: '30px' }}>Escribir</h2>
              <div className="mt-1 font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>
                ideas, borradores y guiones — un solo lugar tranquilo
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>
              {activeScript ? `${scripts.indexOf(activeScript) + 1} de ${scripts.length}` : 'sin documento'}
            </span>
            <button
              onClick={() => setAddScriptOpen(true)}
              className="flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 font-mono text-[11px] tracking-[.06em] transition-all"
              style={{ border: `1px solid ${YT_LINE}`, background: YT_SOFT, color: YT }}
            >
              <span>+</span> nuevo
            </button>
          </div>
        </div>

        {/* Editor card */}
        <div
          className="relative overflow-hidden rounded-[14px]"
          style={{
            border: `1.4px solid rgba(217,107,92,.18)`,
            background: CARD_BG,
            boxShadow: `0 0 0 1px rgba(217,107,92,.06), 0 0 60px -28px ${YT_GLOW}, ${CARD_SHADOW}`,
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            minHeight: '480px',
          }}
        >
          {/* Left: editor */}
          {activeScript ? (
            <div
              className="flex flex-col"
              style={{
                padding: '24px 48px 22px',
                borderRight: '1px dashed #2a2a30',
                background: 'linear-gradient(180deg, rgba(255,255,255,.012), transparent 30%)',
              }}
            >
              {/* Mode tabs */}
              <div
                className="mb-4 flex gap-1 self-start rounded-[9px] p-[3px]"
                style={{ border: '1px solid #2a2a30', background: '#0a0a0d' }}
              >
                {(['idea', 'borrador', 'guion'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => handleTypeChange(t)}
                    className="rounded-[6px] px-3 py-1.5 font-mono text-[10.5px] tracking-[.06em] transition-all"
                    style={{
                      background: edType === t ? YT_SOFT : 'transparent',
                      color: edType === t ? YT : '#4a4a50',
                      boxShadow: edType === t ? `inset 0 0 0 1px ${YT_LINE}, 0 0 20px -10px ${YT_GLOW}` : undefined,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Toolbar */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.08em]" style={{ color: '#4a4a50' }}>
                  <span
                    className="h-[6px] w-[6px] rounded-full"
                    style={{ background: saveStatus === 'saved' ? '#5cb89e' : YT, boxShadow: saveStatus === 'saved' ? '0 0 6px #5cb89e' : `0 0 6px ${YT}` }}
                  />
                  {saveLabel}
                </div>
                <span className="font-mono text-[10px]" style={{ color: '#4a4a50' }}>
                  /guiones/{activeScript.title.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}.md
                </span>
              </div>

              {/* Title */}
              <textarea
                value={edTitle}
                onChange={e => handleTitleChange(e.target.value)}
                rows={2}
                className="mb-4 w-full resize-none border-b bg-transparent pb-3 font-display font-bold leading-[1.05] text-foreground outline-none placeholder:text-muted-foreground/30"
                style={{ fontSize: '40px', letterSpacing: '.3px', borderColor: '#2a2a30' }}
                placeholder="Título del documento…"
              />

              {/* Body */}
              <textarea
                value={edContent}
                onChange={e => handleContentChange(e.target.value)}
                className="flex-1 resize-none bg-transparent text-[15px] leading-[1.85] outline-none placeholder:text-muted-foreground/25"
                style={{ color: '#efe8df', fontFamily: 'var(--font-inter)' }}
                placeholder="Empieza a escribir…"
              />

              {/* Footer */}
              <div
                className="mt-4 flex items-center justify-between border-t pt-4 font-mono text-[10px]"
                style={{ borderColor: '#2a2a30', color: '#4a4a50' }}
              >
                <div className="flex gap-3">
                  <span><kbd className="mr-1 rounded border border-white/10 px-1 py-px text-[9px] text-foreground/40">⌘B</kbd>negrita</span>
                  <span><kbd className="mr-1 rounded border border-white/10 px-1 py-px text-[9px] text-foreground/40">⌘I</kbd>cursiva</span>
                  <span><kbd className="mr-1 rounded border border-white/10 px-1 py-px text-[9px] text-foreground/40">⌘1</kbd>título</span>
                </div>
                <div className="flex gap-3">
                  <span><b className="text-foreground/60">{wordCount}</b> palabras</span>
                  <span><b className="text-foreground/60">{readingTime} min</b> lectura</span>
                  <span style={{ color: YT }}>{activeScript.status} · {activeScript.progress}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-12" style={{ borderRight: '1px dashed #2a2a30' }}>
              <div className="font-mono text-[10.5px] uppercase tracking-[.22em]" style={{ color: '#4a4a50' }}>sin documento activo</div>
              <button
                onClick={() => setAddScriptOpen(true)}
                className="rounded-[8px] px-4 py-2 font-mono text-[12px] tracking-[.06em]"
                style={{ border: `1px solid ${YT_LINE}`, background: YT_SOFT, color: YT }}
              >
                + crear primer guion
              </button>
            </div>
          )}

          {/* Right: side panel */}
          <div className="flex flex-col gap-5 p-5" style={{ background: '#0a0a0d' }}>
            {/* Doc meta */}
            <div>
              <span className="mb-2.5 block font-mono text-[9.5px] uppercase tracking-[.22em]" style={{ color: '#4a4a50' }}>Documento</span>
              {activeScript ? (
                <div className="flex flex-col gap-2">
                  {[
                    ['tipo', edType],
                    ['canal', activeScript.channel],
                    ['estado', STATUS_LABELS[activeScript.status] ?? activeScript.status],
                    ['creado', relativeTime(activeScript.created_at)],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-baseline justify-between font-mono text-[11px]" style={{ color: '#8a8a8f' }}>
                      <span>{label}</span>
                      <b className="font-medium" style={{ color: label === 'tipo' ? YT : '#e8e6e1' }}>{val}</b>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>—</p>
              )}
            </div>

            {/* Quick capture */}
            <div>
              <span className="mb-2.5 block font-mono text-[9.5px] uppercase tracking-[.22em]" style={{ color: '#4a4a50' }}>Captura rápida</span>
              <div className="rounded-[10px] p-3" style={{ border: '1px dashed #2a2a30', background: '#0c0c10' }}>
                <textarea
                  value={quickCapture}
                  onChange={e => setQuickCapture(e.target.value)}
                  onKeyDown={handleQuickCapture}
                  rows={2}
                  disabled={quickLoading}
                  placeholder="una nueva idea, sin salir del guion…"
                  className="w-full resize-none bg-transparent text-[12.5px] leading-[1.55] outline-none placeholder:italic"
                  style={{ color: '#8a8a8f' }}
                />
                <div className="mt-1 text-right font-mono text-[9.5px]" style={{ color: YT }}>⏎ guardar como idea</div>
              </div>
            </div>

            {/* Connected */}
            <div>
              <span className="mb-2.5 block font-mono text-[9.5px] uppercase tracking-[.22em]" style={{ color: '#4a4a50' }}>Conectados</span>
              <div className="flex flex-col">
                {scripts.filter(s => s.id !== activeId).slice(0, 3).map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => switchScript(s.id)}
                    className="flex items-start gap-2 py-2 text-left transition-opacity hover:opacity-80"
                    style={{ borderBottom: i < 2 ? '1px dashed #2a2a30' : undefined }}
                  >
                    <span className="mt-2 h-[5px] w-[5px] flex-none rounded-full" style={{ background: YT, boxShadow: `0 0 6px ${YT}` }} />
                    <div className="min-w-0">
                      <div className="truncate text-[12px] leading-[1.3]" style={{ color: '#e8e6e1' }}>{s.title}</div>
                      <div className="mt-0.5 font-mono text-[9.5px]" style={{ color: '#4a4a50' }}>{s.type} · {relativeTime(s.updated_at)}</div>
                    </div>
                  </button>
                ))}
                {scripts.filter(s => s.id !== activeId).length === 0 && (
                  <p className="font-mono text-[10px]" style={{ color: '#4a4a50' }}>sin documentos relacionados</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ideas + Guiones ── */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr' }}>

        {/* Ideas */}
        <div
          className="rounded-[14px] p-[18px]"
          style={{ border: '1.4px solid #252530', background: CARD_BG, boxShadow: CARD_SHADOW }}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px]"
                style={{ border: `1.4px solid ${YT_LINE}`, background: YT_SOFT, color: YT }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M5 13 L8 4 L11 13 M6.5 10 L9.5 10" /><circle cx="8" cy="2" r="1" />
                </svg>
              </div>
              <div>
                <h2 className="font-display font-bold" style={{ fontSize: '22px' }}>Ideas</h2>
                <div className="font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>{ideas.length} capturadas · ligero, sin formato</div>
              </div>
            </div>
            <button
              onClick={() => setAddIdeaOpen(true)}
              className="font-mono text-[10.5px] transition-opacity hover:opacity-80"
              style={{ color: YT }}
            >
              + nueva idea
            </button>
          </div>

          {/* Add idea inline form */}
          {addIdeaOpen && (
            <form onSubmit={handleAddIdea} className="mb-3 flex flex-col gap-2 rounded-[9px] p-3" style={{ background: '#0c0c10', border: `1px dashed ${YT_LINE}` }}>
              <input
                autoFocus
                value={addIdeaTitle}
                onChange={e => setAddIdeaTitle(e.target.value)}
                placeholder="Título de la idea…"
                className="w-full bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground/40"
              />
              <input
                value={addIdeaTag}
                onChange={e => setAddIdeaTag(e.target.value)}
                placeholder="Etiqueta (estrategia, AI, opinión…)"
                className="w-full bg-transparent font-mono text-[10.5px] text-muted-foreground/60 outline-none placeholder:text-muted-foreground/30"
              />
              <div className="flex gap-2">
                <button type="submit" className="font-mono text-[10.5px]" style={{ color: YT }}>guardar</button>
                <button type="button" onClick={() => setAddIdeaOpen(false)} className="font-mono text-[10.5px] text-muted-foreground/40">cancelar</button>
              </div>
            </form>
          )}

          <div className="flex flex-col">
            {showIdeas.length === 0 && !addIdeaOpen ? (
              <p className="py-6 text-center font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>Sin ideas todavía.</p>
            ) : (
              showIdeas.map((idea, i) => (
                <div
                  key={idea.id}
                  className="group grid items-center gap-3 py-3"
                  style={{
                    gridTemplateColumns: 'auto 1fr auto auto',
                    borderBottom: i < showIdeas.length - 1 ? '1px dashed #2a2a30' : undefined,
                  }}
                >
                  <span className="h-[6px] w-[6px] flex-none rounded-full" style={{ background: YT, boxShadow: `0 0 6px ${YT}` }} />
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium leading-[1.3]" style={{ color: '#e8e6e1' }}>{idea.title}</div>
                    <div className="mt-0.5 font-mono text-[10px]" style={{ color: '#4a4a50' }}>
                      {idea.tag && <span style={{ color: YT }}>{idea.tag}</span>}
                      {idea.tag && ' · '}
                      {idea.channel}
                    </div>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: '#4a4a50' }}>{relativeTime(idea.created_at)}</span>
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ color: '#4a4a50' }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {ideas.length > 0 && (
            <div className="mt-3 flex items-center justify-between border-t pt-3 font-mono text-[10.5px]" style={{ borderColor: '#2a2a30', color: '#4a4a50' }}>
              <span>mostrando {Math.min(5, ideas.length)} de {ideas.length}</span>
              {ideas.length > 5 && <span style={{ color: YT }}>ver todas →</span>}
            </div>
          )}
        </div>

        {/* Guiones */}
        <div
          className="rounded-[14px] p-[18px]"
          style={{
            border: `1.4px solid rgba(217,107,92,.18)`,
            background: CARD_BG,
            boxShadow: `0 0 0 1px rgba(217,107,92,.06), 0 0 60px -28px ${YT_GLOW}, ${CARD_SHADOW}`,
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px]"
                style={{ border: `1.4px solid ${YT_LINE}`, background: YT_SOFT, color: YT }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M3 2 L13 2 L13 14 L3 14 Z" /><path d="M5 6 L11 6 M5 9 L11 9 M5 12 L8 12" />
                </svg>
              </div>
              <div>
                <h2 className="font-display font-bold" style={{ fontSize: '22px' }}>Guiones</h2>
                <div className="font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>
                  {scripts.length} en proceso · borrador / revisión / aprobado
                </div>
              </div>
            </div>
            <button
              onClick={() => setAddScriptOpen(true)}
              className="font-mono text-[10.5px] transition-opacity hover:opacity-80"
              style={{ color: YT }}
            >
              + nuevo guion
            </button>
          </div>

          {/* Add script inline form */}
          {addScriptOpen && (
            <form onSubmit={handleAddScript} className="mb-3 flex flex-col gap-2 rounded-[9px] p-3" style={{ background: '#0c0c10', border: `1px dashed ${YT_LINE}` }}>
              <input
                autoFocus
                value={addScriptTitle}
                onChange={e => setAddScriptTitle(e.target.value)}
                placeholder="Título del guion…"
                className="w-full bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground/40"
              />
              <div className="flex gap-2">
                <button type="submit" className="font-mono text-[10.5px]" style={{ color: YT }}>crear</button>
                <button type="button" onClick={() => setAddScriptOpen(false)} className="font-mono text-[10.5px] text-muted-foreground/40">cancelar</button>
              </div>
            </form>
          )}

          <div className="flex flex-col">
            {scripts.length === 0 && !addScriptOpen ? (
              <p className="py-6 text-center font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>Sin guiones. Crea el primero.</p>
            ) : (
              scripts.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => switchScript(s.id)}
                  className="grid items-center gap-3.5 py-3.5 text-left transition-opacity hover:opacity-80"
                  style={{
                    gridTemplateColumns: 'auto 1fr auto',
                    borderBottom: i < scripts.length - 1 ? '1px dashed #2a2a30' : undefined,
                  }}
                >
                  {/* Doc icon */}
                  <div
                    className="flex h-[32px] w-[28px] flex-none items-center justify-center rounded-[5px] font-mono text-[8.5px] font-bold leading-none"
                    style={{
                      border: `1.4px solid ${s.id === activeId ? YT_LINE : '#3a3a42'}`,
                      background: s.id === activeId ? YT_SOFT : '#0d0d11',
                      color: s.id === activeId ? YT : '#8a8a8f',
                      letterSpacing: '.06em',
                    }}
                  >
                    {scriptAbbr(s.title)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-medium leading-[1.3]" style={{ color: '#e8e6e1' }}>{s.title}</div>
                    <div className="mt-0.5 font-mono text-[10px]" style={{ color: '#4a4a50' }}>
                      {s.channel} · {wordCount > 0 && s.id === activeId ? `${wordCount}` : '0'} palabras
                    </div>
                  </div>
                  <StatusBadge status={s.status} progress={s.progress} />
                </button>
              ))
            )}
          </div>

          {scripts.length > 0 && (
            <div className="mt-3 flex items-center justify-between border-t pt-3 font-mono text-[10.5px]" style={{ borderColor: '#2a2a30', color: '#4a4a50' }}>
              <span>{scripts.length} guiones</span>
              <span style={{ color: YT }}>ver todos →</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status, progress }: { status: string; progress: number }) {
  const styles: Record<string, React.CSSProperties> = {
    borrador: { background: YT_SOFT, color: YT, borderColor: YT_LINE },
    revision: { background: 'rgba(199,154,92,.08)', color: '#c79a5c', borderColor: 'rgba(199,154,92,.32)' },
    aprobado: { background: 'rgba(92,184,158,.08)', color: '#5cb89e', borderColor: 'rgba(92,184,158,.32)' },
    idea: { background: 'rgba(138,138,143,.05)', color: '#8a8a8f', borderColor: '#3a3a42' },
  }
  const label = status === 'idea' ? 'idea' : `${STATUS_LABELS[status] ?? status} · ${progress}%`
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[.06em]"
      style={{ border: '1px solid transparent', ...styles[status] }}
    >
      {label}
    </span>
  )
}

const STATUS_LABELS: Record<string, string> = {
  idea: 'idea',
  borrador: 'borrador',
  revision: 'revisión',
  aprobado: 'aprobado',
}
