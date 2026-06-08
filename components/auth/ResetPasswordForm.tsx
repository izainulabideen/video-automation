'use client'
import { useActionState } from 'react'
import { resetPassword } from '@/actions/auth'
import Link from 'next/link'

type State = { error?: string; success?: boolean }

const inputCls = 'w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-brand-500 focus:border-accent/50 focus:bg-white/[0.06] transition-all'
const labelCls = 'block text-[11px] font-semibold text-brand-300 uppercase tracking-wider mb-1.5'

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(
    async (_: State, fd: FormData): Promise<State> => {
      fd.set('token', token)
      const confirm  = fd.get('confirmPassword') as string
      const password = fd.get('password') as string
      if (password !== confirm) return { error: 'Passwords do not match' }
      const result = await resetPassword(fd)
      return result.success ? { success: true } : { error: result.error }
    },
    {}
  )

  if (state.success) {
    return (
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.07] p-6 text-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto">
          <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Password updated</p>
          <p className="text-xs text-brand-400 mt-1">Your password has been reset successfully.</p>
        </div>
        <Link href="/login" className="inline-block text-xs text-accent hover:text-accent-2 transition-colors">
          ← Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className={labelCls}>New Password</label>
        <input
          name="password"
          type="password"
          required
          autoFocus
          minLength={8}
          autoComplete="new-password"
          placeholder="Min 8 characters"
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Repeat password"
          className={inputCls}
        />
      </div>
      {state.error && (
        <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-4 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-accent/20"
      >
        {pending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Updating…
          </span>
        ) : 'Set New Password'}
      </button>
    </form>
  )
}
