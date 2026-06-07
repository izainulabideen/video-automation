import { LogoutButton } from '@/components/auth/LogoutButton'
import { getSession } from '@/lib/session'

export async function TopBar() {
  const session = await getSession()
  return (
    <header className="bg-white border-b border-brand-300 px-6 py-3 flex items-center justify-end shrink-0">
      <div className="flex items-center gap-3">
        {session && (
          <span className="text-xs text-brand-500">
            {session.name}
            <span className="ml-1 capitalize text-brand-300">· {session.role}</span>
          </span>
        )}
        <LogoutButton />
      </div>
    </header>
  )
}
