'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'

export async function createGraphicRecord(params: {
  scenarioId: string
  fileUrl: string
  fileName: string
  fileSizeKb?: number
  sceneType?: string
  captionWord?: string
}): Promise<ActionResult<{ id: string }>> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from('graphics').insert({
    scenario_id:  params.scenarioId,
    file_url:     params.fileUrl,
    file_name:    params.fileName,
    file_size_kb: params.fileSizeKb ?? null,
    scene_type:   params.sceneType  ?? null,
    caption_word: params.captionWord ?? null,
  }).select('id').single()
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${params.scenarioId}/graphics`)
  revalidatePath('/graphics')
  return { success: true, data: { id: data.id } }
}

export async function deleteGraphic(id: string, scenarioId: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('graphics').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${scenarioId}/graphics`)
  revalidatePath('/graphics')
  return { success: true, data: undefined }
}
