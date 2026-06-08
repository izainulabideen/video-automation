'use client'
import { useRouter } from 'next/navigation'
import { NICHES, NICHE_LABELS, PALETTES, STATUS_OPTIONS } from '@/lib/constants'
import type { Database } from '@/types/database'

type Scenario = Database['public']['Tables']['scenarios']['Row']

interface ScenarioFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (fd: FormData) => Promise<{ success: boolean; error?: string; data?: any }>
  defaultValues?: Partial<Scenario>
  submitLabel?: string
}

const labelCls = 'block text-[11px] font-semibold text-brand-300 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-brand-500 focus:border-accent/50 focus:bg-white/[0.06] transition-all'

export function ScenarioForm({ action, defaultValues, submitLabel = 'Save' }: ScenarioFormProps) {
  const router = useRouter()
  async function handleSubmit(fd: FormData) {
    const result = await action(fd)
    if (result.success && result.data?.id) router.push(`/scenarios/${result.data.id}`)
    else if (result.success) router.push('/scenarios')
  }
  return (
    <form action={handleSubmit} className="space-y-5 max-w-2xl">
      {/* Title + Niche row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>Title</label>
          <input name="title" required defaultValue={defaultValues?.title ?? ''}
            placeholder="e.g. The Hidden Tax Trap Most Earners Miss"
            className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Hook</label>
          <input name="hook" required defaultValue={defaultValues?.hook ?? ''}
            placeholder="One compelling sentence to hook the viewer"
            className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Niche</label>
          <select name="niche" required defaultValue={defaultValues?.niche ?? ''}
            className={inputCls}>
            <option value="" disabled className="bg-[#111827]">Select niche</option>
            {NICHES.map(n => (
              <option key={n} value={n} className="bg-[#111827]">{NICHE_LABELS[n] ?? n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Palette</label>
          <select name="palette" defaultValue={defaultValues?.palette ?? ''}
            className={inputCls}>
            <option value="" className="bg-[#111827]">Select palette</option>
            {PALETTES.map(p => (
              <option key={p.value} value={p.value} className="bg-[#111827]">{p.label} — {p.use}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Target Audience</label>
          <input name="audience" defaultValue={defaultValues?.audience ?? ''}
            placeholder="e.g. 25-40 yr earners"
            className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Emotion</label>
          <input name="emotion" defaultValue={defaultValues?.emotion ?? ''}
            placeholder="e.g. Urgency, fear of missing out"
            className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Notes</label>
        <textarea name="notes" rows={3} defaultValue={defaultValues?.notes ?? ''}
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
