import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  if (!rateLimit(ip, 60, 60_000)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  const { scenarioId } = await req.json() as { scenarioId: string }
  if (!scenarioId) return NextResponse.json({ ok: false })
  const db = createAdminClient()
  await db.rpc('increment_view_count', { scenario_id_param: scenarioId })
  return NextResponse.json({ ok: true })
}
