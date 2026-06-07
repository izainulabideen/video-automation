'use server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { setSession, clearSession, getSession } from '@/lib/session'
import { sendPasswordResetEmail, sendInviteEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import type { ActionResult } from '@/types/app'
import type { AppTables } from '@/types/app-tables'

type UserRow    = AppTables['users']['Row']
type ResetRow   = AppTables['password_reset_tokens']['Row']
type InviteRow  = AppTables['invite_tokens']['Row']

export async function signIn(fd: FormData): Promise<{ error: string } | never> {
  const email    = (fd.get('email')    as string)?.trim().toLowerCase()
  const password = fd.get('password') as string
  if (!email || !password) return { error: 'Email and password are required' }

  const db = createAdminClient()
  const { data: user } = await db
    .from('users')
    .select('id, name, email, role, password_hash, is_active')
    .eq('email', email)
    .single() as { data: Pick<UserRow, 'id' | 'name' | 'email' | 'role' | 'password_hash' | 'is_active'> | null }

  if (!user || !user.is_active) return { error: 'Invalid email or password' }
  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return { error: 'Invalid email or password' }

  await setSession({ userId: user.id, email: user.email, name: user.name, role: user.role })
  redirect('/dashboard')
}

export async function signOut() {
  await clearSession()
  redirect('/login')
}

export async function requestPasswordReset(fd: FormData): Promise<ActionResult> {
  const email = (fd.get('email') as string)?.trim().toLowerCase()
  if (!email) return { success: false, error: 'Email is required' }

  const db = createAdminClient()
  const { data: user } = await db
    .from('users')
    .select('id')
    .eq('email', email)
    .single() as { data: Pick<UserRow, 'id'> | null }
  if (!user) return { success: true, data: undefined }

  const token     = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()

  await db.from('password_reset_tokens').insert({ user_id: user.id, token_hash: tokenHash, expires_at: expiresAt })
  await sendPasswordResetEmail(email, token)
  return { success: true, data: undefined }
}

export async function resetPassword(fd: FormData): Promise<ActionResult> {
  const token    = fd.get('token')    as string
  const password = fd.get('password') as string
  if (!token || !password) return { success: false, error: 'Missing required fields' }
  if (password.length < 8) return { success: false, error: 'Password must be at least 8 characters' }

  const db        = createAdminClient()
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const { data: reset } = await db
    .from('password_reset_tokens')
    .select('id, user_id, expires_at, used_at')
    .eq('token_hash', tokenHash)
    .single() as { data: Pick<ResetRow, 'id' | 'user_id' | 'expires_at' | 'used_at'> | null }

  if (!reset || reset.used_at || new Date(reset.expires_at) < new Date()) {
    return { success: false, error: 'Reset link is invalid or has expired' }
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await db.from('users').update({ password_hash: passwordHash }).eq('id', reset.user_id)
  await db.from('password_reset_tokens').update({ used_at: new Date().toISOString() }).eq('id', reset.id)
  return { success: true, data: undefined }
}

export async function inviteUser(fd: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { success: false, error: 'Unauthorized' }

  const email = (fd.get('email') as string)?.trim().toLowerCase()
  const role  = (fd.get('role')  as string) || 'member'
  if (!email) return { success: false, error: 'Email is required' }

  const db = createAdminClient()
  const { data: existing } = await db
    .from('users')
    .select('id')
    .eq('email', email)
    .single() as { data: Pick<UserRow, 'id'> | null }
  if (existing) return { success: false, error: 'A user with this email already exists' }

  const token     = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

  await db.from('invite_tokens').insert({
    email, role, token_hash: tokenHash, invited_by: session.userId, expires_at: expiresAt,
  })
  await sendInviteEmail(email, token, session.name)
  return { success: true, data: undefined }
}

export async function acceptInvite(fd: FormData): Promise<ActionResult> {
  const token    = fd.get('token')    as string
  const name     = fd.get('name')     as string
  const password = fd.get('password') as string
  if (!token || !name || !password) return { success: false, error: 'All fields are required' }
  if (password.length < 8) return { success: false, error: 'Password must be at least 8 characters' }

  const db        = createAdminClient()
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const { data: invite } = await db
    .from('invite_tokens')
    .select('id, email, role, expires_at, accepted_at')
    .eq('token_hash', tokenHash)
    .single() as { data: Pick<InviteRow, 'id' | 'email' | 'role' | 'expires_at' | 'accepted_at'> | null }

  if (!invite || invite.accepted_at || new Date(invite.expires_at) < new Date()) {
    return { success: false, error: 'Invite link is invalid or has expired' }
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const { data: user, error } = await db
    .from('users')
    .insert({ name: name.trim(), email: invite.email, role: invite.role, password_hash: passwordHash })
    .select('id, name, email, role')
    .single() as { data: Pick<UserRow, 'id' | 'name' | 'email' | 'role'> | null; error: unknown }

  if (error || !user) return { success: false, error: 'Failed to create account' }
  await db.from('invite_tokens').update({ accepted_at: new Date().toISOString() }).eq('id', invite.id)
  await setSession({ userId: user.id, email: user.email, name: user.name, role: user.role })
  return { success: true, data: undefined }
}
