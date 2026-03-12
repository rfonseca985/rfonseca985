import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'CannTrace Care | Gestao de Cannabis Medicinal',
  description: 'Plataforma SaaS para gestao completa de Cannabis Medicinal - Rastreabilidade Seed-to-Patient, Telemedicina e Compliance ANVISA',
  generator: 'CannTrace Care',
  keywords: ['cannabis medicinal', 'rastreabilidade', 'ANVISA', 'telemedicina', 'RDC 660', 'seed-to-patient'],
  authors: [{ name: 'CannTrace Care' }],
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
