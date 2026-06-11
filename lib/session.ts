import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'veank_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface SessionPayload {
  userId: string
  email: string
  name: string
  role: string
  exp?: number
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET env var is not set')
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret.padEnd(32, '0').slice(0, 32)),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const key = await getKey()
  const data = JSON.stringify(payload)
  const encoded = Buffer.from(data).toString('base64url')
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encoded))
  const sigHex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${encoded}.${sigHex}`
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const lastDot = token.lastIndexOf('.')
    if (lastDot === -1) return null
    const encoded = token.slice(0, lastDot)
    const sigHex = token.slice(lastDot + 1)
    const key = await getKey()
    const sigBytes = new Uint8Array(sigHex.match(/.{2}/g)!.map(h => parseInt(h, 16)))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(encoded))
    if (!valid) return null
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as SessionPayload
    if (payload.exp && Date.now() / 1000 > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export async function setSession(payload: SessionPayload) {
  const token = await createSessionToken({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  const payload = await verifySessionToken(token)
  if (!payload) return null
  if (payload.exp && payload.exp - Date.now() / 1000 < 60 * 60 * 24 * 3) {
    await setSession(payload)
  }
  return payload
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
