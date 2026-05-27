'use client'
import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const supabase = createClient()
      const { error } = mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/')
        router.refresh()
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07070a] p-6">
      <div className="w-full max-w-sm">
        {/* Logo / Header */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border"
            style={{ borderColor: 'rgba(52,211,153,.3)', background: 'rgba(52,211,153,.08)', boxShadow: '0 0 32px -8px rgba(52,211,153,.4)' }}
          >
            <svg viewBox="0 0 16 16" className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <rect x="2" y="2" width="12" height="12" rx="2" />
              <path d="M5 8 L7 10 L11 6" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground/90">Personal OS</h1>
          <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[.16em] text-muted-foreground/35">
            {mode === 'signin' ? 'iniciar sesión' : 'crear cuenta'}
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: 'rgba(255,255,255,.07)', background: 'rgba(255,255,255,.025)' }}
        >
          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/[0.08] px-3 py-2.5 font-mono text-[11px] text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="mb-1.5 block font-mono text-[9.5px] uppercase tracking-[.16em] text-muted-foreground/40">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 font-sans text-[13px] text-foreground/80 placeholder:text-muted-foreground/30 outline-none transition-colors focus:border-emerald-500/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[9.5px] uppercase tracking-[.16em] text-muted-foreground/40">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="mínimo 6 caracteres"
                className="w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2.5 font-sans text-[13px] text-foreground/80 placeholder:text-muted-foreground/30 outline-none transition-colors focus:border-emerald-500/40"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg border border-emerald-500/35 py-2.5 font-mono text-[12px] font-medium text-emerald-400 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(180deg, rgba(52,211,153,.15), rgba(52,211,153,.06))', boxShadow: '0 0 22px -10px rgba(52,211,153,.5)' }}
            >
              {isPending ? 'espera…' : mode === 'signin' ? 'entrar' : 'crear cuenta'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(null) }}
              className="font-mono text-[10.5px] text-muted-foreground/35 transition-colors hover:text-emerald-400/70"
            >
              {mode === 'signin' ? '¿primera vez? crear cuenta' : '¿ya tienes cuenta? iniciar sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
