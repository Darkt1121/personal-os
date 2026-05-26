import { Bot } from 'lucide-react'

export const metadata = { title: 'AI — Personal OS' }

export default function AiPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-card to-card p-6 shadow-lg shadow-violet-500/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/25">
            <Bot className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">AI</h1>
            <p className="text-sm text-muted-foreground">Sesiones y herramientas de IA</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground text-sm">Módulo en construcción</p>
      </div>
    </div>
  )
}
