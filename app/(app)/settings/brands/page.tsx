import { getBrands } from '@/actions/brands'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BrandToggle } from '@/components/settings/BrandToggle'
import { Plus } from 'lucide-react'

export const revalidate = 0

export default async function BrandsPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'admin') redirect('/dashboard')
  const brands = await getBrands()
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white">Brands</h1>
          <p className="text-xs text-brand-400 mt-0.5">Manage channels and their visual identity</p>
        </div>
        <Link href="/settings/brands/new" className="flex items-center gap-2 bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-all">
          <Plus size={14} /> New Brand
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {brands.map(b => (
          <div key={b.id} className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: b.theme_config.surface }}>
            <div className="h-2" style={{ background: `linear-gradient(90deg, ${b.theme_config.accent}, ${b.theme_config.accentH})` }} />
            <div className="p-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm">{b.name}</h3>
                <p className="text-xs text-brand-500 mt-0.5">{b.description}</p>
                <p className="text-[10px] mt-2 font-mono" style={{ color: b.theme_config.accent }}>{b.theme_config.heroStyle} · {b.theme_config.mood}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <BrandToggle id={b.id} initial={b.is_active} />
                <Link href={`/settings/brands/${b.id}`} className="text-xs text-brand-400 hover:text-white transition-colors px-2 py-1 rounded border border-white/[0.08] hover:border-white/[0.2]">Edit</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
