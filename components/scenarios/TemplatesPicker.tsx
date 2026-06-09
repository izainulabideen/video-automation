'use client'
import { useState } from 'react'
import { Zap, ChevronDown, ChevronUp } from 'lucide-react'
import { BRAND_TEMPLATES } from '@/lib/brand-templates'

export type ScenarioTemplate = {
  id: string
  name: string
  niche: string
  title: string
  hook: string
  audience: string
  emotion: string
  palette: string
  sceneTypes: string[]
}

/** Convert brand-templates entries to ScenarioTemplate shape (sceneTypes defaults empty) */
function toScenarioTemplate(t: { id: string; label: string; niche: string; title: string; hook: string; audience: string; emotion: string; palette: string }): ScenarioTemplate {
  return { ...t, name: t.label, sceneTypes: [] }
}

const ALL_BRAND_SLUGS = Object.keys(BRAND_TEMPLATES)

function getTemplatesForSlug(slug: string): ScenarioTemplate[] {
  return (BRAND_TEMPLATES[slug] ?? []).map(toScenarioTemplate)
}

interface Props {
  onSelect: (t: ScenarioTemplate) => void
  brandName?: string
  brandNiche?: string
  /** brand slug (e.g. "horror", "finance") — if provided, shows that brand's templates first */
  brandSlug?: string
}

export function TemplatesPicker({ onSelect, brandName, brandNiche, brandSlug }: Props) {
  const [open, setOpen] = useState(false)
  const [activeSlug, setActiveSlug] = useState(brandSlug ?? 'finance')

  const activeTemplates = getTemplatesForSlug(activeSlug)

  return (
    <div className="mb-5">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-[12px] text-brand-400 hover:text-brand-200 transition-colors border border-white/[0.08] hover:border-white/[0.15] rounded-lg px-3.5 py-2">
        <Zap size={13} className="text-accent" />
        Start from a template
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {/* Brand tab bar */}
          <div className="flex flex-wrap gap-1.5">
            {ALL_BRAND_SLUGS.map(slug => (
              <button key={slug} type="button"
                onClick={() => setActiveSlug(slug)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all capitalize ${
                  activeSlug === slug
                    ? 'border-accent/60 bg-accent/15 text-accent font-semibold'
                    : 'border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/20'
                }`}>
                {slug.replace(/-/g, ' ')}
              </button>
            ))}
          </div>

          {/* Templates grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeTemplates.map(t => (
              <TemplateCard key={t.id} t={t} onSelect={onSelect} setOpen={setOpen} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TemplateCard({ t, onSelect, setOpen }: { t: ScenarioTemplate; onSelect: (t: ScenarioTemplate) => void; setOpen: (v: boolean) => void }) {
  return (
    <button onClick={() => { onSelect(t); setOpen(false) }}
      className="text-left p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent/25 transition-all group">
      <div className="flex items-center gap-2 mb-1.5">
        <Zap size={11} className="text-accent shrink-0" />
        <span className="text-[12px] font-semibold text-white group-hover:text-accent transition-colors">{t.name}</span>
      </div>
      <p className="text-[11px] text-brand-500 line-clamp-2 leading-snug">{t.hook}</p>
      <p className="text-[10px] text-brand-600 mt-1.5">{t.niche.replace(/_/g, ' ')}</p>
    </button>
  )
}
