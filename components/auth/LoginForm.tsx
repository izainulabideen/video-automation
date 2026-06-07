'use client'
import { useActionState } from 'react'
import { signIn } from '@/actions/auth'

const initialState = { error: '' }

export function LoginForm() {
  const [state, action, pending] = useActionState(
    async (_prev: typeof initialState, fd: FormData) => {
      const result = await signIn(fd)
      return result ?? initialState
    },
    initialState
  )

  return (
    <form action={action} className="bg-white rounded-lg border border-brand-300 p-6 space-y-4">
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Password</label>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
          placeholder="••••••••"
        />
      </div>
      {state.error && <p className="text-xs text-danger">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium disabled:opacity-50"
      >
        {pending ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}
