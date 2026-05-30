type PipelineData = {
  ideas: number
  investigacion: number
  guiones: number
  grabacion: number
  edicion: number
  publicados: number
}

const stages = [
  { key: 'ideas' as const, label: 'Idea', icon: <IcoIdea />, hint: (n: number) => `${n} capturadas` },
  { key: 'investigacion' as const, label: 'Investigación', icon: <IcoSearch />, hint: (n: number) => `${n} en lectura` },
  { key: 'guiones' as const, label: 'Guion', icon: <IcoDoc />, hint: (n: number) => `${n} en borrador`, now: true },
  { key: 'grabacion' as const, label: 'Grabación', icon: <IcoRec />, hint: (n: number) => `${n} programadas` },
  { key: 'edicion' as const, label: 'Edición', icon: <IcoCut />, hint: (n: number) => `${n} en corte` },
  { key: 'publicados' as const, label: 'Publicado', icon: <IcoUp />, hint: (n: number) => `${n} total · canal personal` },
]

const YT = '#d96b5c'

export function PipelineStrip({ pipeline }: { pipeline: PipelineData }) {
  return (
    <div
      className="relative grid rounded-[14px]"
      style={{
        gridTemplateColumns: 'repeat(6, 1fr)',
        border: '1.4px solid #252530',
        background: `
          radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,.025), transparent 50%),
          linear-gradient(180deg, #0e0e12 0%, #0a0a0d 100%)
        `,
        boxShadow: '0 0 0 1px rgba(255,255,255,.015), 0 30px 60px -40px rgba(0,0,0,.8)',
      }}
    >
      {stages.map((s, i) => {
        const count = pipeline[s.key]
        const isNow = s.now
        return (
          <div
            key={s.key}
            className="relative flex flex-col gap-2 px-4 py-3"
            style={{
              borderLeft: i > 0 ? '1px dashed #2a2a30' : undefined,
              background: isNow ? 'linear-gradient(180deg, rgba(217,107,92,.08), transparent 80%)' : undefined,
              borderRadius: isNow ? '10px' : undefined,
            }}
          >
            <div
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em]"
              style={{ color: isNow ? YT : '#4a4a50' }}
            >
              <span style={{ opacity: isNow ? 1 : 0.75 }}>{s.icon}</span>
              {s.label}
            </div>
            <div
              className="font-display font-bold leading-none"
              style={{ fontSize: '38px', color: isNow ? YT : '#e8e6e1', textShadow: isNow ? `0 0 24px rgba(217,107,92,.4)` : undefined }}
            >
              {count}
            </div>
            <div className="font-mono text-[10px] tracking-[.04em]" style={{ color: isNow ? YT : '#4a4a50' }}>
              {s.hint(count)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function IcoIdea() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 13 L8 4 L11 13 M6.5 10 L9.5 10" /><circle cx="8" cy="2" r="1" /></svg>
}
function IcoSearch() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="7" r="3.5" /><line x1="9.5" y1="9.5" x2="13" y2="13" /></svg>
}
function IcoDoc() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2 L13 2 L13 14 L3 14 Z" /><path d="M5 6 L11 6 M5 9 L11 9 M5 12 L8 12" /></svg>
}
function IcoRec() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="4" /><circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" /></svg>
}
function IcoCut() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 8 L5 5 L9 9 L14 4" /><circle cx="14" cy="4" r="1.2" /></svg>
}
function IcoUp() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2 L8 12 M4 6 L8 2 L12 6" /><line x1="3" y1="13.5" x2="13" y2="13.5" /></svg>
}
