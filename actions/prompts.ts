'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'

export async function createPrompt(fd: FormData): Promise<ActionResult<{ id: string }>> {
  const supabase = await createServerClient()
  const scenario_id  = fd.get('scenario_id')  as string
  const scene_type   = fd.get('scene_type')   as string
  const prompt_text  = fd.get('prompt_text')  as string
  const ai_tool      = (fd.get('ai_tool') as string) || 'midjourney'
  if (!scenario_id || !scene_type || !prompt_text) return { success: false, error: 'Required fields missing' }
  const { data, error } = await supabase.from('prompts').insert({
    scenario_id, scene_type, prompt_text, ai_tool,
    caption_word: (fd.get('caption_word') as string) || null,
    sort_order: Number(fd.get('sort_order') ?? 0),
  }).select('id').single()
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${scenario_id}/prompts`)
  revalidatePath('/prompts')
  return { success: true, data: { id: data.id } }
}

export async function updatePrompt(id: string, fd: FormData): Promise<ActionResult> {
  const supabase = await createServerClient()
  const scenario_id = fd.get('scenario_id') as string
  const { error } = await supabase.from('prompts').update({
    scene_type:   (fd.get('scene_type')   as string) || undefined,
    prompt_text:  (fd.get('prompt_text')  as string) || undefined,
    ai_tool:      (fd.get('ai_tool')      as string) || undefined,
    caption_word: (fd.get('caption_word') as string) || null,
  }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${scenario_id}/prompts`)
  revalidatePath('/prompts')
  return { success: true, data: undefined }
}

export async function deletePrompt(id: string, scenarioId: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('prompts').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${scenarioId}/prompts`)
  revalidatePath('/prompts')
  return { success: true, data: undefined }
}

export async function reorderPrompts(ids: string[], scenarioId: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const updates = ids.map((id, index) =>
    supabase.from('prompts').update({ sort_order: index }).eq('id', id)
  )
  const results = await Promise.all(updates)
  const err = results.find(r => r.error)
  if (err?.error) return { success: false, error: err.error.message }
  revalidatePath(`/scenarios/${scenarioId}/prompts`)
  return { success: true, data: undefined }
}
