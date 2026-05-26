import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { DashboardShell } from '@/components/layout/DashboardShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personal OS',
  description: 'Sistema operativo personal — finanzas, estudios, YouTube, AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <Providers>
          <DashboardShell>{children}</DashboardShell>
        </Providers>
      </body>
    </html>
  )
}
