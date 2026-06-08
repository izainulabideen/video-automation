'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'
import { logActivity } from './activity'
import { getSession } from '@/lib/session'

export async function upsertScript(scenarioId: string, fd: FormData): Promise<ActionResult> {
  const supabase = createAdminClient()
  const session = await getSession()
  const body = fd.get('body') as string
  if (!body) return { success: false, error: 'Script body is required' }
  const wordCount = body.trim().split(/\s+/).length
  const duration_sec = Math.round(wordCount / 2.5)
  const { error } = await supabase.from('scripts').upsert({
    scenario_id: scenarioId,
    body,
    duration_sec,
    voice_url: (fd.get('voice_url') as string) || null,
  }, { onConflict: 'scenario_id' })
  if (error) return { success: false, error: error.message }
  await logActivity(scenarioId, session?.name ?? 'Unknown', 'Script updated', `${wordCount} words`)
  revalidatePath(`/scenarios/${scenarioId}/script`)
  revalidatePath('/scripts')
  return { success: true, data: undefined }
}
