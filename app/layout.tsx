import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Veank Studio',
  description: 'Finance content automation platform',
  openGraph: {
    title: 'Veank Studio',
    description: 'Cinematic finance education.',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veank Studio',
    description: 'Cinematic finance education.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-brand-50 text-brand-900 antialiased">
        {children}
      </body>
    </html>
  )
}
