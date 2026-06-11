import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { rateLimit } from '@/lib/rate-limit'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/session'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  if (!rateLimit(ip, 10, 60_000)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  const sessionToken = req.cookies.get(SESSION_COOKIE)?.value
  const session = sessionToken ? await verifySessionToken(sessionToken) : null
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { ids } = await req.json() as { ids: string[] }
  if (!ids?.length) return NextResponse.json({ error: 'No ids' }, { status: 400 })
  const db = createAdminClient()
  const { error } = await db.from('scenarios').delete().in('id', ids)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/scenarios')
  revalidatePath('/dashboard')
  return NextResponse.json({ ok: true })
}
