'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'

export async function upsertVideo(scenarioId: string, fd: FormData): Promise<ActionResult> {
  const supabase = await createServerClient()
  const platform_urls = {
    tiktok:   (fd.get('tiktok')   as string) || null,
    youtube:  (fd.get('youtube')  as string) || null,
    reels:    (fd.get('reels')    as string) || null,
  }
  const performance = {
    views:  Number(fd.get('views')  ?? 0),
    likes:  Number(fd.get('likes')  ?? 0),
    shares: Number(fd.get('shares') ?? 0),
  }
  const { error } = await supabase.from('videos').upsert({
    scenario_id:  scenarioId,
    file_url:     (fd.get('file_url')    as string) || null,
    status:       ((fd.get('status') as string) || 'editing') as 'editing' | 'exported' | 'published',
    duration_sec: Number(fd.get('duration_sec') ?? 0) || null,
    publish_date: (fd.get('publish_date') as string) || null,
    notes:        (fd.get('notes')        as string) || null,
    platform_urls,
    performance,
  }, { onConflict: 'scenario_id' })
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${scenarioId}/video`)
  revalidatePath('/videos')
  return { success: true, data: undefined }
}
