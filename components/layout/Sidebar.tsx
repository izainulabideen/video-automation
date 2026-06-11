'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clapperboard, PlusCircle, Users, ExternalLink, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/scenarios',     label: 'Scenarios', icon: Clapperboard },
  { href: '/scenarios/new', label: 'New Story',  icon: PlusCircle },
  { href: '/settings/team', label: 'Team',        icon: Users },
  { href: '/docs',          label: 'Docs',         icon: BookOpen },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex w-56 flex-col shrink-0 border-r border-white/[0.06] bg-[#0A0E18]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent-h flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5L7 2L12 3.5V7C12 9.8 9.8 12.3 7 13C4.2 12.3 2 9.8 2 7V3.5Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-bold text-white tracking-tight leading-none">Veank</p>
            <p className="text-[10px] text-brand-300 tracking-widest uppercase leading-none mt-0.5">Studio</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 pt-4 flex-1">
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
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150',
                active
                  ? 'bg-accent/15 text-accent border border-accent/20'
                  : 'text-brand-300 hover:bg-white/[0.04] hover:text-brand-100'
              )}
            >
              <Icon size={14} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Public link */}
      <div className="px-3 pb-5 border-t border-white/[0.06] pt-4">
        <Link
          href="/watch"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-brand-400 hover:text-brand-200 hover:bg-white/[0.04] transition-all"
        >
          <ExternalLink size={13} />
          Public Page
        </Link>
      </div>
    </aside>
  )
}
