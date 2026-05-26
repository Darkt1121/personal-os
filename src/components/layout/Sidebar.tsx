'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  GraduationCap,
  Youtube,
  Bot,
  BookOpen,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  activeClass: string
  accentHex: string
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Sistema',
    items: [
      {
        href: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
        activeClass: 'nav-active-blue',
        accentHex: '#60a5fa',
      },
      {
        href: '/finanzas',
        label: 'Finanzas',
        icon: TrendingUp,
        activeClass: 'nav-active-emerald',
        accentHex: '#34d399',
      },
      {
        href: '/estudios',
        label: 'Estudios',
        icon: GraduationCap,
        activeClass: 'nav-active-sky',
        accentHex: '#38bdf8',
      },
      {
        href: '/youtube',
        label: 'YouTube',
        icon: Youtube,
        activeClass: 'nav-active-rose',
        accentHex: '#fb7185',
      },
    ],
  },
  {
    label: 'Inteligencia',
    items: [
      {
        href: '/ai',
        label: 'AI',
        icon: Bot,
        activeClass: 'nav-active-violet',
        accentHex: '#a78bfa',
      },
      {
        href: '/aprendizaje',
        label: 'Aprendizaje',
        icon: BookOpen,
        activeClass: 'nav-active-lime',
        accentHex: '#a3e635',
      },
    ],
  },
]

const configItem: NavItem = {
  href: '/configuracion',
  label: 'Configuración',
  icon: Settings,
  activeClass: 'nav-active-zinc',
  accentHex: '#a1a1aa',
}

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <aside
      className="sidebar-bg flex h-screen w-[212px] shrink-0 flex-col rounded-none"
      style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}
    >
      {/* Brand */}
      <div className="brand-panel mx-2 mt-2 flex items-center gap-2.5 rounded-[10px] px-3 py-2.5">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
          style={{
            background: 'radial-gradient(120% 100% at 30% 20%, rgba(96,165,250,.22), transparent 60%), #0c0d12',
            border: '1px solid rgba(96,165,250,.35)',
            boxShadow: '0 0 18px -8px rgba(96,165,250,.7), inset 0 0 0 1px rgba(96,165,250,.1)',
          }}
        >
          <span className="font-mono text-[11px] font-bold text-blue-400">OS</span>
        </div>
        <div>
          <div className="text-[13.5px] font-semibold leading-tight tracking-tight text-foreground/90">
            Personal OS
          </div>
          <div className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-muted-foreground/50">
            v0.1 · local
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0 overflow-y-auto px-2 py-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mt-1">
            <p className="px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/35">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'relative flex items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-[7px] text-[12.5px] font-medium transition-all duration-150',
                        active
                          ? cn(item.activeClass, 'text-foreground')
                          : 'text-muted-foreground hover:border-white/[0.04] hover:bg-white/[0.025] hover:text-foreground/80'
                      )}
                    >
                      {active && (
                        <span
                          className="absolute left-[-1px] top-[8px] bottom-[8px] w-[2.5px] rounded-r-sm"
                          style={{
                            background: `linear-gradient(180deg, ${item.accentHex}, ${item.accentHex}88)`,
                            boxShadow: `0 0 12px ${item.accentHex}`,
                          }}
                        />
                      )}
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-all',
                          active ? 'opacity-100' : 'opacity-60'
                        )}
                        style={active ? { filter: `drop-shadow(0 0 6px ${item.accentHex}88)` } : undefined}
                      />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* System pulse panel */}
      <div className="sys-pulse-panel mx-2 mb-2 rounded-[11px] p-3">
        <div className="mb-2 flex items-center justify-between border-b border-white/[0.05] pb-2">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/40">
            System
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-400">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              style={{ boxShadow: '0 0 6px #34d399', animation: 'pulse-live 2s infinite' }}
            />
            Online
          </span>
        </div>
        <div className="space-y-1.5">
          {[
            { k: 'sync', v: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) },
            { k: 'módulos', v: '7/7' },
          ].map(({ k, v }) => (
            <div key={k} className="flex items-center justify-between">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted-foreground/40">{k}</span>
              <span className="font-mono text-[10px] text-muted-foreground/70">{v}</span>
            </div>
          ))}
        </div>
        {/* Animated bars */}
        <div className="mt-2.5 flex items-end gap-[2px] pt-2 border-t border-white/[0.05]" style={{ height: '20px' }}>
          {[30, 65, 45, 80, 55, 90, 40, 70, 50, 75, 35, 85].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: i === 11 ? '#34d399' : 'rgba(96,165,250,.35)',
                boxShadow: i === 11 ? '0 0 6px #34d399' : undefined,
                animation: `sp-bar 2.4s ease-in-out ${i * 0.1}s infinite`,
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </div>
      </div>

      {/* Config + user footer */}
      <div className="px-2 pb-2 space-y-1">
        <Link
          href={configItem.href}
          className={cn(
            'relative flex items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-[7px] text-[12.5px] font-medium transition-all duration-150',
            isActive(configItem.href)
              ? cn(configItem.activeClass, 'text-foreground')
              : 'text-muted-foreground hover:border-white/[0.04] hover:bg-white/[0.025] hover:text-foreground/80'
          )}
        >
          <Settings className="h-4 w-4 shrink-0 opacity-60" />
          Configuración
        </Link>

        {/* User chip */}
        <div className="brand-panel flex items-center gap-2.5 rounded-[10px] px-3 py-2">
          <div
            className="h-7 w-7 shrink-0 rounded-full"
            style={{
              background: 'radial-gradient(120% 100% at 30% 20%, rgba(52,211,153,.22), transparent 60%), #0c0d12',
              border: '1px solid rgba(255,255,255,.08)',
              boxShadow: 'inset 0 0 0 1px rgba(52,211,153,.08), 0 0 12px -6px rgba(52,211,153,.4)',
            }}
          />
          <div>
            <div className="text-[12.5px] font-medium text-foreground/80">tú</div>
            <div className="font-mono text-[8.5px] tracking-[0.06em] text-muted-foreground/40">operator · local</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
