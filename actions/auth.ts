'use server'
import { redirect } from 'next/navigation'
import { setSession, clearSession } from '@/lib/session'

export async function signIn(fd: FormData): Promise<{ error: string } | never> {
  const password = fd.get('password') as string
  const appPassword = process.env.APP_PASSWORD

  if (!appPassword) return { error: 'APP_PASSWORD is not configured' }
  if (!password || password !== appPassword) return { error: 'Incorrect password' }

  await setSession()
  redirect('/dashboard')
}

export async function signOut() {
  await clearSession()
  redirect('/login')
}
