import { LogoutButton } from '@/components/auth/LogoutButton'

export function TopBar() {
  return (
    <header className="bg-white border-b border-brand-300 px-6 py-3 flex items-center justify-end shrink-0">
      <LogoutButton />
    </header>
  )
}
