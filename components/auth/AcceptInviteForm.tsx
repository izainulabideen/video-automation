'use client'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { acceptInvite } from '@/actions/auth'

type State = { error?: string; success?: boolean }

export function AcceptInviteForm({ token, email }: { token: string; email: string }) {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (_: State, fd: FormData): Promise<State> => {
      fd.set('token', token)
      const confirm  = fd.get('confirm')  as string
      const password = fd.get('password') as string
      if (password !== confirm) return { error: 'Passwords do not match' }
      const result = await acceptInvite(fd)
      return result.success ? { success: true } : { error: result.error }
    },
    {}
  )

  useEffect(() => {
    if (state.success) router.push('/dashboard')
  }, [state.success, router])

  return (
    <form action={action} className="bg-white rounded-lg border border-brand-300 p-6 space-y-4">
      <p className="text-xs text-brand-500">Creating account for <strong className="text-brand-900">{email}</strong></p>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Your Name</label>
        <input name="name" type="text" required autoFocus
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
          placeholder="Full name" />
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Password</label>
        <input name="password" type="password" required minLength={8} autoComplete="new-password"
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
          placeholder="Min 8 characters" />
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Confirm Password</label>
        <input name="confirm" type="password" required minLength={8} autoComplete="new-password"
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
          placeholder="Repeat password" />
      </div>
      {state.error && <p className="text-xs text-danger">{state.error}</p>}
      <button type="submit" disabled={pending}
        className="w-full bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium disabled:opacity-50">
        {pending ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  )
}
