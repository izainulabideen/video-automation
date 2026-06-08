import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })

  const fd = await req.formData()
  const default_niche = (fd.get('default_niche') as string) || null
  const timezone      = (fd.get('timezone') as string) || 'UTC'

  const db = createAdminClient()
  const { error } = await db
    .from('users')
    .update({ default_niche, timezone } as never)
    .eq('id', session.userId)

  if (error) return NextResponse.json({ success: false, error: error.message })
  return NextResponse.json({ success: true })
}
