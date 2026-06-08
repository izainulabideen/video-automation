'use client'
import { useActionState } from 'react'
import { useState } from 'react'
import { signIn, requestPasswordReset } from '@/actions/auth'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

type State = { error?: string; sent?: boolean }

const inputCls = 'w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-3 text-sm text-white placeholder-brand-400 focus:border-accent/50 focus:bg-white/[0.06] transition-all'
const labelCls = 'block text-[11px] font-semibold text-brand-300 uppercase tracking-wider mb-1.5'

export function LoginForm() {
  const [forgotMode, setForgotMode] = useState(false)
  const [showPw, setShowPw] = useState(false)

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
      <div className="bg-surface-2 rounded-xl border border-white/[0.07] p-6 text-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto">
          <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Check your inbox</p>
          <p className="text-xs text-brand-400 mt-1">A reset link has been sent if that email exists.</p>
        </div>
        <button onClick={() => setForgotMode(false)} className="text-xs text-accent hover:text-accent-2 transition-colors">
          ← Back to sign in
        </button>
      </div>
    ) : (
      <form action={resetAction} className="space-y-5">
        <div>
          <label className={labelCls}>Email Address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
            <input name="email" type="email" required autoFocus
              className={`${inputCls} pl-10`}
              placeholder="you@example.com" />
          </div>
        </div>
        {resetState.error && (
          <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">{resetState.error}</p>
        )}
        <button type="submit" disabled={resetPending}
          className="w-full bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-4 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-accent/20">
          {resetPending ? 'Sending…' : 'Send Reset Link'}
        </button>
        <button type="button" onClick={() => setForgotMode(false)} className="w-full text-xs text-brand-400 hover:text-brand-200 transition-colors">
          ← Back to sign in
        </button>
      </form>
    )
  }

  return (
    <form action={loginAction} className="space-y-5">
      <div>
        <label className={labelCls}>Email Address</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
          <input name="email" type="email" required autoFocus autoComplete="email"
            className={`${inputCls} pl-10`}
            placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label className={labelCls}>Password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
          <input name="password" type={showPw ? 'text' : 'password'} required autoComplete="current-password"
            className={`${inputCls} pl-10 pr-10`}
            placeholder="••••••••" />
          <button type="button" onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-200 transition-colors">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>
      {loginState.error && (
        <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">{loginState.error}</p>
      )}
      <button type="submit" disabled={loginPending}
        className="w-full bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-4 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-accent/20 mt-2">
        {loginPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Signing in…
          </span>
        ) : 'Sign In'}
      </button>
      <button type="button" onClick={() => setForgotMode(true)}
        className="w-full text-xs text-brand-400 hover:text-brand-200 transition-colors pt-1">
        Forgot your password?
      </button>
    </form>
  )
}
