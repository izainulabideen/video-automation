import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PromptCard } from '@/components/prompts/PromptCard'
import { EmptyState } from '@/components/shared/EmptyState'

interface Props { params: Promise<{ id: string }> }

export default async function ScenarioPromptsPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, scene_type, caption_word, prompt_text, ai_tool, sort_order, scenario_id, created_at')
    .eq('scenario_id', id)
    .order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-brand-900 tracking-tight">Prompts</h1>
        <Link href={`/scenarios/${id}/prompts/new`}
          className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium">
          Add Prompt
        </Link>
      </div>
      {!prompts?.length ? (
        <EmptyState title="No prompts yet" description="Add image generation prompts for this scenario." />
      ) : (
        <div className="space-y-3">
          {prompts.map(p => <PromptCard key={p.id} prompt={p as any} scenarioId={id} />)}
        </div>
      )}
    </div>
  )
}
