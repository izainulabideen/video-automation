'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import type { Brand } from '@/types/brand'
import { sanitizeStr } from '@/lib/sanitize'

export async function getBrands(): Promise<Brand[]> {
  const supabase = createAdminClient()
  const { data } = await supabase.from('brands').select('*').order('name')
  return (data ?? []) as Brand[]
}

export async function getBrand(id: string): Promise<Brand | null> {
  const supabase = createAdminClient()
  const { data } = await supabase.from('brands').select('*').eq('id', id).single()
  return data as Brand | null
}

export async function createBrand(fd: FormData) {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Unauthorized' }
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('brands').insert({
    name: sanitizeStr(fd.get('name'), 200),
    slug: sanitizeStr(fd.get('slug'), 100),
    description: (fd.get('description') as string) || null,
    theme_config: JSON.parse(fd.get('theme_config') as string),
  }).select('id').single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/settings/brands')
  return { success: true, data: { id: data.id } }
}

export async function updateBrand(id: string, fd: FormData) {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Unauthorized' }
  const supabase = createAdminClient()
  const { error } = await supabase.from('brands').update({
    name: sanitizeStr(fd.get('name'), 200),
    slug: sanitizeStr(fd.get('slug'), 100),
    description: (fd.get('description') as string) || null,
    theme_config: JSON.parse(fd.get('theme_config') as string),
  }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/settings/brands')
  revalidatePath(`/settings/brands/${id}`)
  return { success: true, data: undefined }
}

export async function toggleBrandActive(id: string, is_active: boolean) {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Unauthorized' }
  const supabase = createAdminClient()
  const { error } = await supabase.from('brands').update({ is_active }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/settings/brands')
  return { success: true, data: undefined }
}

export async function deleteBrand(id: string) {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Unauthorized' }
  const supabase = createAdminClient()
  const { error } = await supabase.from('brands').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/settings/brands')
  return { success: true, data: undefined }
}
