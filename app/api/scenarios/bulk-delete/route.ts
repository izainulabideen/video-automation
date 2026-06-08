import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const { ids } = await req.json() as { ids: string[] }
  if (!ids?.length) return NextResponse.json({ error: 'No ids' }, { status: 400 })
  const db = createAdminClient()
  const { error } = await db.from('scenarios').delete().in('id', ids)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath('/scenarios')
  revalidatePath('/dashboard')
  return NextResponse.json({ ok: true })
}
