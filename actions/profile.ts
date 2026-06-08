'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSession, setSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'
import bcrypt from 'bcryptjs'

export async function updateProfile(fd: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const name = (fd.get('name') as string)?.trim()
  if (!name) return { success: false, error: 'Name is required' }

  const db = createAdminClient()
  const { error } = await db.from('users').update({ name }).eq('id', session.userId)
  if (error) return { success: false, error: error.message }

  // Re-issue session cookie with updated name
  await setSession({ ...session, name })
  revalidatePath('/')
  return { success: true, data: undefined }
}

export async function updatePassword(fd: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const current  = fd.get('current_password')  as string
  const next     = fd.get('new_password')       as string
  const confirm  = fd.get('confirm_password')   as string

  if (!current || !next || !confirm) return { success: false, error: 'All fields required' }
  if (next !== confirm) return { success: false, error: 'Passwords do not match' }
  if (next.length < 8)  return { success: false, error: 'Password must be at least 8 characters' }

  const db = createAdminClient()
  const { data: user } = await db
    .from('users')
    .select('password_hash')
    .eq('id', session.userId)
    .single()

  if (!user?.password_hash) return { success: false, error: 'User not found' }

  const valid = await bcrypt.compare(current, user.password_hash)
  if (!valid) return { success: false, error: 'Current password is incorrect' }

  const hash = await bcrypt.hash(next, 12)
  const { error } = await db.from('users').update({ password_hash: hash }).eq('id', session.userId)
  if (error) return { success: false, error: error.message }

  return { success: true, data: undefined }
}
