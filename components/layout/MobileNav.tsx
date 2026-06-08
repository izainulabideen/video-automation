'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Clapperboard, PlusCircle, Users, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/scenarios',     label: 'Scenarios', icon: Clapperboard },
  { href: '/scenarios/new', label: 'New Story',  icon: PlusCircle },
  { href: '/settings/team', label: 'Team',        icon: Users },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Hamburger trigger — rendered inline wherever this component is placed */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="md:hidden w-8 h-8 rounded-full bg-[#0A0E18] border border-white/[0.06] flex items-center justify-center text-brand-300 hover:text-white transition-colors"
      >
        <Menu size={16} />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 flex flex-col bg-[#0A0E18] border-r border-white/[0.06] transition-transform duration-300 ease-in-out md:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer header */}
        <div className="px-5 pt-6 pb-5 border-b border-white/[0.06] flex items-center justify-between">
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
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="w-7 h-7 rounded-full flex items-center justify-center text-brand-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav items */}
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
                onClick={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-brand-400 hover:text-brand-200 hover:bg-white/[0.04] transition-all"
          >
            <ExternalLink size={13} />
            Public Page
          </Link>
        </div>
      </aside>
    </>
  )
}
