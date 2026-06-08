'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'

export interface PublicSettings {
  id?: string
  scenario_id: string
  is_public: boolean
  show_script: boolean
  show_graphics: boolean
  show_video: boolean
  show_platform_links: boolean
  updated_at?: string
  updated_by?: string | null
}

export async function getPublicSettings(scenarioId: string): Promise<PublicSettings | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('public_settings')
    .select('*')
    .eq('scenario_id', scenarioId)
    .single()
  return data as PublicSettings | null
}

export async function upsertPublicSettings(
  scenarioId: string,
  settings: Omit<PublicSettings, 'id' | 'scenario_id' | 'updated_at' | 'updated_by'>
): Promise<ActionResult> {
  const session = await getSession()
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('public_settings')
    .upsert({
      scenario_id:        scenarioId,
      is_public:          settings.is_public,
      show_script:        settings.show_script,
      show_graphics:      settings.show_graphics,
      show_video:         settings.show_video,
      show_platform_links: settings.show_platform_links,
      updated_by:         session?.name ?? null,
    }, { onConflict: 'scenario_id' })

  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${scenarioId}`)
  revalidatePath('/watch')
  revalidatePath(`/watch/${scenarioId}`)
  return { success: true, data: undefined }
}
