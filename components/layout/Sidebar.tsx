'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Film, Plus, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/scenarios',     label: 'Scenarios', icon: Film },
  { href: '/scenarios/new', label: 'New',        icon: Plus },
  { href: '/settings/team', label: 'Team',       icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex w-48 flex-col bg-white border-r border-brand-200 py-5 px-2 shrink-0">
      <div className="px-3 mb-5">
        <span className="text-sm font-bold text-brand-900 tracking-tight">Veank Studio</span>
      </div>
      <nav className="flex flex-col gap-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/scenarios'
              ? pathname === '/scenarios' || (pathname.startsWith('/scenarios/') && pathname !== '/scenarios/new')
              : pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                active ? 'bg-accent text-white' : 'text-brand-600 hover:bg-brand-100'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
