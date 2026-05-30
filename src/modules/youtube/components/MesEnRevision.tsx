import type { YoutubeVideo } from '../types'

const YT = '#d96b5c'
const YT_SOFT = 'rgba(217,107,92,.10)'
const YT_LINE = 'rgba(217,107,92,.35)'
const YT_GLOW = 'rgba(217,107,92,.45)'
const CARD_BG = 'radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,.025), transparent 50%), linear-gradient(180deg, #0e0e12 0%, #0a0a0d 100%)'
const CARD_SHADOW = '0 0 0 1px rgba(255,255,255,.015), 0 30px 60px -40px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.025)'

type Props = {
  lastVideo: YoutubeVideo | null
  monthlyVideos: YoutubeVideo[]
  nextScheduled: YoutubeVideo | null
}

function getInsights(v: YoutubeVideo) {
  const retGood = v.retention > 45
  const ctrGood = Number(v.ctr) >= 5
  return [
    {
      type: 'ok' as const,
      label: 'qué funciona',
      text: retGood
        ? `La retención está en ${v.retention}% — por encima del promedio. El hook inicial está funcionando bien.`
        : `El video mantiene a ${v.retention}% del público hasta el final. Hay espacio para mejorar el ritmo interno.`,
    },
    {
      type: 'bad' as const,
      label: 'qué mejorar',
      text: !ctrGood
        ? `El CTR en ${Number(v.ctr).toFixed(1)}% está bajo. La miniatura y el título pueden estar compitiendo en lugar de complementarse.`
        : `Con ${Number(v.ctr).toFixed(1)}% de CTR el video está captando bien la atención desde el feed.`,
    },
    {
      type: 'why' as const,
      label: 'posible razón',
      text: `El tiempo de visualización ${v.avg_watch_time ? `de ${v.avg_watch_time}` : 'promedio'} sugiere que el contenido del tramo medio puede perder ritmo. Considera condensar secciones técnicas o agregar cortes.`,
    },
    {
      type: 'next' as const,
      label: 'siguiente paso',
      text: `Para el próximo video: ${retGood ? 'replica el formato del hook' : 'prueba un hook más directo al beneficio'}. ${!ctrGood ? 'Prueba una miniatura sin texto superpuesto.' : 'Mantén la miniatura actual como referencia base.'}`,
    },
  ]
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}

function monthName() {
  return new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
}

export function MesEnRevision({ lastVideo, monthlyVideos, nextScheduled }: Props) {
  return (
    <div>
      {/* Section header */}
      <div className="mb-4 flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px]"
            style={{ border: `1.4px solid ${YT_LINE}`, background: YT_SOFT, color: YT }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <rect x="2" y="3.5" width="12" height="9" rx="2" />
              <path d="M7 6.5 L10.5 8 L7 9.5 Z" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[.22em]" style={{ color: YT }}>
              qué publicaste este mes
            </div>
            <h2 className="font-display font-bold leading-none" style={{ fontSize: '30px' }}>Mes en revisión</h2>
            <div className="mt-1 font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>
              {monthName()} · {monthlyVideos.length} videos publicados
            </div>
          </div>
        </div>
        <div className="font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>canal personal</div>
      </div>

      {/* Two-column grid */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: '1.55fr 1fr' }}>

        {/* Last video + AI analysis */}
        <div
          className="rounded-[14px] p-6"
          style={{
            border: `1.4px solid rgba(217,107,92,.18)`,
            background: CARD_BG,
            boxShadow: `0 0 0 1px rgba(217,107,92,.06), 0 0 60px -28px ${YT_GLOW}, ${CARD_SHADOW}`,
          }}
        >
          {lastVideo ? (
            <div className="flex flex-col gap-4">
              {/* Video header */}
              <div className="grid items-center gap-4" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                {/* Thumbnail */}
                <div
                  className="relative h-[84px] w-[148px] flex-none overflow-hidden rounded-[8px]"
                  style={{
                    background: `radial-gradient(120% 90% at 30% 20%, rgba(217,107,92,.25), transparent 60%), linear-gradient(135deg, #1a1418, #0b0a0d)`,
                    border: `1px solid ${YT_LINE}`,
                    boxShadow: `0 0 30px -18px ${YT_GLOW}`,
                  }}
                >
                  <svg
                    viewBox="0 0 16 16" fill="currentColor"
                    className="absolute left-1/2 top-1/2 h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2"
                    style={{ color: YT, filter: `drop-shadow(0 0 12px ${YT_GLOW})` }}
                  >
                    <path d="M5 4 L12 8 L5 12 Z" />
                  </svg>
                  {lastVideo.duration && (
                    <span
                      className="absolute bottom-1.5 right-1.5 rounded px-1.5 py-px font-mono text-[9.5px]"
                      style={{ background: 'rgba(0,0,0,.6)' }}
                    >
                      {lastVideo.duration}
                    </span>
                  )}
                </div>
                {/* Meta */}
                <div>
                  <div className="mb-1 flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[.22em]" style={{ color: YT }}>
                    <span className="h-[5px] w-[5px] rounded-full" style={{ background: YT, boxShadow: `0 0 8px ${YT}` }} />
                    último publicado · {formatDate(lastVideo.published_date)}
                  </div>
                  <div className="font-display font-bold leading-[1.05]" style={{ fontSize: '26px', color: '#e8e6e1' }}>
                    {lastVideo.title}
                  </div>
                  <div className="mt-1.5 font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>
                    {lastVideo.channel} · serie
                  </div>
                </div>
                <div className="font-mono text-[14px]" style={{ color: '#4a4a50' }}>→</div>
              </div>

              {/* Metrics */}
              <div
                className="grid border-b border-t py-3.5"
                style={{ gridTemplateColumns: 'repeat(4,1fr)', borderColor: '#2a2a30' }}
              >
                {[
                  { label: 'Vistas', value: lastVideo.views.toLocaleString('es-CL'), delta: null },
                  { label: 'Tiempo medio', value: lastVideo.avg_watch_time ?? '—', delta: null },
                  { label: 'CTR', value: `${Number(lastVideo.ctr).toFixed(1)}%`, delta: null },
                  { label: 'Retención', value: `${lastVideo.retention}%`, delta: null },
                ].map((m, i) => (
                  <div key={m.label} className="px-4 first:pl-0 last:pr-0" style={{ borderLeft: i > 0 ? '1px dashed #2a2a30' : undefined }}>
                    <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[.18em]" style={{ color: '#4a4a50' }}>{m.label}</div>
                    <div className="font-display font-bold leading-none" style={{ fontSize: '30px', color: i === 0 ? YT : '#e8e6e1' }}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Analysis */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[.18em]"
                      style={{
                        background: 'linear-gradient(135deg, rgba(106,167,212,.12), rgba(217,107,92,.08))',
                        border: '1px solid rgba(111,183,201,.25)',
                        color: '#6aa7d4',
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M8 1.5 L9.4 6.6 L14.5 8 L9.4 9.4 L8 14.5 L6.6 9.4 L1.5 8 L6.6 6.6 Z" />
                      </svg>
                      análisis AI
                    </span>
                    <h3 className="font-display font-bold" style={{ fontSize: '22px' }}>Lectura del video</h3>
                  </div>
                  <span className="font-mono text-[9.5px]" style={{ color: '#4a4a50' }}>generado automáticamente · claude</span>
                </div>

                <div className="flex flex-col">
                  {getInsights(lastVideo).map((ins, i) => {
                    const dotColor = { ok: '#5cb89e', bad: '#c79a5c', why: '#6fb7c9', next: YT }[ins.type]
                    const labColor = dotColor
                    return (
                      <div
                        key={ins.type}
                        className="grid items-start gap-4 py-3"
                        style={{
                          gridTemplateColumns: 'auto 100px 1fr',
                          borderTop: i > 0 ? '1px solid rgba(255,255,255,.025)' : undefined,
                        }}
                      >
                        <span
                          className="mt-2 h-2 w-2 flex-none rounded-full"
                          style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}` }}
                        />
                        <span className="pt-1 font-mono text-[9.5px] uppercase tracking-[.2em] leading-[1.3]" style={{ color: labColor }}>
                          {ins.label}
                        </span>
                        <p className="text-[13.5px] leading-[1.55]" style={{ color: '#efe8df' }}>
                          {ins.text}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div
                  className="flex items-center justify-between border-t pt-3.5 font-mono text-[10px]"
                  style={{ borderColor: '#2a2a30', color: '#4a4a50' }}
                >
                  <div className="flex gap-2">
                    <button className="rounded-[6px] px-2.5 py-1.5 font-mono text-[10px] tracking-[.04em]" style={{ border: `1px solid ${YT_LINE}`, background: YT_SOFT, color: YT }}>
                      + guardar como nota
                    </button>
                    <button className="rounded-[6px] border border-white/[.06] px-2.5 py-1.5 font-mono text-[10px] tracking-[.04em] text-muted-foreground/50">
                      regenerar
                    </button>
                  </div>
                  <span>4 insights accionables</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-16">
              <div className="font-mono text-[10.5px] uppercase tracking-[.22em]" style={{ color: '#4a4a50' }}>sin videos publicados</div>
              <p className="text-center text-[13px]" style={{ color: '#4a4a50' }}>Cuando publiques tu primer video, aparecerá aquí con análisis automático.</p>
            </div>
          )}
        </div>

        {/* Month list + next */}
        <div
          className="rounded-[14px] px-6 py-5"
          style={{ border: '1.4px solid #252530', background: CARD_BG, boxShadow: CARD_SHADOW }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px]" style={{ border: '1.4px solid #3a3a42', background: '#0d0d11', color: '#8a8a8f' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <rect x="2" y="3" width="12" height="11" rx="1.5" /><path d="M2 6 L14 6 M6 2 L6 5 M10 2 L10 5" />
              </svg>
            </div>
            <div>
              <h2 className="font-display font-bold" style={{ fontSize: '20px' }}>Publicados · {new Date().toLocaleDateString('es-CL', { month: 'long' })}</h2>
              <div className="font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>{monthlyVideos.length} piezas este mes</div>
            </div>
          </div>

          <div className="flex flex-col">
            {monthlyVideos.length === 0 ? (
              <p className="py-6 text-center font-mono text-[10.5px]" style={{ color: '#4a4a50' }}>Sin videos este mes todavía.</p>
            ) : (
              monthlyVideos.map((v, i) => (
                <div
                  key={v.id}
                  className="grid items-center gap-3.5 py-3"
                  style={{ gridTemplateColumns: '44px 1fr auto', borderBottom: i < monthlyVideos.length - 1 ? '1px dashed #2a2a30' : undefined }}
                >
                  <div
                    className="flex h-[28px] w-[44px] flex-none items-center justify-center rounded-[5px]"
                    style={{
                      border: `1px solid ${i === 0 ? YT_LINE : '#2a2a30'}`,
                      background: i === 0 ? YT_SOFT : 'linear-gradient(135deg, #18181d, #0e0e12)',
                      color: i === 0 ? YT : '#4a4a50',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M5 4 L12 8 L5 12 Z" /></svg>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-medium leading-[1.3]" style={{ color: '#e8e6e1' }}>{v.title}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[9.5px]" style={{ color: '#4a4a50' }}>
                      {formatDate(v.published_date)}
                      {i === 0 && (
                        <span
                          className="inline-flex items-center gap-1 rounded-[5px] px-1.5 py-px font-mono text-[9px] uppercase"
                          style={{ background: YT_SOFT, border: `1px solid ${YT_LINE}`, color: YT }}
                        >
                          <span className="h-[4px] w-[4px] rounded-full" style={{ background: YT }} />
                          último
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-[12.5px] font-medium" style={{ color: i === 0 ? YT : '#e8e6e1' }}>{v.views.toLocaleString('es-CL')}</div>
                    <div className="text-[9.5px]" style={{ color: '#4a4a50' }}>vistas</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {monthlyVideos.length > 0 && (
            <div
              className="mt-3 flex items-baseline justify-between border-t pt-3 font-mono text-[10.5px]"
              style={{ borderColor: '#2a2a30', color: '#4a4a50' }}
            >
              <span>total mes</span>
              <span style={{ color: '#e8e6e1', fontWeight: 500 }}>
                {monthlyVideos.reduce((s, v) => s + v.views, 0).toLocaleString('es-CL')} vistas
              </span>
            </div>
          )}

          {/* Next scheduled */}
          {nextScheduled && (
            <div className="mt-4 border-t pt-4" style={{ borderColor: '#2a2a30' }}>
              <div className="mb-2.5 font-mono text-[9.5px] uppercase tracking-[.22em]" style={{ color: '#4a4a50' }}>próximo</div>
              <div
                className="flex items-center gap-3 rounded-[9px] p-2.5"
                style={{ border: '1px dashed rgba(199,154,92,.32)', background: 'rgba(199,154,92,.04)' }}
              >
                <span className="h-2 w-2 flex-none rounded-full" style={{ background: '#c79a5c', boxShadow: '0 0 8px rgba(199,154,92,.5)' }} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium leading-[1.3]" style={{ color: '#e8e6e1' }}>{nextScheduled.title}</div>
                  <div className="mt-0.5 font-mono text-[9.5px]" style={{ color: '#c79a5c' }}>
                    programado · {formatDate(nextScheduled.scheduled_date)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
