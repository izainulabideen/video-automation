'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'
import { logActivity } from './activity'
import { getSession } from '@/lib/session'
import { sanitizeStr } from '@/lib/sanitize'

export async function createScenario(fd: FormData): Promise<ActionResult<{ id: string }>> {
  const supabase = createAdminClient()
  const title = sanitizeStr(fd.get('title'), 200)
  const niche = sanitizeStr(fd.get('niche'), 100)
  const hook  = sanitizeStr(fd.get('hook'), 300)
  if (!title || !niche || !hook) return { success: false, error: 'Required fields missing' }
  const { data, error } = await supabase
    .from('scenarios')
    .insert({
      title, niche, hook,
      brand_id: (fd.get('brand_id') as string) || null,
      audience: sanitizeStr(fd.get('audience'), 200) || null,
      emotion:  sanitizeStr(fd.get('emotion'), 200)  || null,
      palette:  sanitizeStr(fd.get('palette'), 100)  || null,
      notes:    sanitizeStr(fd.get('notes'), 2000)   || null,
    })
    .select('id').single()
  if (error) return { success: false, error: error.message }
  import('@/lib/webhook').then(m => m.fireWebhook('scenario.created', { id: data.id, title }))
  revalidatePath('/scenarios')
  revalidatePath('/dashboard')
  return { success: true, data: { id: data.id } }
}

export async function updateScenario(id: string, fd: FormData): Promise<ActionResult> {
  const supabase = createAdminClient()
  const brandId = fd.get('brand_id') as string | null
  const { error } = await supabase.from('scenarios').update({
    title:    sanitizeStr(fd.get('title'), 200) || undefined,
    niche:    sanitizeStr(fd.get('niche'), 100) || undefined,
    hook:     sanitizeStr(fd.get('hook'), 300)  || undefined,
    audience: sanitizeStr(fd.get('audience'), 200) || null,
    emotion:  sanitizeStr(fd.get('emotion'), 200)  || null,
    palette:  sanitizeStr(fd.get('palette'), 100)  || null,
    notes:    sanitizeStr(fd.get('notes'), 2000)   || null,
    brand_id: brandId || null,
  }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${id}`)
  revalidatePath('/scenarios')
  return { success: true, data: undefined }
}

export async function updateScenarioStatus(
  id: string, status: 'draft' | 'in_production' | 'published'
): Promise<ActionResult> {
  const supabase = createAdminClient()
  const session = await getSession()
  const { error } = await supabase.from('scenarios').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }
  await logActivity(id, session?.name ?? 'Unknown', `Status changed to ${status}`)
  if (status === 'published') {
    const { data: s } = await supabase.from('scenarios').select('title, assigned_to').eq('id', id).single()
    if (s?.assigned_to) {
      const { data: u } = await supabase.from('users').select('email').eq('name', s.assigned_to).single()
      if (u?.email) {
        import('@/lib/email').then(m => m.sendPublishNotification([u.email], s.title, id))
      }
    }
    import('@/lib/webhook').then(m => m.fireWebhook('scenario.published', { id, title: s?.title }))
  }
  revalidatePath(`/scenarios/${id}`)
  revalidatePath('/scenarios')
  return { success: true, data: undefined }
}


export async function duplicateScenario(id: string): Promise<ActionResult<{ id: string }>> {
  const supabase = createAdminClient()
  const { data: original, error: fetchError } = await supabase
    .from('scenarios')
    .select('*')
    .eq('id', id)
    .single()
  if (fetchError || !original) return { success: false, error: fetchError?.message ?? 'Scenario not found' }
  const { data, error } = await supabase
    .from('scenarios')
    .insert({
      title:    'Copy of ' + original.title,
      niche:    original.niche,
      hook:     original.hook,
      audience: original.audience ?? null,
      emotion:  original.emotion  ?? null,
      palette:  original.palette  ?? null,
      notes:    original.notes    ?? null,
      brand_id: original.brand_id ?? null,
      status:   'draft',
    })
    .select('id').single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/scenarios')
  return { success: true, data: { id: data.id } }
}

export async function deleteScenario(id: string): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('scenarios').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/scenarios')
  revalidatePath('/dashboard')
  return { success: true, data: undefined }
}
