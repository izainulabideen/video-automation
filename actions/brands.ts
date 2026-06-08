'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'
import type { Brand, BrandTheme } from '@/types/brand'

export async function getBrands(): Promise<Brand[]> {
  const db = createAdminClient()
  const { data } = await db.from('brands').select('*').order('created_at')
  return (data ?? []) as Brand[]
}

export async function getBrand(id: string): Promise<Brand | null> {
  const db = createAdminClient()
  const { data } = await db.from('brands').select('*').eq('id', id).single()
  return data as Brand | null
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const db = createAdminClient()
  const { data } = await db.from('brands').select('*').eq('slug', slug).single()
  return data as Brand | null
}

export async function createBrand(fd: FormData): Promise<ActionResult<{ id: string }>> {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Admin only' }

  const db = createAdminClient()
  const name  = (fd.get('name') as string)?.trim()
  const slug  = (fd.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-')
  const description = (fd.get('description') as string)?.trim() || null

  if (!name || !slug) return { success: false, error: 'Name and slug required' }

  const theme_config: BrandTheme = {
    accent:     (fd.get('accent')     as string) || '#C8922A',
    accentH:    (fd.get('accentH')    as string) || '#E8B84B',
    accentDim:  (fd.get('accentDim')  as string) || '#92400e',
    bg:         (fd.get('bg')         as string) || '#06080F',
    surface:    (fd.get('surface')    as string) || '#0D1117',
    border:     (fd.get('border')     as string) || 'rgba(200,146,42,0.15)',
    mood:       (fd.get('mood')       as BrandTheme['mood'])       || 'dark',
    heroStyle:  (fd.get('heroStyle')  as BrandTheme['heroStyle'])  || 'cinematic',
    fontWeight: (fd.get('fontWeight') as BrandTheme['fontWeight']) || 'black',
    tagline:    (fd.get('tagline')    as string) || name,
    aiTone:     (fd.get('aiTone')     as string) || 'educational, engaging',
    niches:     JSON.parse((fd.get('niches') as string) || '[]'),
    nicheLabels: JSON.parse((fd.get('nicheLabels') as string) || '{}'),
  }

  const { data, error } = await db
    .from('brands')
    .insert({ name, slug, description, theme_config })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }
  revalidatePath('/settings/brands')
  return { success: true, data: { id: data.id } }
}

export async function updateBrand(id: string, fd: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Admin only' }

  const db = createAdminClient()
  const name        = (fd.get('name') as string)?.trim()
  const description = (fd.get('description') as string)?.trim() || null

  const theme_config: BrandTheme = {
    accent:     (fd.get('accent')     as string) || '#C8922A',
    accentH:    (fd.get('accentH')    as string) || '#E8B84B',
    accentDim:  (fd.get('accentDim')  as string) || '#92400e',
    bg:         (fd.get('bg')         as string) || '#06080F',
    surface:    (fd.get('surface')    as string) || '#0D1117',
    border:     (fd.get('border')     as string) || 'rgba(200,146,42,0.15)',
    mood:       (fd.get('mood')       as BrandTheme['mood'])       || 'dark',
    heroStyle:  (fd.get('heroStyle')  as BrandTheme['heroStyle'])  || 'cinematic',
    fontWeight: (fd.get('fontWeight') as BrandTheme['fontWeight']) || 'black',
    tagline:    (fd.get('tagline')    as string) || name || '',
    aiTone:     (fd.get('aiTone')     as string) || '',
    niches:     JSON.parse((fd.get('niches') as string) || '[]'),
    nicheLabels: JSON.parse((fd.get('nicheLabels') as string) || '{}'),
  }

  const { error } = await db
    .from('brands')
    .update({ name, description, theme_config, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/settings/brands')
  revalidatePath(`/settings/brands/${id}`)
  return { success: true, data: undefined }
}

export async function deleteBrand(id: string): Promise<ActionResult> {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Admin only' }

  const db = createAdminClient()
  // Null out scenarios instead of cascading delete
  await db.from('scenarios').update({ brand_id: null } as never).eq('brand_id', id)
  const { error } = await db.from('brands').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/settings/brands')
  return { success: true, data: undefined }
}

export async function toggleBrandActive(id: string, is_active: boolean): Promise<ActionResult> {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Admin only' }
  const db = createAdminClient()
  const { error } = await db.from('brands').update({ is_active }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/settings/brands')
  return { success: true, data: undefined }
}
