import { getPresignedUploadUrl } from '@/lib/supabase/storage'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/session'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  if (!rateLimit(ip, 20, 60_000)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value
  const session = sessionToken ? await verifySessionToken(sessionToken) : null
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { fileName, fileType, scenarioId } = await request.json() as {
    fileName: string; fileType: string; scenarioId: string
  }
  const ext = fileName.split('.').pop()
  const path = `${scenarioId}/${Date.now()}.${ext}`
  const result = await getPresignedUploadUrl('storage', path)
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json(result)
}
