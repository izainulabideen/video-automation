'use client'
import { useActionState } from 'react'
import { inviteUser } from '@/actions/auth'

type State = { error?: string; success?: boolean }

const inputCls = 'w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-brand-500 focus:border-accent/50 focus:bg-white/[0.06] transition-all'
const labelCls = 'block text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-1.5'

export function InviteForm() {
  const [state, action, pending] = useActionState(
    async (_: State, fd: FormData): Promise<State> => {
      const result = await inviteUser(fd)
      return result.success ? { success: true } : { error: result.error }
    },
    {}
  )

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className={labelCls}>Email</label>
        <input name="email" type="email" required
          className={inputCls}
          placeholder="colleague@example.com" />
      </div>
      <div>
        <label className={labelCls}>Role</label>
        <select name="role" className={inputCls}>
          <option value="member" className="bg-[#111827]">Member</option>
          <option value="admin" className="bg-[#111827]">Admin</option>
        </select>
      </div>
      {state.error && (
        <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">{state.error}</p>
      )}
      {state.success && (
        <p className="text-xs text-success bg-success/10 border border-success/20 rounded-lg px-3 py-2">Invite sent successfully.</p>
      )}
      <button type="submit" disabled={pending}
        className="bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all shadow-lg shadow-accent/20">
        {pending ? 'Sending…' : 'Send Invite'}
      </button>
    </form>
  )
}
