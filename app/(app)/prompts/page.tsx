import { createAdminClient } from '@/lib/supabase/admin'
import { PromptCard } from '@/components/prompts/PromptCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { SCENE_TYPES } from '@/lib/constants'
import Link from 'next/link'

export const revalidate = 120

interface Props { searchParams: Promise<{ scene_type?: string; ai_tool?: string }> }

export default async function PromptsPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = createAdminClient()

  let query = supabase
    .from('prompts')
    .select('id, scene_type, caption_word, prompt_text, ai_tool, sort_order, scenario_id, created_at')
    .order('created_at', { ascending: false })
    .limit(50)
  if (params.scene_type) query = query.eq('scene_type', params.scene_type)
  if (params.ai_tool)    query = query.eq('ai_tool', params.ai_tool)

  const { data: prompts } = await query

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-900 tracking-tight mb-6">Prompt Library</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        {[{ value: '', label: 'All Scene Types' }, ...SCENE_TYPES].map(s => (
          <Link key={s.value} href={`/prompts${s.value ? `?scene_type=${s.value}` : ''}`}
            className={`text-sm px-3 py-1.5 rounded-md border ${params.scene_type === s.value || (!params.scene_type && !s.value) ? 'bg-accent text-white border-accent' : 'border-brand-300 hover:bg-brand-100'}`}>
            {s.label}
          </Link>
        ))}
      </div>
      {!prompts?.length ? (
        <EmptyState title="No prompts yet" />
      ) : (
        <div className="space-y-3">
          {prompts.map(p => (
            <div key={p.id}>
              <PromptCard prompt={p as any} scenarioId={p.scenario_id ?? ''} />
              {p.scenario_id && (
                <Link href={`/scenarios/${p.scenario_id}`}
                  className="text-xs text-accent-2 ml-1 mt-1 inline-block">View scenario →</Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
