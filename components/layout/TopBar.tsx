import { createServerClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/auth/LogoutButton'

export async function TopBar() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <header className="bg-white border-b border-brand-300 px-6 py-3 flex items-center justify-end shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xs text-brand-500">{user?.email}</span>
        <LogoutButton />
      </div>
    </header>
  )
}
