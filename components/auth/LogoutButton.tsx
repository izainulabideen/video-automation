'use client'
import { signOut } from '@/actions/auth'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="flex items-center gap-1.5 text-[11px] text-brand-400 hover:text-brand-100 border border-white/[0.08] rounded-md px-2.5 py-1.5 hover:border-white/[0.15] transition-all"
      >
        <LogOut size={12} />
        Sign out
      </button>
    </form>
  )
}
