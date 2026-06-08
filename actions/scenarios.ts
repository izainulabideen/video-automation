'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'

export async function createScenario(fd: FormData): Promise<ActionResult<{ id: string }>> {
  const supabase = createAdminClient()
  const title = fd.get('title') as string
  const niche = fd.get('niche') as string
  const hook  = fd.get('hook')  as string
  if (!title || !niche || !hook) return { success: false, error: 'Required fields missing' }
  const { data, error } = await supabase
    .from('scenarios')
    .insert({
      title, niche, hook,
      audience: (fd.get('audience') as string) || null,
      emotion:  (fd.get('emotion')  as string) || null,
      palette:  (fd.get('palette')  as string) || null,
      notes:    (fd.get('notes')    as string) || null,
    })
    .select('id').single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/scenarios')
  revalidatePath('/dashboard')
  return { success: true, data: { id: data.id } }
}

export async function updateScenario(id: string, fd: FormData): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('scenarios').update({
    title:    (fd.get('title')    as string) || undefined,
    niche:    (fd.get('niche')    as string) || undefined,
    hook:     (fd.get('hook')     as string) || undefined,
    audience: (fd.get('audience') as string) || null,
    emotion:  (fd.get('emotion')  as string) || null,
    palette:  (fd.get('palette')  as string) || null,
    notes:    (fd.get('notes')    as string) || null,
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
  const { error } = await supabase.from('scenarios').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${id}`)
  revalidatePath('/scenarios')
  return { success: true, data: undefined }
}


export async function deleteScenario(id: string): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('scenarios').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/scenarios')
  revalidatePath('/dashboard')
  return { success: true, data: undefined }
}
