import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ScenarioStatusBadge } from '@/components/scenarios/ScenarioStatusBadge'
import { DuplicateScenarioButton } from '@/components/scenarios/DuplicateScenarioButton'
import { ScenarioWorkspace } from '@/components/scenarios/ScenarioWorkspace'
import { ScenarioChecklist } from '@/components/scenarios/ScenarioChecklist'
import { ActivityLogView } from '@/components/scenarios/ActivityLog'
import { formatDate } from '@/lib/utils'
import type { PublicSettings } from '@/actions/public-settings'
import { NICHE_LABELS } from '@/lib/constants'
import { getOrCreateChecklist } from '@/actions/checklist'
import { getActivityLog } from '@/actions/activity'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

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
    checklist,
    activityLog,
  ] = await Promise.all([
    supabase.from('scenarios').select('*').eq('id', id).single(),
    supabase.from('prompts').select('*').eq('scenario_id', id).order('sort_order'),
    supabase.from('scripts').select('*').eq('scenario_id', id).single(),
    supabase.from('graphics').select('*').eq('scenario_id', id).order('sort_order'),
    supabase.from('videos').select('*').eq('scenario_id', id).single(),
    supabase.from('public_settings').select('*').eq('scenario_id', id).single(),
    getOrCreateChecklist(id),
    getActivityLog(id),
  ])

  if (!scenario) notFound()

  const done  = checklist.filter(i => i.is_done).length
  const total = checklist.length
  const pct   = total ? Math.round((done / total) * 100) : 0

  return (
    <div>
      {/* Back */}
      <Link href="/scenarios" className="inline-flex items-center gap-1 text-[11px] text-brand-500 hover:text-brand-300 transition-colors mb-4">
        <ChevronLeft size={13} />
        All Scenarios
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">{scenario.title}</h1>
          <p className="text-xs text-brand-500 uppercase tracking-wide mt-1">
            {NICHE_LABELS[scenario.niche ?? ''] ?? scenario.niche} · {formatDate(scenario.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DuplicateScenarioButton id={id} />
          <ScenarioStatusBadge status={scenario.status} />
        </div>
      </div>

      {/* Progress bar mini */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? '#10B981' : 'linear-gradient(90deg, #C8922A, #E8B84B)',
            }} />
        </div>
        <span className="text-[11px] text-brand-500 shrink-0">{pct}% complete</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        {/* Main workspace */}
        <div>
          <ScenarioWorkspace
            scenario={scenario as never}
            prompts={(prompts ?? []) as never[]}
            script={script as never ?? undefined}
            graphics={(graphics ?? []) as never[]}
            video={video as never ?? undefined}
            publicSettings={publicSettings as PublicSettings ?? null}
          />
        </div>

        {/* Right sidebar: checklist + activity */}
        <div className="space-y-3">
          {/* Checklist */}
          <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.05]">
              <span className="text-sm font-semibold text-white">Checklist</span>
              <span className="ml-2 text-[11px] text-brand-500">{done}/{total}</span>
            </div>
            <div className="px-4 pb-4 pt-3">
              <ScenarioChecklist scenarioId={id} items={checklist} />
            </div>
          </div>

          {/* Activity log */}
          <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.05]">
              <span className="text-sm font-semibold text-white">Activity</span>
              <span className="ml-2 text-[11px] text-brand-500">{activityLog.length} events</span>
            </div>
            <div className="px-4 pb-2 pt-3 max-h-80 overflow-y-auto">
              <ActivityLogView logs={activityLog} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
