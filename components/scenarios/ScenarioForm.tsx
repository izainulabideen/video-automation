'use client'
import { useRouter } from 'next/navigation'
import { NICHES, PALETTES, STATUS_OPTIONS } from '@/lib/constants'
import type { Database } from '@/types/database'

type Scenario = Database['public']['Tables']['scenarios']['Row']

interface ScenarioFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (fd: FormData) => Promise<{ success: boolean; error?: string; data?: any }>
  defaultValues?: Partial<Scenario>
  submitLabel?: string
}

export function ScenarioForm({ action, defaultValues, submitLabel = 'Save' }: ScenarioFormProps) {
  const router = useRouter()
  async function handleSubmit(fd: FormData) {
    const result = await action(fd)
    if (result.success && result.data?.id) router.push(`/scenarios/${result.data.id}`)
    else if (result.success) router.push('/scenarios')
  }
  return (
    <form action={handleSubmit} className="space-y-4 max-w-xl">
      {[
        { name: 'title', label: 'Title', required: true },
        { name: 'hook',  label: 'Hook',  required: true },
      ].map(f => (
        <div key={f.name}>
          <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">{f.label}</label>
          <input name={f.name} required={f.required} defaultValue={defaultValues?.[f.name as keyof Scenario] as string ?? ''}
            className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>
      ))}
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Niche</label>
        <select name="niche" required defaultValue={defaultValues?.niche ?? ''}
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none">
          <option value="" disabled>Select niche</option>
          {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      {[
        { name: 'audience', label: 'Audience' },
        { name: 'emotion',  label: 'Emotion' },
      ].map(f => (
        <div key={f.name}>
          <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">{f.label}</label>
          <input name={f.name} defaultValue={defaultValues?.[f.name as keyof Scenario] as string ?? ''}
            className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>
      ))}
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Palette</label>
        <select name="palette" defaultValue={defaultValues?.palette ?? ''}
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none">
          <option value="">Select palette</option>
          {PALETTES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Notes</label>
        <textarea name="notes" rows={3} defaultValue={defaultValues?.notes ?? ''}
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
      </div>
      <button type="submit" className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium">
        {submitLabel}
      </button>
    </form>
  )
}
