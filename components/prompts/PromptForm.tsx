'use client'
import { useRouter } from 'next/navigation'
import { SCENE_TYPES } from '@/lib/constants'

interface PromptFormProps {
  action: (fd: FormData) => Promise<{ success: boolean; error?: string }>
  scenarioId: string
}

export function PromptForm({ action, scenarioId }: PromptFormProps) {
  const router = useRouter()
  async function handleSubmit(fd: FormData) {
    const result = await action(fd)
    if (result.success) router.push(`/scenarios/${scenarioId}/prompts`)
  }
  return (
    <form action={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Scene Type</label>
        <select name="scene_type" required
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none">
          <option value="">Select scene type</option>
          {SCENE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Caption Word</label>
        <input name="caption_word"
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">Prompt Text</label>
        <textarea name="prompt_text" required rows={5}
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-accent outline-none" />
      </div>
      <div>
        <label className="text-xs text-brand-500 uppercase tracking-wide font-medium">AI Tool</label>
        <select name="ai_tool"
          className="mt-1 w-full border border-brand-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none">
          <option value="midjourney">Midjourney</option>
          <option value="dalle3">DALL-E 3</option>
        </select>
      </div>
      <button type="submit" className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium">
        Save Prompt
      </button>
    </form>
  )
}
