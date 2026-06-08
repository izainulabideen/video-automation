'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrand, updateBrand } from '@/actions/brands'
import { BRAND_PRESETS } from '@/lib/brand-presets'
import type { Brand, BrandTheme } from '@/types/brand'
import { Plus, Trash2, Wand2 } from 'lucide-react'

const inputCls = 'w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-brand-500 focus:border-accent/50 focus:bg-white/[0.06] transition-all outline-none'
const labelCls = 'block text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-1.5'

type NicheEntry = { key: string; label: string }

interface Props {
  brand?: Brand
}

export function BrandForm({ brand }: Props) {
  const router = useRouter()
  const existing = brand?.theme_config

  const [name,        setName]        = useState(brand?.name        ?? '')
  const [slug,        setSlug]        = useState(brand?.slug        ?? '')
  const [description, setDescription] = useState(brand?.description ?? '')
  const [accent,      setAccent]      = useState(existing?.accent     ?? '#C8922A')
  const [accentH,     setAccentH]     = useState(existing?.accentH    ?? '#E8B84B')
  const [accentDim,   setAccentDim]   = useState(existing?.accentDim  ?? '#92400e')
  const [bg,          setBg]          = useState(existing?.bg         ?? '#06080F')
  const [surface,     setSurface]     = useState(existing?.surface    ?? '#0D1117')
  const [mood,        setMood]        = useState<BrandTheme['mood']>(existing?.mood ?? 'dark')
  const [heroStyle,   setHeroStyle]   = useState<BrandTheme['heroStyle']>(existing?.heroStyle ?? 'cinematic')
  const [fontWeight,  setFontWeight]  = useState<BrandTheme['fontWeight']>(existing?.fontWeight ?? 'black')
  const [tagline,     setTagline]     = useState(existing?.tagline    ?? '')
  const [aiTone,      setAiTone]      = useState(existing?.aiTone     ?? '')
  const [niches, setNiches] = useState<NicheEntry[]>(
    existing?.niches?.map(k => ({ key: k, label: existing.nicheLabels?.[k] ?? k })) ?? []
  )
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  function applyPreset(presetName: string) {
    const p = BRAND_PRESETS.find(b => b.name === presetName)
    if (!p) return
    if (!brand) { setName(p.name); setSlug(p.slug); setDescription(p.description) }
    setAccent(p.accent); setAccentH(p.accentH); setAccentDim(p.accentDim)
    setBg(p.bg); setSurface(p.surface); setMood(p.mood)
    setHeroStyle(p.heroStyle); setFontWeight(p.fontWeight)
    setTagline(p.tagline); setAiTone(p.aiTone)
    setNiches(p.niches.map(k => ({ key: k, label: p.nicheLabels[k] ?? k })))
  }

  function addNiche() { setNiches(prev => [...prev, { key: '', label: '' }]) }
  function removeNiche(i: number) { setNiches(prev => prev.filter((_, idx) => idx !== i)) }
  function updateNiche(i: number, field: 'key' | 'label', val: string) {
    setNiches(prev => prev.map((n, idx) => idx === i ? { ...n, [field]: val } : n))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const fd = new FormData()
    fd.set('name',        name)
    fd.set('slug',        slug)
    fd.set('description', description)
    fd.set('accent',      accent)
    fd.set('accentH',     accentH)
    fd.set('accentDim',   accentDim)
    fd.set('bg',          bg)
    fd.set('surface',     surface)
    fd.set('border',      `rgba(${hexToRgb(accent)},0.15)`)
    fd.set('mood',        mood)
    fd.set('heroStyle',   heroStyle)
    fd.set('fontWeight',  fontWeight)
    fd.set('tagline',     tagline)
    fd.set('aiTone',      aiTone)
    const validNiches = niches.filter(n => n.key.trim())
    fd.set('niches',      JSON.stringify(validNiches.map(n => n.key.trim())))
    fd.set('nicheLabels', JSON.stringify(Object.fromEntries(validNiches.map(n => [n.key.trim(), n.label.trim() || n.key.trim()]))))

    const result = brand
      ? await updateBrand(brand.id, fd)
      : await createBrand(fd)

    setSaving(false)
    if (!result.success) { setError(result.error ?? 'Error'); return }
    router.push('/settings/brands')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

      {/* Preset picker */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-4">
        <p className={labelCls}>Start from a preset</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {BRAND_PRESETS.map(p => (
            <button key={p.slug} type="button" onClick={() => applyPreset(p.name)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-[12px] text-brand-300 hover:border-white/20 hover:text-white transition-all"
              style={{ borderColor: p.accent + '40' }}>
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.accent }} />
              {p.name}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-brand-600 mt-2 flex items-center gap-1"><Wand2 size={10} /> Applying a preset fills all fields below — you can customise after.</p>
      </div>

      {/* Identity */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Identity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Brand Name</label>
            <input value={name} onChange={e => { setName(e.target.value); if (!brand) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) }}
              required placeholder="e.g. Horror" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Slug (URL-safe)</label>
            <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              required placeholder="e.g. horror" className={inputCls} disabled={!!brand} />
            {brand && <p className="text-[11px] text-brand-600 mt-1">Slug cannot be changed after creation.</p>}
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)}
              placeholder="One line about this brand" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Tagline (shown on /watch)</label>
            <input value={tagline} onChange={e => setTagline(e.target.value)}
              placeholder="e.g. Horror · Dark Stories" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>AI Tone</label>
            <input value={aiTone} onChange={e => setAiTone(e.target.value)}
              placeholder="e.g. suspenseful, dread-inducing, visceral" className={inputCls} />
            <p className="text-[11px] text-brand-600 mt-1">Used in AI script/prompt generation prompts.</p>
          </div>
        </div>
      </div>

      {/* Theme colors */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Theme Colors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {([
            { label: 'Accent',      value: accent,    set: setAccent },
            { label: 'Accent Light', value: accentH,  set: setAccentH },
            { label: 'Accent Dark',  value: accentDim, set: setAccentDim },
            { label: 'Background',   value: bg,        set: setBg },
            { label: 'Surface',      value: surface,   set: setSurface },
          ] as const).map(f => (
            <div key={f.label}>
              <label className={labelCls}>{f.label}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={f.value} onChange={e => (f.set as (v: string) => void)(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-white/[0.09] bg-white/[0.04] cursor-pointer p-0.5" />
                <input type="text" value={f.value} onChange={e => (f.set as (v: string) => void)(e.target.value)}
                  className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded-lg px-2.5 py-2 text-xs text-white font-mono outline-none focus:border-accent/50" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Style options */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Style</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Mood</label>
            <select value={mood} onChange={e => setMood(e.target.value as BrandTheme['mood'])} className={inputCls}>
              <option value="dark"       className="bg-[#111827]">Dark</option>
              <option value="ultra-dark" className="bg-[#111827]">Ultra Dark</option>
              <option value="deep"       className="bg-[#111827]">Deep</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Hero Style</label>
            <select value={heroStyle} onChange={e => setHeroStyle(e.target.value as BrandTheme['heroStyle'])} className={inputCls}>
              <option value="cinematic" className="bg-[#111827]">Cinematic</option>
              <option value="horror"    className="bg-[#111827]">Horror</option>
              <option value="minimal"   className="bg-[#111827]">Minimal</option>
              <option value="clinical"  className="bg-[#111827]">Clinical</option>
              <option value="epic"      className="bg-[#111827]">Epic</option>
              <option value="mystical"  className="bg-[#111827]">Mystical</option>
              <option value="tech"      className="bg-[#111827]">Tech</option>
              <option value="warm"      className="bg-[#111827]">Warm</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Headline Weight</label>
            <select value={fontWeight} onChange={e => setFontWeight(e.target.value as BrandTheme['fontWeight'])} className={inputCls}>
              <option value="bold"      className="bg-[#111827]">Bold</option>
              <option value="extrabold" className="bg-[#111827]">Extra Bold</option>
              <option value="black"     className="bg-[#111827]">Black (heaviest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Preview</h3>
        <div className="rounded-2xl overflow-hidden border border-white/[0.08]"
          style={{ background: bg }}>
          <div className="px-8 py-10 text-center"
            style={{ background: `linear-gradient(135deg, ${bg} 0%, ${surface} 100%)` }}>
            <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: accent + '99' }}>
              {tagline || name}
            </p>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: fontWeight === 'black' ? 900 : fontWeight === 'extrabold' ? 800 : 700,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              background: `linear-gradient(135deg, ${accentH} 0%, ${accent} 50%, ${accentDim} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {name || 'Brand Name'}
            </h2>
            <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {description || 'Brand description goes here'}
            </p>
          </div>
          <div className="px-8 py-4 flex items-center justify-between" style={{ background: surface, borderTop: `1px solid ${accent}20` }}>
            <span className="text-[11px]" style={{ color: accent + '80' }}>{tagline || 'Tagline · Here'}</span>
            <div className="flex gap-2">
              {niches.slice(0, 3).map(n => (
                <span key={n.key} className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: accent + '15', color: accentH, border: `1px solid ${accent}30` }}>
                  {n.label || n.key}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Niches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Niches / Sub-categories</h3>
          <button type="button" onClick={addNiche}
            className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-2 transition-colors">
            <Plus size={13} /> Add niche
          </button>
        </div>
        <div className="space-y-2">
          {niches.map((n, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={n.key} onChange={e => updateNiche(i, 'key', e.target.value)}
                placeholder="key (no spaces, e.g. serial_killers)"
                className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-brand-600 outline-none focus:border-accent/50" />
              <input value={n.label} onChange={e => updateNiche(i, 'label', e.target.value)}
                placeholder="Display label (e.g. Serial Killers)"
                className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-xs text-white placeholder-brand-600 outline-none focus:border-accent/50" />
              <button type="button" onClick={() => removeNiche(i)}
                className="p-2 rounded-lg hover:bg-danger/10 text-brand-600 hover:text-danger transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {niches.length === 0 && (
            <p className="text-[12px] text-brand-600 py-2">No niches yet. Add at least one.</p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all shadow-lg shadow-accent/20">
          {saving ? 'Saving…' : brand ? 'Save Changes' : 'Create Brand'}
        </button>
        <button type="button" onClick={() => router.push('/settings/brands')}
          className="border border-white/[0.09] rounded-lg px-5 py-2.5 text-sm text-brand-300 hover:bg-white/[0.04] transition-all">
          Cancel
        </button>
      </div>
    </form>
  )
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
