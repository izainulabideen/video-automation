'use client'
import { useActionState } from 'react'
import { inviteUser } from '@/actions/auth'

type State = { error?: string; success?: boolean }

export function InviteForm() {
  const [state, action, pending] = useActionState(
    async (_: State, fd: FormData): Promise<State> => {
      const result = await inviteUser(fd)
      return result.success ? { success: true } : { error: result.error }
    },
    {}
  )

  return (
    <form action={action} className="bg-white rounded-lg border border-brand-300 p-5 space-y-4">
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Email</label>
        <input name="email" type="email" required
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
          placeholder="colleague@example.com" />
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Role</label>
        <select name="role"
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none">
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {state.error   && <p className="text-xs text-danger">{state.error}</p>}
      {state.success && <p className="text-xs text-success">Invite sent successfully.</p>}
      <button type="submit" disabled={pending}
        className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium disabled:opacity-50">
        {pending ? 'Sending…' : 'Send Invite'}
      </button>
    </form>
  )
}
