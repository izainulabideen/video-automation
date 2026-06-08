import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ScenarioStatusBadge } from '@/components/scenarios/ScenarioStatusBadge'
import { ScenarioWorkspace } from '@/components/scenarios/ScenarioWorkspace'
import { formatDate } from '@/lib/utils'
import type { PublicSettings } from '@/actions/public-settings'

export const revalidate = 30

interface Props { params: Promise<{ id: string }> }

export default async function ScenarioDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  const [
    { data: scenario },
    { data: prompts },
    { data: script },
    { data: graphics },
    { data: video },
    { data: publicSettings },
  ] = await Promise.all([
    supabase.from('scenarios').select('*').eq('id', id).single(),
    supabase.from('prompts').select('*').eq('scenario_id', id).order('sort_order'),
    supabase.from('scripts').select('*').eq('scenario_id', id).single(),
    supabase.from('graphics').select('*').eq('scenario_id', id).order('sort_order'),
    supabase.from('videos').select('*').eq('scenario_id', id).single(),
    supabase.from('public_settings').select('*').eq('scenario_id', id).single(),
  ])

  if (!scenario) notFound()

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-brand-900">{scenario.title}</h1>
          <p className="text-xs text-brand-500 uppercase tracking-wide mt-0.5">
            {scenario.niche} · {formatDate(scenario.created_at)}
          </p>
        </div>
        <ScenarioStatusBadge status={scenario.status} />
      </div>

      <ScenarioWorkspace
        scenario={scenario as never}
        prompts={(prompts ?? []) as never[]}
        script={script as never ?? undefined}
        graphics={(graphics ?? []) as never[]}
        video={video as never ?? undefined}
        publicSettings={publicSettings as PublicSettings ?? null}
      />
    </div>
  )
}
