'use client'
import { signOut } from '@/actions/auth'

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-xs border border-brand-300 rounded-md px-3 py-1.5 hover:bg-brand-100"
      >
        Sign out
      </button>
    </form>
  )
}
