'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }
  return (
    <button
      onClick={handleLogout}
      className="text-xs border border-brand-300 rounded-md px-3 py-1.5 hover:bg-brand-100"
    >
      Sign out
    </button>
  )
}
