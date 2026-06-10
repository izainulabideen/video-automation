import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://veank.studio'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/watch',
        disallow: ['/', '/dashboard', '/scenarios', '/settings', '/api'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
