import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://veank.studio'
  const supabase = createAdminClient()

  const { data: rows } = await supabase
    .from('public_settings')
    .select('scenario_id, scenarios(id, updated_at, status)')
    .eq('is_public', true)

  const stories: MetadataRoute.Sitemap = (rows ?? [])
    .flatMap(r => Array.isArray(r.scenarios) ? r.scenarios : r.scenarios ? [r.scenarios] : [])
    .filter(Boolean)
    .map((s: { id: string; updated_at: string; status: string }) => ({
      url: `${base}/watch/${s.id}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: s.status === 'published' ? 'monthly' : 'weekly',
      priority: s.status === 'published' ? 0.8 : 0.4,
    }))

  return [
    { url: `${base}/watch`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    ...stories,
  ]
}
