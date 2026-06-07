'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForgot, setShowForgot] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)
    if (error) setError(error.message)
    else setShowForgot(false)
  }

  if (showForgot) {
    return (
      <form onSubmit={handleForgotPassword} className="bg-white rounded-lg border border-brand-300 p-6 space-y-4">
        <div>
          <p className="text-sm font-medium text-brand-900 mb-1">Reset your password</p>
          <p className="text-xs text-brand-500">Enter your email and we'll send a reset link.</p>
        </div>
        <div>
          <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
            placeholder="you@example.com"
          />
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
        <button
          type="button"
          onClick={() => { setShowForgot(false); setError(null) }}
          className="w-full text-xs text-brand-500 hover:text-brand-700"
        >
          Back to sign in
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSignIn} className="bg-white rounded-lg border border-brand-300 p-6 space-y-4">
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
          placeholder="••••••••"
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
      <button
        type="button"
        onClick={() => { setShowForgot(true); setError(null) }}
        className="w-full text-xs text-brand-500 hover:text-brand-700"
      >
        Forgot password?
      </button>
    </form>
  )
}
