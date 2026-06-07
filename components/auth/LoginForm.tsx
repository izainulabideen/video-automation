'use client'
import { useActionState } from 'react'
import { useState } from 'react'
import { signIn, requestPasswordReset } from '@/actions/auth'

type State = { error?: string; sent?: boolean }

export function LoginForm() {
  const [forgotMode, setForgotMode] = useState(false)
  const [loginState, loginAction, loginPending] = useActionState(
    async (_: State, fd: FormData): Promise<State> => {
      const result = await signIn(fd)
      return result ?? {}
    },
    {}
  )
  const [resetState, resetAction, resetPending] = useActionState(
    async (_: State, fd: FormData): Promise<State> => {
      const result = await requestPasswordReset(fd)
      return result.success ? { sent: true } : { error: result.error }
    },
    {}
  )

  if (forgotMode) {
    return resetState.sent ? (
      <div className="bg-white rounded-lg border border-brand-300 p-6 text-center space-y-3">
        <p className="text-sm font-medium text-brand-900">Check your inbox</p>
        <p className="text-xs text-brand-500">A reset link has been sent if that email exists.</p>
        <button onClick={() => setForgotMode(false)} className="text-xs text-accent hover:underline">
          Back to sign in
        </button>
      </div>
    ) : (
      <form action={resetAction} className="bg-white rounded-lg border border-brand-300 p-6 space-y-4">
        <p className="text-sm font-medium text-brand-900">Reset password</p>
        <div>
          <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Email</label>
          <input name="email" type="email" required autoFocus
            className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
            placeholder="you@example.com" />
        </div>
        {resetState.error && <p className="text-xs text-danger">{resetState.error}</p>}
        <button type="submit" disabled={resetPending}
          className="w-full bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium disabled:opacity-50">
          {resetPending ? 'Sending…' : 'Send Reset Link'}
        </button>
        <button type="button" onClick={() => setForgotMode(false)} className="w-full text-xs text-brand-500 hover:text-brand-700">
          Back to sign in
        </button>
      </form>
    )
  }

  return (
    <form action={loginAction} className="bg-white rounded-lg border border-brand-300 p-6 space-y-4">
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Email</label>
        <input name="email" type="email" required autoFocus autoComplete="email"
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
          placeholder="you@example.com" />
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Password</label>
        <input name="password" type="password" required autoComplete="current-password"
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
          placeholder="••••••••" />
      </div>
      {loginState.error && <p className="text-xs text-danger">{loginState.error}</p>}
      <button type="submit" disabled={loginPending}
        className="w-full bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium disabled:opacity-50">
        {loginPending ? 'Signing in…' : 'Sign In'}
      </button>
      <button type="button" onClick={() => setForgotMode(true)} className="w-full text-xs text-brand-500 hover:text-brand-700">
        Forgot password?
      </button>
    </form>
  )
}
