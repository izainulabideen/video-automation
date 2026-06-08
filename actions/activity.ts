'use server'
import { createAdminClient } from '@/lib/supabase/admin'

export type ActivityLog = {
  id: string
  scenario_id: string
  user_name: string
  action: string
  details: string | null
  created_at: string
}

export async function logActivity(scenarioId: string, userName: string, action: string, details?: string) {
  const db = createAdminClient()
  await db.from('activity_logs').insert({
    scenario_id: scenarioId,
    user_name:   userName,
    action,
    details:     details ?? null,
  })
}

export async function getActivityLog(scenarioId: string): Promise<ActivityLog[]> {
  const db = createAdminClient()
  const { data } = await db
    .from('activity_logs')
    .select('*')
    .eq('scenario_id', scenarioId)
    .order('created_at', { ascending: false })
    .limit(50)
  return (data ?? []) as ActivityLog[]
}
