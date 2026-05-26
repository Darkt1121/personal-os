import type { SourceTotal } from '../types'

function fmt(n: number) {
  return '$ ' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const SOURCE_ICONS: Record<string, string> = {
  youtube: 'YT',
  consultoría: 'CO',
  facebook: 'FB',
  tiktok: 'TK',
}

function sourceInitials(name: string) {
  const lower = name.toLowerCase()
  for (const [key, val] of Object.entries(SOURCE_ICONS)) {
    if (lower.includes(key)) return val
  }
  return name.slice(0, 2).toUpperCase()
}

export function FuentesIngreso({
  sources,
  totalIngresos,
}: {
  sources: SourceTotal[]
  totalIngresos: number
}) {
  return (
    <div className="card-premium card-emerald rounded-xl p-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border icobox-emerald">
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M8 2 L8 14 M2 8 L8 2 L14 8" />
            </svg>
          </div>
          <div>
            <h2 className="font-mono text-[13px] font-semibold text-foreground/85">Fuentes de ingreso</h2>
            <p className="font-mono text-[9.5px] uppercase tracking-[.14em] text-muted-foreground/35">
              {sources.length} fuentes activas · mes actual
            </p>
          </div>
        </div>
        <span className="font-mono text-[10.5px] text-emerald-500/60 cursor-default hover:text-emerald-400/80 transition-colors">
          administrar →
        </span>
      </div>

      {sources.length === 0 ? (
        <div className="flex items-center justify-center py-10 font-mono text-[11px] text-muted-foreground/30">
          sin ingresos este mes
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          {sources.map(src => (
            <div key={src.source} className="grid grid-cols-[38px_1fr_auto] items-center gap-3.5 py-3.5">
              <div
                className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border font-mono text-[12px] font-bold"
                style={{ borderColor: 'rgba(52,211,153,.32)', background: 'rgba(52,211,153,.08)', color: '#34d399' }}
              >
                {sourceInitials(src.source)}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-medium leading-tight text-foreground/85">{src.source}</div>
                {src.channelName && (
                  <div className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[.08em] text-muted-foreground/35">
                    {src.channelName}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-mono text-[15px] text-foreground/85">{fmt(src.amount)}</div>
                <div className="font-mono text-[10px]" style={{ color: '#34d399' }}>
                  {src.percentage}% del total
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t pt-3.5 font-mono text-[11px]" style={{ borderColor: 'rgba(52,211,153,.12)' }}>
        <span className="text-muted-foreground/35">total ingresos</span>
        <span>
          <b className="text-emerald-400">{fmt(totalIngresos)}</b>
        </span>
      </div>
    </div>
  )
}
