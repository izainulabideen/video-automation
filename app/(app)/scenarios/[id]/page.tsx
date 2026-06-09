import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { PipelineTracker } from '@/components/scenarios/PipelineTracker'
import { ScenarioStatusBadge } from '@/components/scenarios/ScenarioStatusBadge'
import { DuplicateScenarioButton } from '@/components/scenarios/DuplicateScenarioButton'
import { ScenarioWorkspace } from '@/components/scenarios/ScenarioWorkspace'
import { ScenarioChecklist } from '@/components/scenarios/ScenarioChecklist'
import { ActivityLogView } from '@/components/scenarios/ActivityLog'
import { CommentsPanel } from '@/components/scenarios/CommentsPanel'
import { AssignmentWidget } from '@/components/scenarios/AssignmentWidget'
import { ExportPanel } from '@/components/scenarios/ExportPanel'
import { formatDate } from '@/lib/utils'
import type { PublicSettings } from '@/actions/public-settings'
import { NICHE_LABELS } from '@/lib/constants'
import { getOrCreateChecklist } from '@/actions/checklist'
import { getActivityLog } from '@/actions/activity'
import { getComments } from '@/actions/comments'
import { getScriptVersions } from '@/actions/scripts'
import { getSession } from '@/lib/session'
import Link from 'next/link'
import { ChevronLeft, MessageSquare, UserCircle } from 'lucide-react'
import type { BrandTheme } from '@/types/brand'

export const revalidate = 0

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
    { data: teamUsers },
    { data: scriptData },
    { data: graphicsData },
    { data: videoData },
    { data: publicSetting },
    checklist,
    activityLog,
    comments,
    scriptVersions,
    session,
  ] = await Promise.all([
    supabase.from('scenarios').select('*, brand:brands(id, name, theme_config)').eq('id', id).single(),
    supabase.from('prompts').select('*').eq('scenario_id', id).order('sort_order'),
    supabase.from('scripts').select('*').eq('scenario_id', id).single(),
    supabase.from('graphics').select('*').eq('scenario_id', id).order('sort_order'),
    supabase.from('videos').select('*').eq('scenario_id', id).single(),
    supabase.from('public_settings').select('*').eq('scenario_id', id).single(),
    supabase.from('users').select('name').order('name'),
    supabase.from('scripts').select('id').eq('scenario_id', id).single(),
    supabase.from('graphics').select('id').eq('scenario_id', id).limit(1),
    supabase.from('videos').select('id, status').eq('scenario_id', id).single(),
    supabase.from('public_settings').select('is_public').eq('scenario_id', id).single(),
    getOrCreateChecklist(id),
    getActivityLog(id),
    getComments(id),
    getScriptVersions(id),
    getSession(),
  ])

  if (!scenario) notFound()

  const hasScript   = !!scriptData
  const hasGraphics = (graphicsData?.length ?? 0) > 0
  const hasVideo    = !!videoData
  const isPublished = scenario.status === 'published'
  const isPublic    = !!publicSetting?.is_public

  const pipelineSteps = [
    { key: 'script',    label: 'Script',    done: hasScript,    active: !hasScript },
    { key: 'graphics',  label: 'Graphics',  done: hasGraphics,  active: hasScript && !hasGraphics },
    { key: 'video',     label: 'Video',     done: hasVideo,     active: hasGraphics && !hasVideo },
    { key: 'published', label: 'Published', done: isPublished,  active: hasVideo && !isPublished },
    { key: 'public',    label: 'Public',    done: isPublic,     active: isPublished && !isPublic },
  ]

  const done  = checklist.filter(i => i.is_done).length
  const total = checklist.length
  const pct   = total ? Math.round((done / total) * 100) : 0
  const currentUser = session?.name ?? 'Unknown'
  const teamMembers = (teamUsers ?? []).map((u: { name: string }) => u.name)
  const commentCount = comments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0)

  // Due date overdue check
  const dueDate = (scenario as Record<string, unknown>).due_date as string | null ?? null
  const assignedTo = (scenario as Record<string, unknown>).assigned_to as string | null ?? null
  const isOverdue = dueDate && new Date(dueDate) < new Date()
  const brand = (scenario as Record<string, unknown>).brand as { id: string; name: string; theme_config: BrandTheme } | null ?? null
  const brandAccent = brand?.theme_config?.accent ?? '#C8922A'
  const brandNicheLabels = brand?.theme_config?.nicheLabels ?? {}

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
          <div className="flex items-center flex-wrap gap-3 mt-1">
            <p className="text-xs text-brand-500 uppercase tracking-wide">
              {brandNicheLabels[scenario.niche ?? ''] ?? NICHE_LABELS[scenario.niche ?? ''] ?? scenario.niche} · {formatDate(scenario.created_at)}
            </p>
            {brand && (
              <span className="text-[10px] flex items-center gap-1.5 px-2 py-0.5 rounded-full border"
                style={{ borderColor: brandAccent + '30', color: brandAccent, background: brandAccent + '10' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: brandAccent }} />
                {brand.name}
              </span>
            )}
            {assignedTo && (
              <div className="flex items-center gap-1.5 text-xs text-brand-400">
                <UserCircle size={11} />
                {assignedTo}
              </div>
            )}
            {dueDate && (
              <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                isOverdue
                  ? 'text-danger bg-danger/10 border-danger/25'
                  : 'text-brand-400 bg-white/[0.03] border-white/[0.07]'
              }`}>
                {isOverdue ? 'Overdue · ' : 'Due · '}{new Date(dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DuplicateScenarioButton id={id} />
          <ScenarioStatusBadge status={scenario.status} />
        </div>
      </div>

      {/* Pipeline tracker */}
      <div className="mb-6 px-5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <PipelineTracker steps={pipelineSteps} />
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

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        {/* Main workspace */}
        <div>
          <ScenarioWorkspace
            scenario={scenario as never}
            prompts={(prompts ?? []) as never[]}
            script={script as never ?? undefined}
            graphics={(graphics ?? []) as never[]}
            video={video as never ?? undefined}
            publicSettings={publicSettings as PublicSettings ?? null}
            scriptVersions={scriptVersions}
            brand={brand as never}
          />
        </div>

        {/* Right sidebar */}
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

          {/* Assignment */}
          <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.05]">
              <span className="text-sm font-semibold text-white">Assignment</span>
            </div>
            <div className="px-4 pb-4 pt-3">
              <AssignmentWidget
                scenarioId={id}
                assignedTo={assignedTo}
                dueDate={dueDate}
                teamMembers={teamMembers}
              />
            </div>
          </div>

          {/* Comments */}
          <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Comments</span>
              {commentCount > 0 && (
                <span className="text-[11px] text-brand-500 flex items-center gap-1">
                  <MessageSquare size={10} />{commentCount}
                </span>
              )}
            </div>
            <div className="px-4 pb-4 pt-3">
              <CommentsPanel
                scenarioId={id}
                comments={comments}
                currentUser={currentUser}
              />
            </div>
          </div>

          {/* Export */}
          <ExportPanel scenarioId={id} title={scenario.title ?? id} />

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
