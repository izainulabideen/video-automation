'use client'
import { useState } from 'react'
import { Zap, ChevronDown, ChevronUp } from 'lucide-react'

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

export const TEMPLATES: ScenarioTemplate[] = [
  {
    id: 'wealth-trap',
    name: 'Wealth Trap Expose',
    niche: 'wealth_secrets',
    title: 'The Hidden Tax Trap Draining Your Savings',
    hook: 'The government is legally taking 40% more from you — and most people have no idea.',
    audience: 'Middle-class earners 30-50',
    emotion: 'Urgency + Fear',
    palette: 'steel_blue',
    sceneTypes: ['warning', 'legal_document', 'money_drain', 'padlock', 'chart', 'vault'],
  },
  {
    id: 'career-secret',
    name: 'Career Money Secret',
    niche: 'career_money',
    title: 'Why High Earners Never Negotiate Their First Offer',
    hook: 'The single sentence that doubled my salary — and my employer was grateful.',
    audience: 'Professionals 25-40',
    emotion: 'Curiosity + Empowerment',
    palette: 'cream_forest',
    sceneTypes: ['building', 'chart', 'flow_diagram', 'money_bag', 'percentage', 'clock'],
  },
  {
    id: 'investment-secret',
    name: 'Investment Insider',
    niche: 'investing',
    title: 'The Index Fund Secret Wall Street Hates',
    hook: 'Hedge funds charge 2% yearly to underperform a fund you can buy for 0.03%.',
    audience: 'Investors 28-45',
    emotion: 'Outrage + Curiosity',
    palette: 'midnight_gold',
    sceneTypes: ['chart', 'money_bag', 'wall_street', 'percentage', 'vault', 'building'],
  },
  {
    id: 'tax-hack',
    name: 'Tax Strategy Hack',
    niche: 'tax_strategy',
    title: 'The Legal Tax Loophole Accountants Forget to Mention',
    hook: 'This one IRS rule could save you $10,000 this year — legally.',
    audience: 'Self-employed 30-55',
    emotion: 'Relief + Urgency',
    palette: 'ice_blue',
    sceneTypes: ['legal_document', 'percentage', 'warning', 'money_drain', 'padlock', 'chart'],
  },
  {
    id: 'real-estate',
    name: 'Real Estate Play',
    niche: 'real_estate',
    title: 'How to Buy Your First Property With Almost No Money Down',
    hook: 'The strategy banks don\'t advertise that lets you own real estate with 3.5% down.',
    audience: 'Aspiring homeowners 25-40',
    emotion: 'Hope + Urgency',
    palette: 'warm_amber',
    sceneTypes: ['building', 'legal_document', 'money_bag', 'chart', 'flow_diagram', 'padlock'],
  },
  {
    id: 'psychology',
    name: 'Money Psychology',
    niche: 'money_psychology',
    title: 'The Psychological Trick That Keeps You Broke',
    hook: 'Your brain is wired to lose money — here\'s the exact bias making you poor.',
    audience: 'Anyone 20-45',
    emotion: 'Shock + Self-awareness',
    palette: 'lavender',
    sceneTypes: ['warning', 'flow_diagram', 'money_drain', 'clock', 'chart', 'asset_cluster'],
  },
]

interface Props {
  onSelect: (t: ScenarioTemplate) => void
  brandName?: string
  brandNiche?: string
}

export function TemplatesPicker({ onSelect, brandName, brandNiche }: Props) {
  const [open, setOpen] = useState(false)

  // Sort: brand-matching niche first, then others
  const sorted = brandNiche
    ? [
        ...TEMPLATES.filter(t => t.niche === brandNiche),
        ...TEMPLATES.filter(t => t.niche !== brandNiche),
      ]
    : TEMPLATES

  const brandMatched = brandNiche ? TEMPLATES.filter(t => t.niche === brandNiche) : []
  const others = brandNiche ? TEMPLATES.filter(t => t.niche !== brandNiche) : TEMPLATES

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
          {brandName && brandMatched.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-accent/70 uppercase tracking-wider mb-2">For {brandName}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {brandMatched.map(t => (
                  <TemplateCard key={t.id} t={t} onSelect={onSelect} setOpen={setOpen} />
                ))}
              </div>
            </div>
          )}
          {(brandMatched.length > 0 && others.length > 0) && (
            <div>
              <p className="text-[10px] font-semibold text-brand-500 uppercase tracking-wider mb-2">Other templates</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {others.map(t => (
                  <TemplateCard key={t.id} t={t} onSelect={onSelect} setOpen={setOpen} />
                ))}
              </div>
            </div>
          )}
          {brandMatched.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sorted.map(t => (
                <TemplateCard key={t.id} t={t} onSelect={onSelect} setOpen={setOpen} />
              ))}
            </div>
          )}
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
      <p className="text-[10px] text-brand-600 mt-1.5">{t.niche.replace(/_/g, ' ')} · {t.sceneTypes.length} scenes</p>
    </button>
  )
}
