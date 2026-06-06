import { PromptCopyButton } from './PromptCopyButton'
import type { Database } from '@/types/database'

type Prompt = Database['public']['Tables']['prompts']['Row']

export function PromptCard({ prompt, scenarioId }: { prompt: Prompt; scenarioId: string }) {
  return (
    <div className="bg-white rounded-lg border border-brand-300 p-5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className="text-xs text-brand-500 uppercase tracking-wide font-medium">{prompt.scene_type}</span>
          {prompt.caption_word && (
            <span className="ml-2 text-xs font-mono bg-brand-100 px-2 py-0.5 rounded text-brand-700">{prompt.caption_word}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-500">{prompt.ai_tool}</span>
          <PromptCopyButton text={prompt.prompt_text} />
        </div>
      </div>
      <p className="text-sm font-mono bg-brand-100 px-3 py-2 rounded text-brand-700 leading-relaxed">{prompt.prompt_text}</p>
    </div>
  )
}
