'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'
import { sanitizeUrl, sanitizeInt, sanitizeStr } from '@/lib/sanitize'

const ALLOWED_STATUSES = ['editing', 'exported', 'published'] as const
type VideoStatus = typeof ALLOWED_STATUSES[number]

export async function upsertVideo(scenarioId: string, fd: FormData): Promise<ActionResult> {
  const supabase = createAdminClient()
  const platform_urls = {
    tiktok:  sanitizeUrl(fd.get('tiktok'))  || null,
    youtube: sanitizeUrl(fd.get('youtube')) || null,
    reels:   sanitizeUrl(fd.get('reels'))   || null,
  }
  const performance = {
    views:  Number(fd.get('views')  ?? 0),
    likes:  Number(fd.get('likes')  ?? 0),
    shares: Number(fd.get('shares') ?? 0),
  }
  const rawStatus = fd.get('status') as string
  const status: VideoStatus = ALLOWED_STATUSES.includes(rawStatus as VideoStatus) ? rawStatus as VideoStatus : 'editing'
  const { error } = await supabase.from('videos').upsert({
    scenario_id:  scenarioId,
    file_url:     sanitizeUrl(fd.get('file_url')) || null,
    status,
    duration_sec: sanitizeInt(fd.get('duration_sec'), 0, 99999),
    publish_date: (fd.get('publish_date') as string) || null,
    notes:        sanitizeStr(fd.get('notes'), 2000) || null,
    platform_urls,
    performance,
  }, { onConflict: 'scenario_id' })
  if (error) return { success: false, error: error.message }
  revalidatePath(`/scenarios/${scenarioId}/video`)
  revalidatePath('/videos')
  return { success: true, data: undefined }
}
