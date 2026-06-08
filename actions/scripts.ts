'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'
import { logActivity } from './activity'
import { getSession } from '@/lib/session'

export async function upsertScript(scenarioId: string, fd: FormData): Promise<ActionResult> {
  const supabase = createAdminClient()
  const session  = await getSession()
  const body     = fd.get('body') as string
  if (!body) return { success: false, error: 'Script body is required' }
  const wordCount    = body.trim().split(/\s+/).length
  const duration_sec = Math.round(wordCount / 2.5)

  const { error } = await supabase.from('scripts').upsert({
    scenario_id: scenarioId, body, duration_sec,
    voice_url: (fd.get('voice_url') as string) || null,
  }, { onConflict: 'scenario_id' })
  if (error) return { success: false, error: error.message }

  // Save version snapshot
  await supabase.from('script_versions').insert({
    scenario_id: scenarioId, body, word_count: wordCount, saved_by: session?.name ?? 'Unknown',
  })

  await logActivity(scenarioId, session?.name ?? 'Unknown', 'Script updated', `${wordCount} words`)
  revalidatePath(`/scenarios/${scenarioId}/script`)
  revalidatePath('/scripts')
  return { success: true, data: undefined }
}

export type ScriptVersion = {
  id: string
  body: string
  word_count: number | null
  saved_by: string | null
  created_at: string
}

export async function getScriptVersions(scenarioId: string): Promise<ScriptVersion[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('script_versions')
    .select('id, body, word_count, saved_by, created_at')
    .eq('scenario_id', scenarioId)
    .order('created_at', { ascending: false })
    .limit(20)
  return (data ?? []) as ScriptVersion[]
}

export async function restoreScriptVersion(scenarioId: string, body: string): Promise<ActionResult> {
  const fd = new FormData()
  fd.set('body', body)
  return upsertScript(scenarioId, fd)
}
