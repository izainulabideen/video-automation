import { LogoutButton } from '@/components/auth/LogoutButton'
import { getSession } from '@/lib/session'
import { MobileNav } from '@/components/layout/MobileNav'
import { CommandPalette } from '@/components/layout/CommandPalette'

export async function TopBar() {
  const session = await getSession()
  const initials = session?.name
    ? session.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'
  const roleLabel = session?.role === 'admin' ? 'Admin' : session?.role === 'editor' ? 'Editor' : 'Viewer'

  return (
    <header className="bg-[#0A0E18] border-b border-white/[0.06] px-4 sm:px-5 h-14 flex items-center gap-3 shrink-0">
      {/* Mobile: hamburger + logo */}
      <div className="md:hidden flex items-center gap-2.5 shrink-0">
        <MobileNav />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-accent-h flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <span className="text-[13px] font-bold text-white">Veank</span>
        </div>
      </div>

      {/* Search — fills remaining space */}
      <div className="flex-1 flex items-center min-w-0">
        <CommandPalette />
      </div>

      {/* Right side: user + logout */}
      <div className="flex items-center gap-3 shrink-0">
        {session && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-accent">{initials}</span>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[12px] font-medium text-brand-100 leading-none">{session.name}</p>
              <p className="text-[10px] text-brand-400 leading-none mt-0.5">{roleLabel}</p>
            </div>
          </div>
        )}
        <div className="w-px h-5 bg-white/10" />
        <LogoutButton />
      </div>
    </header>
  )
}
