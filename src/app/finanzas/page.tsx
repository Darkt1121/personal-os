import { TrendingUp } from 'lucide-react'
import { getFinancePageData } from '@/modules/finance/queries'
import { FinanceHero } from '@/modules/finance/components/FinanceHero'
import { KPIRow } from '@/modules/finance/components/KPIRow'
import { EvolutionChart } from '@/modules/finance/components/EvolutionChart'
import { GastosCategorias } from '@/modules/finance/components/GastosCategorias'
import { FuentesIngreso } from '@/modules/finance/components/FuentesIngreso'
import { MovimientosTable } from '@/modules/finance/components/MovimientosTable'

export const metadata = { title: 'Finanzas — Personal OS' }

export default async function FinanzasPage() {
  const { kpis, monthly, movements, categories, sources } = await getFinancePageData()

  return (
    <div className="flex min-h-full flex-col gap-5 p-6">

      {/* Breadcrumb bar */}
      <div
        className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5"
        style={{
          border: '1px dashed rgba(255,255,255,.06)',
          background: '#0a0a0d',
        }}
      >
        <div className="flex items-center gap-3.5">
          <span className="font-mono text-[11px] tracking-[.06em] text-muted-foreground/50">
            Personal OS <span className="mx-1.5 text-muted-foreground/25">/</span>
            <b className="text-emerald-400/80">Finanzas</b>
            <span className="mx-1.5 text-muted-foreground/25">/</span>
            <span className="text-foreground/55">Resumen</span>
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.1em] text-muted-foreground/45"
            style={{ borderColor: 'rgba(255,255,255,.07)' }}
          >
            <span className="h-[6px] w-[6px] rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px #34d399' }} />
            sincronizado
          </span>
        </div>
        <div
          className="flex items-center gap-2 rounded-[8px] border border-border/40 bg-background/50 px-3 py-1.5"
          style={{ minWidth: '280px' }}
        >
          <svg className="h-[13px] w-[13px] text-muted-foreground/30" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.4">
            <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 L14 14" />
          </svg>
          <span className="font-mono text-[11px] text-muted-foreground/30">buscar movimiento, fuente, categoría…</span>
          <kbd className="ml-auto rounded border border-border/40 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground/30">⌘K</kbd>
        </div>
      </div>

      {/* Hero banner */}
      <FinanceHero kpis={kpis} />

      {/* KPIs */}
      <KPIRow kpis={kpis} />

      {/* Evolution chart section */}
      <section className="flex flex-col gap-3.5">
        <SectionHead
          icon={
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M2 12 L6 8 L9 10 L14 4" /><path d="M10.5 4 L14 4 L14 7.5" />
            </svg>
          }
          iconClass="icobox-emerald"
          title="Evolución"
          meta="ingresos vs gastos · últimos 12 meses"
        >
          <RangeToggle />
        </SectionHead>

        <div className="card-premium card-emerald rounded-xl p-6">
          <EvolutionChart
            data={monthly}
            currentMonthIngresos={kpis.ingresos}
            currentMonthGastos={kpis.gastos}
          />
        </div>
      </section>

      {/* Categorías + Fuentes */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        <GastosCategorias categories={categories} totalGastos={kpis.gastos} />
        <FuentesIngreso sources={sources} totalIngresos={kpis.ingresos} />
      </div>

      {/* Movements table */}
      <section className="flex flex-col gap-3.5">
        <SectionHead
          icon={
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M3 4 L13 4 M3 8 L13 8 M3 12 L13 12" />
            </svg>
          }
          iconClass="border-white/10 bg-white/[0.03] text-foreground/40"
          title="Movimientos recientes"
          meta={`últimos 30 días · ${movements.length} registros`}
        >
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-transparent px-3 py-1.5 font-mono text-[11px] text-muted-foreground/50 transition-colors hover:text-foreground/65"
            >
              <TrendingUp className="h-3 w-3" />
              exportar
            </button>
          </div>
        </SectionHead>

        <div className="card-premium rounded-xl overflow-hidden">
          <MovimientosTable movements={movements} />
        </div>
      </section>

      {/* Footer */}
      <div
        className="flex items-center justify-between border-t pt-4 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground/25"
        style={{ borderColor: 'rgba(255,255,255,.04)' }}
      >
        <span>Personal OS · Finanzas v0.1 · local-first</span>
        <span>
          {new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

    </div>
  )
}

function SectionHead({
  icon,
  iconClass,
  title,
  meta,
  children,
}: {
  icon: React.ReactNode
  iconClass: string
  title: string
  meta: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border ${iconClass}`}>
          {icon}
        </div>
        <div>
          <h2 className="text-[22px] font-bold leading-none text-foreground/85">{title}</h2>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground/35">{meta}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function RangeToggle() {
  return (
    <div
      className="flex gap-0.5 rounded-lg border p-[3px]"
      style={{ borderColor: 'rgba(255,255,255,.07)', background: '#0a0a0d' }}
    >
      {['3M', '6M', '12M', 'YTD'].map((r, i) => (
        <span
          key={r}
          className="cursor-default rounded-md px-2.5 py-1 font-mono text-[10.5px] text-muted-foreground/35 transition-all"
          style={
            i === 2
              ? { background: 'rgba(52,211,153,.12)', color: '#34d399', boxShadow: 'inset 0 0 0 1px rgba(52,211,153,.35)' }
              : {}
          }
        >
          {r}
        </span>
      ))}
    </div>
  )
}
