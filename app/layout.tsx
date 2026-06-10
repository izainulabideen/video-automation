import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://veank.studio'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: 'Veank Studio', template: '%s — Veank Studio' },
  description: 'Cinematic education across finance, history, psychology, mythology and more. Real insights, no noise.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Veank Studio',
  },
  openGraph: {
    siteName: 'Veank Studio',
    title: 'Veank Studio',
    description: 'Cinematic education. Real insights, no noise.',
    type: 'website',
    url: BASE_URL,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Veank Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veank Studio',
    description: 'Cinematic education. Real insights, no noise.',
    images: ['/og-default.png'],
  },
  alternates: { canonical: BASE_URL },
}

export const viewport: Viewport = {
  themeColor: '#06080F',
  width: 'device-width',
  initialScale: 1,
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
