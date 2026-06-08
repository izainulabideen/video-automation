import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { scenarioId } = await req.json() as { scenarioId: string }
  if (!scenarioId) return NextResponse.json({ ok: false })
  const db = createAdminClient()
  await db.rpc('increment_view_count', { scenario_id_param: scenarioId })
  return NextResponse.json({ ok: true })
}
