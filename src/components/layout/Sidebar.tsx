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

const navGroups = [
  {
    label: 'MÓDULOS',
    items: [
      {
        href: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
        activeColor: 'text-blue-400',
        glowColor: 'shadow-blue-500/20',
        bgActive: 'bg-blue-500/10',
      },
      {
        href: '/finanzas',
        label: 'Finanzas',
        icon: TrendingUp,
        activeColor: 'text-emerald-400',
        glowColor: 'shadow-emerald-500/20',
        bgActive: 'bg-emerald-500/10',
      },
      {
        href: '/estudios',
        label: 'Estudios',
        icon: GraduationCap,
        activeColor: 'text-sky-400',
        glowColor: 'shadow-sky-500/20',
        bgActive: 'bg-sky-500/10',
      },
      {
        href: '/youtube',
        label: 'YouTube',
        icon: Youtube,
        activeColor: 'text-rose-400',
        glowColor: 'shadow-rose-500/20',
        bgActive: 'bg-rose-500/10',
      },
    ],
  },
  {
    label: 'INTELIGENCIA',
    items: [
      {
        href: '/ai',
        label: 'AI',
        icon: Bot,
        activeColor: 'text-violet-400',
        glowColor: 'shadow-violet-500/20',
        bgActive: 'bg-violet-500/10',
      },
      {
        href: '/aprendizaje',
        label: 'Aprendizaje',
        icon: BookOpen,
        activeColor: 'text-lime-400',
        glowColor: 'shadow-lime-500/20',
        bgActive: 'bg-lime-500/10',
      },
    ],
  },
]

const settingsItem = {
  href: '/configuracion',
  label: 'Configuración',
  icon: Settings,
  activeColor: 'text-zinc-400',
  glowColor: 'shadow-zinc-500/20',
  bgActive: 'bg-zinc-500/10',
}

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <aside className="flex h-screen w-56 flex-col bg-[hsl(222,30%,5%)] border-r border-border/50">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 border border-primary/30">
          <span className="text-xs font-bold text-primary">OS</span>
        </div>
        <span className="text-sm font-semibold tracking-tight text-foreground/90">
          Personal OS
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-4 px-2 py-2 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
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
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150',
                        active
                          ? cn(
                              item.bgActive,
                              item.activeColor,
                              'font-medium shadow-sm',
                              item.glowColor
                            )
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Settings anchor */}
      <div className="px-2 pb-4">
        <div className="border-t border-border/30 pt-3">
          <Link
            href={settingsItem.href}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150',
              isActive(settingsItem.href)
                ? cn(settingsItem.bgActive, settingsItem.activeColor, 'font-medium')
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <settingsItem.icon className="h-4 w-4 shrink-0" />
            {settingsItem.label}
          </Link>
        </div>
      </div>
    </aside>
  )
}
