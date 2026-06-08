'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'
import { logActivity } from './activity'

const DEFAULT_ITEMS = [
  { label: 'Script written',     sort_order: 0 },
  { label: 'Prompts generated',  sort_order: 1 },
  { label: 'Graphics created',   sort_order: 2 },
  { label: 'Video edited',       sort_order: 3 },
  { label: 'Video uploaded',     sort_order: 4 },
  { label: 'Published',          sort_order: 5 },
]

export type ChecklistItem = {
  id: string
  scenario_id: string
  label: string
  is_done: boolean
  done_by: string | null
  done_at: string | null
  sort_order: number
}

export async function getOrCreateChecklist(scenarioId: string): Promise<ChecklistItem[]> {
  const db = createAdminClient()
  const { data } = await db
    .from('checklist_items')
    .select('*')
    .eq('scenario_id', scenarioId)
    .order('sort_order')

  if (data && data.length > 0) return data as ChecklistItem[]

  // Seed defaults
  const inserts = DEFAULT_ITEMS.map(item => ({ ...item, scenario_id: scenarioId }))
  const { data: created } = await db.from('checklist_items').insert(inserts).select('*').order('sort_order')
  return (created ?? []) as ChecklistItem[]
}

export async function toggleChecklistItem(id: string, scenarioId: string, isDone: boolean): Promise<ActionResult> {
  const session = await getSession()
  const db = createAdminClient()

  const { data: item } = await db.from('checklist_items').select('label').eq('id', id).single()

  const { error } = await db.from('checklist_items').update({
    is_done: isDone,
    done_by: isDone ? (session?.name ?? 'Unknown') : null,
    done_at: isDone ? new Date().toISOString() : null,
  }).eq('id', id)

  if (error) return { success: false, error: error.message }

  if (item) {
    await logActivity(scenarioId, session?.name ?? 'Unknown',
      isDone ? `Checked: ${item.label}` : `Unchecked: ${item.label}`)
  }

  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}

export async function addChecklistItem(scenarioId: string, label: string): Promise<ActionResult> {
  const db = createAdminClient()
  const { data: existing } = await db.from('checklist_items').select('sort_order').eq('scenario_id', scenarioId).order('sort_order', { ascending: false }).limit(1)
  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1
  const { error } = await db.from('checklist_items').insert({ scenario_id: scenarioId, label, sort_order: nextOrder })
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}

export async function deleteChecklistItem(id: string, scenarioId: string): Promise<ActionResult> {
  const db = createAdminClient()
  const { error } = await db.from('checklist_items').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}

export async function renameChecklistItem(id: string, scenarioId: string, label: string): Promise<ActionResult> {
  const db = createAdminClient()
  const { error } = await db.from('checklist_items').update({ label }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}
