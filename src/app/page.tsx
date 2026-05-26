import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  TrendingUp,
  GraduationCap,
  Youtube,
  Bot,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  CheckSquare,
  Circle,
} from 'lucide-react'

/* ── Mock data (replace with Supabase queries) ── */
const kpis = {
  ingresos: { value: '$ 8.420', delta: '+12.4%', deltaUp: true },
  gastos: { value: '$ 3.217', delta: '−4.1%', deltaUp: false, movs: 27 },
  balance: { value: '+ $ 5.203', runway: '~7 meses', pct: 64 },
  cobros: { value: '$ 2.140', count: 3, days: 7 },
}

const fuentes = [
  { name: 'Consultoría', amount: '$ 4.200', pct: 50 },
  { name: 'YouTube · adsense', amount: '$ 1.620', pct: 19 },
  { name: 'Clientes sueltos', amount: '$ 2.600', pct: 31 },
]

const movimientos = [
  { dir: 'in',  title: '+ $ 1.200 · consultoría', sub: 'transferencia · hoy', time: '09:14' },
  { dir: 'out', title: '− $ 89.40 · despensa', sub: 'tarjeta · hoy', time: '11:02' },
  { dir: 'out', title: '− $ 18.99 · suscripción AI', sub: 'herramientas · ayer', time: '' },
  { dir: 'in',  title: '+ $ 420 · adsense', sub: 'YouTube · 2d', time: '' },
]

const evaluaciones = [
  { day: 'Vie', date: '23', title: 'Parcial 01', course: 'Big Data', tag: 'examen', daysLeft: 4, color: 'emerald' as const },
  { day: 'Mar', date: '27', title: 'Entrega TP2', course: 'Gestión Ágil', tag: 'trabajo', daysLeft: 8, color: 'sky' as const },
  { day: 'Jue', date: '5',  title: 'Informe final', course: 'Arq. de Datos', tag: 'proyecto', daysLeft: 16, color: 'sky' as const },
]

const tareas = [
  { done: false, title: 'Cerrar conciliación abril', module: 'finanzas', priority: 'high' as const },
  { done: false, title: 'Revisar guión ep. 47', module: 'youtube', priority: 'medium' as const },
  { done: true,  title: 'Leer capítulo 3 Big Data', module: 'estudios', priority: 'low' as const },
  { done: false, title: 'Configurar RAG local', module: 'ai', priority: 'medium' as const },
]

const enCurso = [
  {
    module: 'YouTube',
    icon: Youtube,
    color: { accent: '#fb7185', rgb: '251,113,133', bg: 'rgba(251,113,133,.08)', border: 'rgba(251,113,133,.28)' },
    title: 'Episodio 47 — guión en borrador',
    meta: '3.200 palabras · 78% completo',
    primaryAction: 'Continuar guión',
    secondaryAction: 'Ideas',
    href: '/youtube',
  },
  {
    module: 'AI',
    icon: Bot,
    color: { accent: '#a78bfa', rgb: '167,139,250', bg: 'rgba(167,139,250,.08)', border: 'rgba(167,139,250,.28)' },
    title: 'Sesión — arquitectura RAG + embeddings',
    meta: '2h activa · 24 mensajes',
    primaryAction: 'Reanudar chat',
    secondaryAction: '+ Nueva sesión',
    href: '/ai',
  },
  {
    module: 'Aprendizaje',
    icon: BookOpen,
    color: { accent: '#a3e635', rgb: '163,230,53', bg: 'rgba(163,230,53,.06)', border: 'rgba(163,230,53,.24)' },
    title: 'Nota — Fundamentos de embeddings',
    meta: 'Actualizada hace 3 horas',
    primaryAction: 'Abrir nota',
    secondaryAction: 'Siguiente paso',
    href: '/aprendizaje',
  },
]

/* ── Subcomponents ── */
function SectionHeader({
  num,
  label,
  title,
  meta,
  href,
  iconClass,
  accentColor,
  Icon,
}: {
  num: string
  label: string
  title: string
  meta: string
  href: string
  iconClass: string
  accentColor: string
  Icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`icobox-${iconClass} flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground/40">
            Módulo · {num}
          </div>
          <h2 className="text-[26px] font-bold leading-tight tracking-tight text-foreground">{title}</h2>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40">{meta}</span>
        <a
          href={href}
          className="flex items-center gap-1 font-mono text-[11px] tracking-[0.04em] transition-opacity hover:opacity-80"
          style={{ color: accentColor }}
        >
          abrir módulo <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

function PriorityTag({ p }: { p: 'high' | 'medium' | 'low' }) {
  const map = {
    high:   { label: 'alta',  style: { color: '#fb7185', borderColor: 'rgba(251,113,133,.45)', background: 'rgba(251,113,133,.08)' } },
    medium: { label: 'media', style: { color: '#fbbf24', borderColor: 'rgba(251,191,36,.35)', background: 'rgba(251,191,36,.06)' } },
    low:    { label: 'baja',  style: { color: '#6b7280', borderColor: 'rgba(107,114,128,.3)', background: 'transparent' } },
  }
  const { label, style } = map[p]
  return (
    <span
      className="rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]"
      style={style}
    >
      {label}
    </span>
  )
}

/* ── Page ── */
export default function DashboardPage() {
  const now = new Date()
  const dateLabel = format(now, "EEEE d 'de' MMMM, yyyy", { locale: es })
  const timeLabel = format(now, 'HH:mm:ss')

  return (
    <div className="min-h-screen space-y-4 p-4">

      {/* Top header bar */}
      <div
        className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,.022), rgba(255,255,255,.005))',
          border: '1px solid rgba(255,255,255,.045)',
          boxShadow: '0 1px 0 rgba(255,255,255,.035) inset, 0 1px 2px rgba(0,0,0,.45)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground/60">
            Dashboard <span className="text-muted-foreground/30">/ overview</span>
          </span>
          <span
            className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/50"
            style={{ border: '1px solid rgba(255,255,255,.06)', background: 'rgba(255,255,255,.018)' }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              style={{ boxShadow: '0 0 6px #34d399', animation: 'pulse-live 2s infinite' }}
            />
            sistema online
          </span>
        </div>
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-[11px] text-muted-foreground/40"
          style={{ border: '1px solid rgba(255,255,255,.05)', background: 'rgba(255,255,255,.018)', minWidth: 200 }}
        >
          ⌕ buscar módulos, archivos…
          <span
            className="ml-auto rounded px-1 py-0.5 font-mono text-[9px]"
            style={{ border: '1px solid rgba(255,255,255,.08)' }}
          >
            ⌘K
          </span>
        </div>
      </div>

      {/* ═══ HERO CARD ═══ */}
      <div className="card-hero rounded-2xl p-8">
        {/* left accent bar */}
        <div
          className="absolute left-0 top-9 bottom-9 w-[3px] rounded-r-sm"
          style={{
            background: 'linear-gradient(180deg, transparent, #60a5fa 25%, #60a5fa 75%, transparent)',
            boxShadow: '0 0 14px #60a5fa, 0 0 6px #60a5fa',
          }}
        />
        {/* decorative sun radial */}
        <div
          className="pointer-events-none absolute right-8 top-8"
          style={{
            width: 160, height: 160,
            background: 'radial-gradient(closest-side, rgba(96,165,250,.25), rgba(96,165,250,0) 70%)',
            filter: 'blur(20px)',
          }}
        />
        {/* concentric rings deco */}
        <div
          className="pointer-events-none absolute right-[-90px] top-[-90px] opacity-40"
          style={{ width: 340, height: 340 }}
        >
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px dashed rgba(96,165,250,.2)' }} />
          <div style={{ position: 'absolute', inset: 30, borderRadius: '50%', border: '1px solid rgba(96,165,250,.1)' }} />
        </div>
        {/* horizon gradient */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: 60, background: 'radial-gradient(60% 40% at 30% 100%, rgba(96,165,250,.12), transparent 70%)' }}
        />

        <div className="flex flex-wrap items-start justify-between gap-8">
          {/* Left: kicker + title + module cells + status */}
          <div className="min-w-0 flex-1">
            {/* kicker */}
            <div className="mb-4 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/50">
              <span
                className="h-1.5 w-1.5 rounded-full bg-blue-400"
                style={{ boxShadow: '0 0 8px #60a5fa', animation: 'pulse-live 2s infinite' }}
              />
              <span className="font-semibold text-foreground/80 tracking-[0.32em]">System Active</span>
              <span className="text-muted-foreground/25">·</span>
              <span className="text-muted-foreground/40">{timeLabel} · local</span>
            </div>

            {/* Mega title */}
            <h1
              className="mb-5 font-bold uppercase leading-none tracking-[0.04em]"
              style={{
                fontSize: 52,
                background: 'linear-gradient(180deg, #ffffff 0%, #aeaeb8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 24px rgba(96,165,250,.45)) drop-shadow(0 0 60px rgba(96,165,250,.15))',
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(180deg, #93c5fd 0%, #60a5fa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Live
              </span>{' '}
              Overview
            </h1>

            {/* Module pulse cells */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {[
                { lbl: 'DSH', active: true, color: { bg: 'rgba(255,255,255,.07)', border: 'rgba(255,255,255,.18)', bar: '#fff', glow: 'rgba(255,255,255,.4)' } },
                { lbl: 'FIN', color: { bg: 'rgba(52,211,153,.08)', border: 'rgba(52,211,153,.28)', bar: '#34d399', glow: 'rgba(52,211,153,.6)' } },
                { lbl: 'EST', color: { bg: 'rgba(56,189,248,.08)', border: 'rgba(56,189,248,.28)', bar: '#38bdf8', glow: 'rgba(56,189,248,.5)' } },
                { lbl: 'YT',  color: { bg: 'rgba(251,113,133,.08)', border: 'rgba(251,113,133,.28)', bar: '#fb7185', glow: 'rgba(251,113,133,.5)' } },
                { lbl: 'AI',  color: { bg: 'rgba(167,139,250,.08)', border: 'rgba(167,139,250,.28)', bar: '#a78bfa', glow: 'rgba(167,139,250,.5)' } },
                { lbl: 'APR', color: { bg: 'rgba(163,230,53,.06)', border: 'rgba(163,230,53,.24)', bar: '#a3e635', glow: 'rgba(163,230,53,.45)' } },
                { lbl: 'CFG', color: { bg: 'rgba(255,255,255,.015)', border: 'rgba(255,255,255,.06)', bar: '#6b7280', glow: 'none' } },
              ].map(({ lbl, active, color }, i) => (
                <div
                  key={lbl}
                  className="flex flex-col items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all"
                  style={{
                    minWidth: 44,
                    background: color.bg,
                    border: `1px solid ${color.border}`,
                    boxShadow: active ? `0 0 22px -6px ${color.glow}, 0 1px 0 rgba(255,255,255,.08) inset` : `0 0 16px -8px ${color.glow}, 0 1px 0 rgba(255,255,255,.03) inset`,
                  }}
                >
                  {/* animated bars */}
                  <div className="flex items-end gap-[2px]" style={{ height: 14 }}>
                    {[5, 11, 7].map((h, j) => (
                      <div
                        key={j}
                        className="w-[2.5px] rounded-[1px]"
                        style={{
                          height: h,
                          background: color.bar,
                          boxShadow: `0 0 4px ${color.glow}`,
                          animation: `bar-bounce 2.4s ease-in-out ${(i * 3 + j) * 0.13}s infinite`,
                          transformOrigin: 'bottom',
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="font-mono text-[8.5px] uppercase tracking-[0.18em]"
                    style={{ color: color.bar }}
                  >
                    {lbl}
                  </span>
                  {active && (
                    <div
                      className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full"
                      style={{ background: color.bar, boxShadow: `0 0 6px ${color.bar}`, animation: 'pulse-live 2s infinite' }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Status row */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10.5px] text-muted-foreground/40">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #34d399', animation: 'pulse-live 2s infinite' }} />
                <span className="text-foreground/70 font-medium">7</span> módulos online
              </span>
              <span className="text-muted-foreground/20">·</span>
              <span><span className="text-foreground/70 font-medium">3</span> tareas pendientes</span>
              <span className="text-muted-foreground/20">·</span>
              <span><span className="text-foreground/70 font-medium">3</span> piezas activas</span>
              <span className="text-muted-foreground/20">·</span>
              <span className="capitalize">{dateLabel}</span>
            </div>
          </div>

          {/* Right: action chips */}
          <div className="flex min-w-[240px] max-w-[280px] flex-col gap-2">
            {[
              { label: 'Cerrar conciliación abril', icon: '!', color: { bg: 'linear-gradient(180deg, rgba(52,211,153,.2), rgba(52,211,153,.04))', border: 'rgba(52,211,153,.38)', text: '#34d399', iconBg: 'rgba(52,211,153,.08)', iconBorder: 'rgba(52,211,153,.45)', glow: 'rgba(52,211,153,.6)' } },
              { label: 'Continuar lección 4', icon: '⌖', color: { bg: 'linear-gradient(180deg, rgba(56,189,248,.16), rgba(56,189,248,.03))', border: 'rgba(56,189,248,.38)', text: '#38bdf8', iconBg: 'rgba(56,189,248,.08)', iconBorder: 'rgba(56,189,248,.45)', glow: 'rgba(56,189,248,.5)' } },
              { label: 'Foco del día', icon: '+', color: { bg: 'transparent', border: 'rgba(255,255,255,.1)', text: '#6b7280', iconBg: 'transparent', iconBorder: 'rgba(255,255,255,.08)', glow: 'none' }, dashed: true },
            ].map(({ label, icon, color, dashed }) => (
              <button
                key={label}
                className="flex w-full cursor-default items-center gap-2.5 rounded-[11px] px-3.5 py-2.5 text-left font-sans text-[12.5px] font-medium transition-all hover:-translate-y-px"
                style={{
                  background: color.bg,
                  border: `1px ${dashed ? 'dashed' : 'solid'} ${color.border}`,
                  color: color.text,
                  boxShadow: dashed ? 'none' : `0 0 0 1px rgba(0,0,0,.1), 0 1px 0 rgba(255,255,255,.06) inset, 0 0 20px -8px ${color.glow}`,
                }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] font-mono text-[11px] font-bold"
                  style={{ background: color.iconBg, border: `1px solid ${color.iconBorder}`, color: color.text, boxShadow: dashed ? 'none' : `0 0 10px -2px ${color.glow}` }}
                >
                  {icon}
                </span>
                <span className="flex-1">{label}</span>
                {!dashed && <span className="font-mono text-xs opacity-60">→</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FINANZAS ═══ */}
      <div>
        <SectionHeader
          num="01 · principal"
          label="Módulo"
          title="Finanzas"
          meta={`mayo ${now.getFullYear()} · 3 cuentas · 27 movimientos`}
          href="/finanzas"
          iconClass="emerald"
          accentColor="#34d399"
          Icon={TrendingUp}
        />

        {/* Main row: chart + right rail */}
        <div className="grid gap-3.5" style={{ gridTemplateColumns: '1.9fr 1fr' }}>

          {/* Income chart card */}
          <div className="card-premium card-emerald rounded-2xl p-6" style={{ minHeight: 360 }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
                  Evolución de ingresos · últimos 12 meses
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-[50px] font-bold leading-none tracking-tight text-emerald-400"
                    style={{ textShadow: '0 0 36px rgba(52,211,153,.5), 0 0 80px rgba(52,211,153,.22)' }}>
                    $ 8.420
                  </span>
                  <span className="font-mono text-[12px] text-emerald-400/70">
                    <span className="font-semibold text-emerald-400">+12.4%</span> vs abril
                  </span>
                </div>
                <div className="mt-1.5 font-mono text-[10px] text-muted-foreground/35">
                  promedio mensual: $ 6.840 · mejor mes: feb · $ 9.210
                </div>
              </div>
              <div className="flex gap-1">
                {['6M', '12M', 'YTD'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]"
                    style={t === '12M'
                      ? { border: '1px solid rgba(52,211,153,.45)', color: '#34d399', background: 'rgba(52,211,153,.07)' }
                      : { border: '1px solid rgba(255,255,255,.08)', color: '#6b7280' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* SVG Chart */}
            <div className="relative mt-5" style={{ height: 220 }}>
              <svg viewBox="0 0 720 220" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="incArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="rgba(52,211,153,.35)" />
                    <stop offset="1" stopColor="rgba(52,211,153,0)" />
                  </linearGradient>
                  <linearGradient id="incLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="rgba(52,211,153,.6)" />
                    <stop offset="1" stopColor="rgba(52,211,153,1)" />
                  </linearGradient>
                  <filter id="incGlow"><feGaussianBlur stdDeviation="3" /></filter>
                </defs>
                {/* gridlines */}
                <g stroke="rgba(255,255,255,.04)" strokeDasharray="2 4">
                  <line x1="0" y1="40"  x2="720" y2="40" />
                  <line x1="0" y1="90"  x2="720" y2="90" />
                  <line x1="0" y1="140" x2="720" y2="140" />
                  <line x1="0" y1="185" x2="720" y2="185" />
                </g>
                {/* y-axis */}
                <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#3a3a44">
                  <text x="0" y="38">10k</text>
                  <text x="0" y="88">8k</text>
                  <text x="0" y="138">6k</text>
                  <text x="0" y="183">4k</text>
                </g>
                {/* area */}
                <path
                  d="M30,165 L90,150 L150,135 L210,108 L270,35 L330,80 L390,100 L450,84 L510,68 L570,56 L630,45 L690,42 L690,218 L30,218 Z"
                  fill="url(#incArea)"
                />
                {/* glow line */}
                <path
                  d="M30,165 L90,150 L150,135 L210,108 L270,35 L330,80 L390,100 L450,84 L510,68 L570,56 L630,45 L690,42"
                  stroke="rgba(52,211,153,.5)" strokeWidth="3" fill="none" filter="url(#incGlow)" opacity="0.7"
                />
                {/* main line */}
                <path
                  d="M30,165 L90,150 L150,135 L210,108 L270,35 L330,80 L390,100 L450,84 L510,68 L570,56 L630,45 L690,42"
                  stroke="url(#incLine)" strokeWidth="1.6" fill="none" strokeLinejoin="round"
                />
                {/* current month marker */}
                <line x1="690" y1="42" x2="690" y2="205" stroke="rgba(52,211,153,.2)" strokeDasharray="2 3" />
                <circle cx="690" cy="42" r="4" fill="#090f0c" stroke="#34d399" strokeWidth="1.6" />
                <circle cx="690" cy="42" r="9" fill="none" stroke="rgba(52,211,153,.25)" />
                {/* x-axis */}
                <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#3a3a44">
                  {['jun','jul','ago','sep','oct','nov','dic','ene','feb','mar','abr'].map((m, i) => (
                    <text key={m} x={22 + i * 60} y="212">{m}</text>
                  ))}
                  <text x="678" y="212" fill="#34d399">may</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Right rail */}
          <div className="flex flex-col gap-3">
            {/* Gastos */}
            <div className="card-premium rounded-xl px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">Gastos · mes</div>
                <ArrowDownRight className="h-4 w-4 text-rose-400/60" />
              </div>
              <div className="mt-1.5 text-[34px] font-bold leading-none text-foreground/90">
                $ 3.217
              </div>
              <div className="mt-1.5 font-mono text-[10px] text-muted-foreground/40">
                <span className="text-emerald-400">−4.1%</span> · {kpis.gastos.movs} movimientos
              </div>
              <svg viewBox="0 0 200 28" className="mt-2 h-7 w-full">
                <path d="M0,12 C30,20 50,8 80,22 S140,28 200,16" stroke="rgba(251,113,133,.5)" fill="none" strokeWidth="1.2" />
              </svg>
            </div>

            {/* Balance */}
            <div className="card-premium card-sky rounded-xl px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">Balance general</div>
                <ArrowUpRight className="h-4 w-4 text-sky-400/60" />
              </div>
              <div
                className="mt-1.5 text-[34px] font-bold leading-none"
                style={{ color: '#38bdf8', textShadow: '0 0 32px rgba(56,189,248,.45)' }}
              >
                + $ 5.203
              </div>
              <div className="mt-1.5 font-mono text-[10px] text-muted-foreground/40">
                runway estimado · <span className="text-foreground/60 font-medium">~7 meses</span>
              </div>
              {/* progress bar */}
              <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ background: '#15151b' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: '64%', background: 'linear-gradient(90deg, #38bdf8, rgba(56,189,248,.4))', boxShadow: '0 0 8px rgba(56,189,248,.4)' }}
                />
              </div>
              <div className="mt-1 font-mono text-[9px] text-muted-foreground/30">64% del objetivo anual</div>
            </div>

            {/* Próximos cobros */}
            <div className="card-premium rounded-xl px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">Próximos cobros</div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground/50">
                    {kpis.cobros.count} facturas · {kpis.cobros.days} días
                  </div>
                </div>
                <div className="text-[26px] font-bold text-emerald-400/90">
                  $ 2.140
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub row: fuentes + movimientos */}
        <div className="mt-3.5 grid gap-3.5" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
          {/* Fuentes */}
          <div className="card-premium rounded-xl px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-foreground/80">Fuentes de ingreso</h3>
              <span className="font-mono text-[10px] text-muted-foreground/35">may · {fuentes.length}</span>
            </div>
            <div className="space-y-3.5">
              {fuentes.map((f) => (
                <div key={f.name}>
                  <div className="mb-1.5 flex justify-between font-mono text-[11px]">
                    <span className="text-muted-foreground/60">{f.name}</span>
                    <span className="text-foreground/80">{f.amount} · {f.pct}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full" style={{ background: '#15151b' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${f.pct}%`,
                        background: 'linear-gradient(90deg, #34d399, rgba(52,211,153,.4))',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Movimientos */}
          <div className="card-premium rounded-xl px-5 py-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-foreground/80">Movimientos recientes</h3>
              <span className="font-mono text-[10px] text-muted-foreground/35">últimos 4 · ver todos →</span>
            </div>
            <div>
              {movimientos.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md px-1.5 py-2.5 transition-colors hover:bg-white/[0.012]"
                  style={{ borderBottom: i < movimientos.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}
                >
                  <div
                    className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px]"
                    style={m.dir === 'in'
                      ? { border: '1px solid rgba(52,211,153,.35)', background: 'rgba(52,211,153,.07)', color: '#34d399' }
                      : { border: '1px solid rgba(251,113,133,.3)', background: 'rgba(251,113,133,.06)', color: '#fb7185' }}
                  >
                    {m.dir === 'in'
                      ? <ArrowUpRight className="h-3 w-3" />
                      : <ArrowDownRight className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium text-foreground/85 leading-tight">{m.title}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/35">{m.sub}</div>
                  </div>
                  {m.time && <span className="font-mono text-[10px] text-muted-foreground/30 shrink-0">{m.time}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ ESTUDIOS ═══ */}
      <div>
        <SectionHeader
          num="02 · secundario"
          label="Módulo"
          title="Estudios"
          meta="2 cursos · 14 notas · 6h esta semana"
          href="/estudios"
          iconClass="sky"
          accentColor="#38bdf8"
          Icon={GraduationCap}
        />

        <div className="grid gap-3.5" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
          {/* Próximas evaluaciones */}
          <div className="card-premium rounded-xl px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-foreground/80">Próximas evaluaciones</h3>
              <span className="font-mono text-[10px] text-muted-foreground/35">3 próximas</span>
            </div>
            <div className="space-y-0">
              {evaluaciones.map((e, i) => (
                <div
                  key={i}
                  className="grid items-center gap-3.5 py-2.5 hover:bg-white/[0.012] rounded-md px-1 transition-colors"
                  style={{
                    gridTemplateColumns: '46px 1fr auto',
                    borderBottom: i < evaluaciones.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
                  }}
                >
                  {/* Date badge */}
                  <div
                    className="rounded-[7px] px-1 py-1.5 text-center font-mono leading-tight"
                    style={e.color === 'emerald'
                      ? { border: '1px solid rgba(52,211,153,.4)', background: 'rgba(52,211,153,.08)', color: '#34d399' }
                      : { border: '1px solid rgba(56,189,248,.35)', background: 'rgba(56,189,248,.07)', color: '#38bdf8' }}
                  >
                    <div className="text-[8.5px] uppercase tracking-[0.06em]">{e.day}</div>
                    <div className="text-[15px] font-bold">{e.date}</div>
                  </div>
                  <div>
                    <div className="text-[13.5px] font-medium text-foreground/85 leading-tight">{e.title}</div>
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground/40">
                      <span>{e.course}</span>
                      <span
                        className="rounded px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em]"
                        style={e.color === 'emerald'
                          ? { border: '1px solid rgba(52,211,153,.3)', color: '#34d399', background: 'rgba(52,211,153,.06)' }
                          : { border: '1px solid rgba(56,189,248,.25)', color: '#38bdf8', background: 'rgba(56,189,248,.05)' }}
                      >
                        {e.tag}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-mono text-[11px] font-semibold"
                      style={{ color: e.daysLeft <= 5 ? '#fb7185' : '#6b7280' }}
                    >
                      {e.daysLeft}d
                    </div>
                    <div className="font-mono text-[9px] text-muted-foreground/30">restantes</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pendientes del día */}
          <div className="card-premium rounded-xl px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-foreground/80">Pendientes del día</h3>
              <span className="font-mono text-[10px] text-muted-foreground/35">{tareas.filter(t => !t.done).length} abiertas</span>
            </div>
            <div className="space-y-0">
              {tareas.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-md px-1 py-2.5 transition-colors hover:bg-white/[0.012]"
                  style={{ borderBottom: i < tareas.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}
                >
                  {t.done
                    ? <CheckSquare className="h-4 w-4 shrink-0 text-emerald-400/70" />
                    : <Circle className="h-4 w-4 shrink-0 text-muted-foreground/20" />}
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[13px] font-medium leading-tight"
                      style={{ color: t.done ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.8)', textDecoration: t.done ? 'line-through' : 'none' }}
                    >
                      {t.title}
                    </div>
                    <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground/30">{t.module}</div>
                  </div>
                  <PriorityTag p={t.priority} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ EN CURSO ═══ */}
      <div className="card-premium rounded-2xl px-6 py-5">
        <div className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground/35">
          Actividad activa
        </div>
        <h2 className="mb-5 text-[20px] font-semibold text-foreground/70">En curso</h2>
        <div className="space-y-0">
          {enCurso.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={item.module}
                className="grid items-center gap-4 py-4"
                style={{
                  gridTemplateColumns: '14px 180px 1fr auto',
                  borderBottom: i < enCurso.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
                }}
              >
                {/* Color stripe */}
                <div
                  className="w-[3px] rounded-sm self-center"
                  style={{ height: 40, background: item.color.accent, boxShadow: `0 0 12px -2px ${item.color.accent}` }}
                />
                {/* Module label */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                    style={{ background: item.color.bg, borderColor: item.color.border, color: item.color.accent }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold leading-tight" style={{ color: item.color.accent }}>
                      {item.module}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/30">activo</div>
                  </div>
                </div>
                {/* Content */}
                <div>
                  <div className="text-[14px] font-medium text-foreground/80 leading-tight">{item.title}</div>
                  <div className="mt-1 font-mono text-[10.5px] text-muted-foreground/40">{item.meta}</div>
                </div>
                {/* Actions */}
                <div className="flex flex-wrap items-center gap-1.5 justify-end">
                  <a
                    href={item.href}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[10.5px] transition-all hover:-translate-y-px"
                    style={{
                      background: item.color.bg,
                      border: `1px solid ${item.color.border}`,
                      color: item.color.accent,
                      boxShadow: `0 0 18px -10px ${item.color.accent}, 0 1px 0 rgba(255,255,255,.04) inset`,
                    }}
                  >
                    {item.primaryAction} <ArrowRight className="h-3 w-3" />
                  </a>
                  <button
                    className="rounded-lg px-3 py-1.5 font-mono text-[10.5px] text-muted-foreground/50 transition-colors hover:text-foreground/70"
                    style={{ border: '1px solid rgba(255,255,255,.06)', background: 'rgba(255,255,255,.02)', boxShadow: '0 1px 0 rgba(255,255,255,.03) inset' }}
                  >
                    {item.secondaryAction}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  )
}
