import { AcceptInviteForm } from '@/components/auth/AcceptInviteForm'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

interface Props { searchParams: Promise<{ token?: string }> }

export default async function AcceptInvitePage({ searchParams }: Props) {
  const { token } = await searchParams
  if (!token) redirect('/login')

  const db        = createAdminClient()
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const { data: invite } = await db
    .from('invite_tokens')
    .select('email, expires_at, accepted_at')
    .eq('token_hash', tokenHash)
    .single()

  if (!invite || invite.accepted_at || new Date(invite.expires_at) < new Date()) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-brand-900 tracking-tight">Veank Studio</h1>
          <p className="text-sm text-brand-500 mt-1">You've been invited — set up your account</p>
        </div>
        <AcceptInviteForm token={token} email={invite.email} />
      </div>
    </main>
  )
}
