import { getPresignedUploadUrl } from '@/lib/supabase/storage'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { fileName, fileType, scenarioId } = await request.json() as {
    fileName: string; fileType: string; scenarioId: string
  }
  const ext = fileName.split('.').pop()
  const path = `${scenarioId}/${Date.now()}.${ext}`
  const result = await getPresignedUploadUrl('graphics', path)
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json(result)
}
