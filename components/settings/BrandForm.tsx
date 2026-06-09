'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BRAND_PRESETS } from '@/lib/brand-presets'
import type { Brand, BrandTheme } from '@/types/brand'

interface Props {
  brand?: Brand
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (fd: FormData) => Promise<{ success: boolean; error?: string; data?: any }>
  actionWithId?: (id: string, fd: FormData) => Promise<{ success: boolean; error?: string; data?: any }>
}

const inputCls = 'w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-brand-500 focus:border-accent/50 transition-all'
const labelCls = 'block text-[11px] font-semibold text-brand-300 uppercase tracking-wider mb-1.5'

export function BrandForm({ brand, action, actionWithId }: Props) {
  const router = useRouter()
  const defaultPreset = BRAND_PRESETS.find(p => p.slug === 'finance')!

  const [theme, setTheme] = useState<BrandTheme>(brand?.theme_config ?? {
    accent: defaultPreset.accent, accentH: defaultPreset.accentH, accentDim: defaultPreset.accentDim,
    bg: defaultPreset.bg, surface: defaultPreset.surface, border: defaultPreset.border,
    mood: defaultPreset.mood, heroStyle: defaultPreset.heroStyle, fontWeight: defaultPreset.fontWeight,
    tagline: defaultPreset.tagline, aiTone: defaultPreset.aiTone,
    niches: defaultPreset.niches, nicheLabels: defaultPreset.nicheLabels,
  })
  const [name, setName] = useState(brand?.name ?? '')
  const [slug, setSlug] = useState(brand?.slug ?? '')
  const [desc, setDesc] = useState(brand?.description ?? '')
  const [newNicheKey, setNewNicheKey] = useState('')
  const [newNicheLabel, setNewNicheLabel] = useState('')

  function applyPreset(p: typeof BRAND_PRESETS[0]) {
    setName(p.name); setSlug(p.slug); setDesc(p.description)
    setTheme({ accent: p.accent, accentH: p.accentH, accentDim: p.accentDim, bg: p.bg, surface: p.surface, border: p.border, mood: p.mood, heroStyle: p.heroStyle, fontWeight: p.fontWeight, tagline: p.tagline, aiTone: p.aiTone, niches: p.niches, nicheLabels: p.nicheLabels })
  }

  async function handleSubmit(fd: FormData) {
    fd.set('name', name); fd.set('slug', slug); fd.set('description', desc)
    fd.set('theme_config', JSON.stringify(theme))
    const result = brand && actionWithId ? await actionWithId(brand.id, fd) : await action(fd)
    if (result.success) router.push('/settings/brands')
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Preset picker */}
      <div>
        <label className={labelCls}>Start from a preset</label>
        <div className="flex flex-wrap gap-2">
          {BRAND_PRESETS.map(p => (
            <button key={p.slug} type="button" onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
              style={{ borderColor: p.accent + '40', color: p.accentH, background: p.accent + '12' }}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Brand Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="e.g. Finance" required />
        </div>
        <div>
          <label className={labelCls}>Slug</label>
          <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} className={inputCls} placeholder="e.g. finance" required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Description</label>
          <input value={desc} onChange={e => setDesc(e.target.value)} className={inputCls} placeholder="Short description" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Tagline</label>
          <input value={theme.tagline} onChange={e => setTheme(t => ({ ...t, tagline: e.target.value }))} className={inputCls} placeholder="Finance · Education" />
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className={labelCls}>Colors</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {([['accent','Accent'],['accentH','Accent Hover'],['bg','Background'],['surface','Surface']] as [keyof BrandTheme, string][]).map(([k, label]) => (
            <div key={k}>
              <p className="text-[10px] text-brand-500 mb-1">{label}</p>
              <div className="flex items-center gap-2">
                <input type="color" value={(theme[k] as string).startsWith('#') ? (theme[k] as string).slice(0,7) : '#000000'}
                  onChange={e => setTheme(t => ({ ...t, [k]: e.target.value }))}
                  className="w-8 h-8 rounded cursor-pointer border border-white/10 bg-transparent" />
                <input value={theme[k] as string} onChange={e => setTheme(t => ({ ...t, [k]: e.target.value }))}
                  className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded px-2 py-1.5 text-xs text-white font-mono" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Hero Style</label>
          <select value={theme.heroStyle} onChange={e => setTheme(t => ({ ...t, heroStyle: e.target.value as BrandTheme['heroStyle'] }))} className={inputCls}>
            {['cinematic','horror','minimal','clinical','epic','mystical','tech','warm'].map(s => <option key={s} value={s} className="bg-[#111827]">{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Mood</label>
          <select value={theme.mood} onChange={e => setTheme(t => ({ ...t, mood: e.target.value as BrandTheme['mood'] }))} className={inputCls}>
            {['dark','ultra-dark','deep'].map(s => <option key={s} value={s} className="bg-[#111827]">{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Font Weight</label>
          <select value={theme.fontWeight} onChange={e => setTheme(t => ({ ...t, fontWeight: e.target.value as BrandTheme['fontWeight'] }))} className={inputCls}>
            {['bold','extrabold','black'].map(s => <option key={s} value={s} className="bg-[#111827]">{s}</option>)}
          </select>
        </div>
      </div>

      {/* Niches */}
      <div>
        <label className={labelCls}>Niches</label>
        <div className="space-y-2 mb-3">
          {theme.niches.map(n => (
            <div key={n} className="flex items-center gap-2">
              <span className="text-xs text-white/60 font-mono w-32">{n}</span>
              <span className="text-xs text-white/40">{theme.nicheLabels[n] ?? n}</span>
              <button type="button" onClick={() => setTheme(t => ({ ...t, niches: t.niches.filter(x => x !== n), nicheLabels: Object.fromEntries(Object.entries(t.nicheLabels).filter(([k]) => k !== n)) }))}
                className="ml-auto text-danger/50 hover:text-danger text-xs">remove</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input placeholder="key (e.g. tax)" value={newNicheKey} onChange={e => setNewNicheKey(e.target.value)} className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded px-3 py-2 text-sm text-white" />
          <input placeholder="Label (e.g. Tax Strategy)" value={newNicheLabel} onChange={e => setNewNicheLabel(e.target.value)} className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded px-3 py-2 text-sm text-white" />
          <button type="button" onClick={() => { if (!newNicheKey.trim()) return; setTheme(t => ({ ...t, niches: [...t.niches, newNicheKey.trim()], nicheLabels: { ...t.nicheLabels, [newNicheKey.trim()]: newNicheLabel.trim() || newNicheKey.trim() } })); setNewNicheKey(''); setNewNicheLabel('') }}
            className="px-3 py-2 rounded-lg bg-accent/20 text-accent text-sm hover:bg-accent/30 transition-colors">Add</button>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl overflow-hidden border border-white/[0.07]" style={{ background: theme.bg }}>
        <div className="px-6 py-8 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: theme.accent + '88' }}>{theme.tagline}</p>
          <h2 className="text-4xl font-black mb-2" style={{ color: theme.accentH }}>{name || 'Brand'}</h2>
          <p className="text-xs" style={{ color: theme.accent + '60' }}>{theme.heroStyle} · {theme.mood}</p>
        </div>
      </div>

      <button type="submit" className="bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-all">
        {brand ? 'Save Changes' : 'Create Brand'}
      </button>
    </form>
  )
}
