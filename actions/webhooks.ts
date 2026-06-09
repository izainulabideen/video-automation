'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'

export async function getWebhooks() {
  const supabase = createAdminClient()
  const { data } = await supabase.from('webhooks').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function createWebhook(fd: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Admin only' }
  const supabase = createAdminClient()
  const url = fd.get('url') as string
  const label = fd.get('label') as string
  const events = (fd.getAll('events') as string[])
  if (!url || !events.length) return { success: false, error: 'URL and at least one event required' }
  const { error } = await supabase.from('webhooks').insert({ url, label, events })
  if (error) return { success: false, error: error.message }
  revalidatePath('/settings/webhooks')
  return { success: true, data: undefined }
}

export async function deleteWebhook(id: string): Promise<ActionResult> {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Admin only' }
  const supabase = createAdminClient()
  const { error } = await supabase.from('webhooks').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/settings/webhooks')
  return { success: true, data: undefined }
}

export async function toggleWebhook(id: string, isActive: boolean): Promise<ActionResult> {
  const session = await getSession()
  if (session?.role !== 'admin') return { success: false, error: 'Admin only' }
  const supabase = createAdminClient()
  const { error } = await supabase.from('webhooks').update({ is_active: isActive }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/settings/webhooks')
  return { success: true, data: undefined }
}
