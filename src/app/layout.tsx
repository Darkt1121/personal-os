import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Caveat } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { DashboardShell } from '@/components/layout/DashboardShell'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
})
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Personal OS',
  description: 'Sistema operativo personal — finanzas, estudios, YouTube, AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${caveat.variable} font-sans`}>
        <Providers>
          <DashboardShell>{children}</DashboardShell>
        </Providers>
      </body>
    </html>
  )
}
