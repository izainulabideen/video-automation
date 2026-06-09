import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = createAdminClient()
  const { data: brand } = await supabase.from('brands').select('name,description,theme_config').eq('slug', slug).eq('is_active', true).single()
  if (!brand) return { title: 'Veank Studio' }
  return {
    title: `${brand.name} — Veank Studio`,
    description: brand.description ?? (brand.theme_config as { tagline?: string })?.tagline,
    openGraph: { title: `${brand.name} — Veank Studio`, description: brand.description ?? '' },
  }
}

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('brands').select('slug').eq('is_active', true)
    return (data ?? []).map(b => ({ slug: b.slug }))
  } catch {
    return []
  }
}

export const revalidate = 3600

export default async function BrandPage({ params }: Props) {
  const { slug } = await params
  redirect(`/watch?brand=${slug}`)
}
