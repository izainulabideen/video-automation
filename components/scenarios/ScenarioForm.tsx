'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Database } from '@/types/database'
import { TemplatesPicker, type ScenarioTemplate } from '@/components/scenarios/TemplatesPicker'
import { getPalettesForBrand } from '@/lib/brand-palettes'
import type { Brand } from '@/types/brand'

type Scenario = Database['public']['Tables']['scenarios']['Row']

interface ScenarioFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (fd: FormData) => Promise<{ success: boolean; error?: string; data?: any }>
  defaultValues?: Partial<Scenario> & { brand_id?: string }
  submitLabel?: string
  showTemplates?: boolean
  brands?: Brand[]
}

const labelCls = 'block text-[11px] font-semibold text-brand-300 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-brand-500 focus:border-accent/50 focus:bg-white/[0.06] transition-all'

export function ScenarioForm({ action, defaultValues, submitLabel = 'Save', showTemplates = false, brands = [] }: ScenarioFormProps) {
  const router = useRouter()

  const [brandId, setBrandId] = useState(defaultValues?.brand_id ?? brands[0]?.id ?? '')
  const activeBrand = brands.find(b => b.id === brandId)
  const niches = activeBrand?.theme_config?.niches ?? []
  const nicheLabels = activeBrand?.theme_config?.nicheLabels ?? {}
  const palettes = getPalettesForBrand(activeBrand?.slug)

  const [vals, setVals] = useState({
    title:    defaultValues?.title    ?? '',
    hook:     defaultValues?.hook     ?? '',
    niche:    defaultValues?.niche    ?? '',
    audience: defaultValues?.audience ?? '',
    emotion:  defaultValues?.emotion  ?? '',
    palette:  defaultValues?.palette  ?? '',
    notes:    defaultValues?.notes    ?? '',
  })

  function applyTemplate(t: ScenarioTemplate) {
    setVals({ title: t.title, hook: t.hook, niche: t.niche, audience: t.audience, emotion: t.emotion, palette: t.palette, notes: '' })
  }

  async function handleSubmit(fd: FormData) {
    const result = await action(fd)
    if (result.success && result.data?.id) router.push(`/scenarios/${result.data.id}`)
    else if (result.success) router.push('/scenarios')
  }

  return (
    <form action={handleSubmit} className="space-y-5 max-w-2xl">
      {showTemplates && (
        <TemplatesPicker
          onSelect={applyTemplate}
          brandName={activeBrand?.name}
          brandNiche={activeBrand?.theme_config?.niches?.[0]}
          brandSlug={activeBrand?.slug}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Brand picker */}
        {brands.length > 0 && (
          <div className="sm:col-span-2">
            <label className={labelCls}>Brand / Channel</label>
            <div className="flex flex-wrap gap-2">
              {brands.map(b => (
                <button key={b.id} type="button"
                  onClick={() => { setBrandId(b.id); setVals(v => ({ ...v, niche: '' })) }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all"
                  style={{
                    borderColor: brandId === b.id ? b.theme_config.accent : 'rgba(255,255,255,0.09)',
                    background:  brandId === b.id ? b.theme_config.accent + '15' : 'rgba(255,255,255,0.04)',
                    color:       brandId === b.id ? b.theme_config.accentH : 'rgba(255,255,255,0.5)',
                  }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: b.theme_config.accent }} />
                  {b.name}
                </button>
              ))}
            </div>
            <input type="hidden" name="brand_id" value={brandId} />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className={labelCls}>Title</label>
          <input name="title" required value={vals.title} onChange={e => setVals(v => ({...v, title: e.target.value}))}
            placeholder="e.g. The Hidden Tax Trap Most Earners Miss"
            className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Hook</label>
          <input name="hook" required value={vals.hook} onChange={e => setVals(v => ({...v, hook: e.target.value}))}
            placeholder="One compelling sentence to hook the viewer"
            className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Niche</label>
          <select name="niche" required value={vals.niche} onChange={e => setVals(v => ({...v, niche: e.target.value}))}
            className={inputCls}>
            <option value="" disabled className="bg-[#111827]">Select niche</option>
            {niches.map(n => (
              <option key={n} value={n} className="bg-[#111827]">{nicheLabels[n] ?? n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Palette</label>
          <select name="palette" value={vals.palette} onChange={e => setVals(v => ({...v, palette: e.target.value}))}
            className={inputCls}>
            <option value="" className="bg-[#111827]">Select palette</option>
            {palettes.map(p => (
              <option key={p.value} value={p.value} className="bg-[#111827]">{p.label} — {p.use}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Target Audience</label>
          <input name="audience" value={vals.audience} onChange={e => setVals(v => ({...v, audience: e.target.value}))}
            placeholder="e.g. 25-40 yr earners"
            className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Emotion</label>
          <input name="emotion" value={vals.emotion} onChange={e => setVals(v => ({...v, emotion: e.target.value}))}
            placeholder="e.g. Urgency, fear of missing out"
            className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Notes</label>
        <textarea name="notes" rows={3} value={vals.notes} onChange={e => setVals(v => ({...v, notes: e.target.value}))}
          placeholder="Internal production notes…"
          className={`${inputCls} resize-none`} />
      </div>

      <div className="pt-1">
        <button type="submit"
          className="bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
