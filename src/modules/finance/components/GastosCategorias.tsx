import type { CategoryTotal } from '../types'

const DOT_COLORS = ['#c79a5c', '#9d8762', '#7b6b54', '#5f5447', '#48413a', '#3a352f']

function fmt(n: number) {
  return '$ ' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function GastosCategorias({
  categories,
  totalGastos,
}: {
  categories: CategoryTotal[]
  totalGastos: number
}) {
  return (
    <div className="card-premium rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border icobox-warn">
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
              <path d="M5 6 L11 6 M5 9 L11 9 M5 12 L8 12" />
            </svg>
          </div>
          <div>
            <h2 className="font-mono text-[13px] font-semibold text-foreground/85">Gastos por categoría</h2>
            <p className="font-mono text-[9.5px] uppercase tracking-[.14em] text-muted-foreground/35">
              {categories.length} categorías · mes actual
            </p>
          </div>
        </div>
        <span className="font-mono text-[10.5px] text-muted-foreground/35 hover:text-muted-foreground/55 cursor-default transition-colors">
          ver todo →
        </span>
      </div>

      {categories.length === 0 ? (
        <div className="flex items-center justify-center py-10 font-mono text-[11px] text-muted-foreground/30">
          sin gastos este mes
        </div>
      ) : (
        <div className="space-y-3.5">
          {categories.map((cat, i) => (
            <div key={cat.category}>
              <div className="flex items-baseline justify-between font-mono text-[11.5px]">
                <div className="flex items-center gap-2 text-foreground/80">
                  <span
                    className="h-2 w-2 rounded-[2px]"
                    style={{ background: DOT_COLORS[i] ?? DOT_COLORS[DOT_COLORS.length - 1] }}
                  />
                  {cat.category}
                </div>
                <div className="text-muted-foreground/55">
                  <b className="text-foreground/75">{fmt(cat.amount)}</b> · {cat.percentage}%
                </div>
              </div>
              <div className="mt-1.5 h-[6px] overflow-hidden rounded-full" style={{ background: '#15151b' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${cat.percentage}%`,
                    background: `linear-gradient(90deg, ${DOT_COLORS[i] ?? '#c79a5c'}, rgba(199,154,92,.4))`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t pt-3.5 font-mono text-[11px]" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
        <span className="text-muted-foreground/35">total mes actual</span>
        <span>
          <b style={{ color: '#c79a5c' }}>{fmt(totalGastos)}</b>
        </span>
      </div>
    </div>
  )
}
