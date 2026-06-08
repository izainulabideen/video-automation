import { getBrands } from '@/actions/brands'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { BrandToggle } from '@/components/settings/BrandToggle'

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
          <p className="text-xs text-brand-400 mt-0.5">{brands.length} brand{brands.length !== 1 ? 's' : ''} · each is an independent content channel</p>
        </div>
        <Link href="/settings/brands/new"
          className="flex items-center gap-2 bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20">
          <Plus size={14} />
          New Brand
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brands.map(brand => {
          const t = brand.theme_config
          return (
            <div key={brand.id}
              className="rounded-2xl border overflow-hidden transition-all hover:border-white/20"
              style={{ borderColor: t.accent + '30', background: t.bg }}>

              {/* Color bar */}
              <div className="h-1 w-full" style={{
                background: `linear-gradient(90deg, ${t.accentDim}, ${t.accent}, ${t.accentH})`
              }} />

              {/* Card body */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.accent }} />
                      <h3 className="text-base font-bold text-white">{brand.name}</h3>
                      <span className="text-[10px] font-mono text-brand-600 bg-white/[0.04] px-1.5 py-0.5 rounded">/{brand.slug}</span>
                    </div>
                    <p className="text-xs text-brand-500">{brand.description}</p>
                  </div>
                  <BrandToggle brandId={brand.id} isActive={brand.is_active} />
                </div>

                {/* Niches */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(t.niches ?? []).slice(0, 5).map(n => (
                    <span key={n} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: t.accent + '15', color: t.accentH, border: `1px solid ${t.accent}30` }}>
                      {t.nicheLabels?.[n] ?? n}
                    </span>
                  ))}
                  {(t.niches ?? []).length > 5 && (
                    <span className="text-[10px] text-brand-600">+{(t.niches ?? []).length - 5} more</span>
                  )}
                </div>

                {/* Meta row */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                  <div className="flex items-center gap-3 text-[11px] text-brand-600">
                    <span className="capitalize">{t.mood}</span>
                    <span>·</span>
                    <span className="capitalize">{t.heroStyle}</span>
                  </div>
                  <Link href={`/settings/brands/${brand.id}`}
                    className="flex items-center gap-1.5 text-[12px] text-brand-400 hover:text-white border border-white/[0.08] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all">
                    <Pencil size={11} />
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {brands.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-brand-400 text-sm font-medium mb-2">No brands yet</p>
          <p className="text-brand-600 text-xs mb-6">Create your first brand to start organising content by channel</p>
          <Link href="/settings/brands/new" className="text-xs text-accent hover:underline">Create a brand →</Link>
        </div>
      )}
    </div>
  )
}
