'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'
import { logActivity } from './activity'
import { getSession } from '@/lib/session'

export async function createGraphicRecord(params: {
  scenarioId: string
  fileUrl: string
  fileName: string
  fileSizeKb?: number
  sceneType?: string
  captionWord?: string
  mediaType?: 'image' | 'clip'
  clipDurationSec?: number
}): Promise<ActionResult<{ id: string }>> {
  const db = createAdminClient()
  const session = await getSession()

  // Get current max sort_order
  const { data: existing } = await db.from('graphics').select('sort_order').eq('scenario_id', params.scenarioId).order('sort_order', { ascending: false }).limit(1)
  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1

  const { data, error } = await db.from('graphics').insert({
    scenario_id:       params.scenarioId,
    file_url:          params.fileUrl,
    file_name:         params.fileName,
    file_size_kb:      params.fileSizeKb ?? null,
    scene_type:        params.sceneType  ?? null,
    caption_word:      params.captionWord ?? null,
    media_type:        params.mediaType ?? 'image',
    clip_duration_sec: params.clipDurationSec ?? null,
    sort_order:        nextOrder,
  }).select('id').single()

  if (error) return { success: false, error: error.message }

  await logActivity(params.scenarioId, session?.name ?? 'Unknown',
    `Uploaded ${params.mediaType === 'clip' ? 'clip' : 'image'}: ${params.fileName}`)

  revalidatePath(`/scenarios/${params.scenarioId}`)
  return { success: true, data: { id: data.id } }
}

export async function deleteGraphic(id: string, scenarioId: string): Promise<ActionResult> {
  const db = createAdminClient()
  const session = await getSession()
  const { data: g } = await db.from('graphics').select('file_name').eq('id', id).single()
  const { error } = await db.from('graphics').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  if (g) await logActivity(scenarioId, session?.name ?? 'Unknown', `Deleted media: ${g.file_name}`)
  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}

export async function bulkDeleteGraphics(ids: string[], scenarioId: string): Promise<ActionResult> {
  const db = createAdminClient()
  const session = await getSession()
  const { error } = await db.from('graphics').delete().in('id', ids)
  if (error) return { success: false, error: error.message }
  await logActivity(scenarioId, session?.name ?? 'Unknown', `Deleted ${ids.length} media item${ids.length !== 1 ? 's' : ''}`)
  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}

export async function reorderGraphics(scenarioId: string, orderedIds: string[]): Promise<ActionResult> {
  const db = createAdminClient()
  // Update sort_order for each id
  await Promise.all(
    orderedIds.map((id, index) =>
      db.from('graphics').update({ sort_order: index }).eq('id', id)
    )
  )
  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}

export async function setCoverGraphic(scenarioId: string, graphicId: string | null): Promise<ActionResult> {
  const db = createAdminClient()
  const session = await getSession()
  const { error } = await db.from('scenarios').update({ cover_graphic_id: graphicId }).eq('id', scenarioId)
  if (error) return { success: false, error: error.message }
  await logActivity(scenarioId, session?.name ?? 'Unknown', graphicId ? 'Set cover image' : 'Removed cover image')
  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}
