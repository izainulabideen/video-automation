'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'

export async function upsertScript(scenarioId: string, fd: FormData): Promise<ActionResult> {
  const supabase = await createServerClient()
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
  revalidatePath(`/scenarios/${scenarioId}/script`)
  revalidatePath('/scripts')
  return { success: true, data: undefined }
}
