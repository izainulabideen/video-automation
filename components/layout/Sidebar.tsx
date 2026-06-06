'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Film, FileText, Image, Video, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/scenarios',  label: 'Scenarios',  icon: Film },
  { href: '/prompts',    label: 'Prompts',    icon: Wand2 },
  { href: '/scripts',    label: 'Scripts',    icon: FileText },
  { href: '/graphics',   label: 'Graphics',   icon: Image },
  { href: '/videos',     label: 'Videos',     icon: Video },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex w-56 flex-col bg-white border-r border-brand-300 py-6 px-3 shrink-0">
      <div className="px-3 mb-6">
        <span className="text-sm font-semibold text-brand-900">Veank Content OS</span>
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-brand-100 transition-colors',
              pathname.startsWith(href) && href !== '/dashboard'
                ? 'bg-accent/10 text-accent'
                : pathname === href && href === '/dashboard'
                ? 'bg-accent/10 text-accent'
                : 'text-brand-700'
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
