'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'

export async function getBrandMembers(brandId: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('brand_members')
    .select('id, user_id, users(name, email)')
    .eq('brand_id', brandId)
  return data ?? []
}

export async function addBrandMember(brandId: string, userId: string): Promise<ActionResult> {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Admin only' }
  const supabase = createAdminClient()
  const { error } = await supabase.from('brand_members').insert({ brand_id: brandId, user_id: userId })
  if (error) return { success: false, error: error.message }
  revalidatePath(`/settings/brands/${brandId}`)
  return { success: true, data: undefined }
}

export async function removeBrandMember(id: string, brandId: string): Promise<ActionResult> {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Admin only' }
  const supabase = createAdminClient()
  const { error } = await supabase.from('brand_members').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/settings/brands/${brandId}`)
  return { success: true, data: undefined }
}
