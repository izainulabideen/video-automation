import { getPresignedUploadUrl } from '@/lib/supabase/storage'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  if (!rateLimit(ip, 10, 60_000)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  const { fileName, fileType, scenarioId } = await request.json() as {
    fileName: string; fileType: string; scenarioId: string
  }
  const ext = fileName.split('.').pop()
  const path = `${scenarioId}/${Date.now()}.${ext}`
  const result = await getPresignedUploadUrl('videos', path)
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json(result)
}
