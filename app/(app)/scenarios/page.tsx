import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ScenarioStatusBadge } from '@/components/scenarios/ScenarioStatusBadge'
import { ScenariosFilters } from '@/components/scenarios/ScenariosFilters'
import { KanbanBoard } from '@/components/scenarios/KanbanBoard'
import { ViewToggle } from '@/components/scenarios/ViewToggle'
import { formatDate } from '@/lib/utils'
import { Plus, Film } from 'lucide-react'
import { NICHE_LABELS, NICHE_COLORS } from '@/lib/constants'

export const revalidate = 0

interface Props {
  searchParams: Promise<{ status?: string; q?: string; sort?: string; view?: string }>
}

export default async function ScenariosPage({ searchParams }: Props) {
  const params  = await searchParams
  const supabase = createAdminClient()
  const view     = params.view ?? 'list'

  let query = supabase
    .from('scenarios')
    .select('id, title, niche, hook, status, created_at, assigned_to, due_date')

  // Kanban shows all statuses regardless of filter
  if (view !== 'kanban') {
    if (params.status) query = query.eq('status', params.status as never)
  }
  if (params.q) query = query.or(`title.ilike.%${params.q}%,hook.ilike.%${params.q}%`)

  if (params.sort === 'title')       query = query.order('title')
  else if (params.sort === 'status') query = query.order('status')
  else if (params.sort === 'niche')  query = query.order('niche')
  else                               query = query.order('created_at', { ascending: false })

  const { data: scenarios } = await query.limit(200)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Scenarios</h1>
          <p className="text-xs text-brand-400 mt-0.5">{scenarios?.length ?? 0} stories</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle />
          <Link href="/scenarios/new"
            className="flex items-center gap-2 bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-4 py-2.5 hover:opacity-90 transition-all text-sm font-semibold shadow-lg shadow-accent/20">
            <Plus size={14} />
            New Story
          </Link>
        </div>
      </div>

      {/* Filters (hidden in kanban — kanban shows all) */}
      {view !== 'kanban' && <ScenariosFilters />}

      {/* Kanban board */}
      {view === 'kanban' ? (
        <KanbanBoard scenarios={(scenarios ?? []) as never[]} />
      ) : !scenarios?.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
            <Film size={22} className="text-brand-500" />
          </div>
          <p className="text-brand-400 text-sm font-medium">No scenarios yet</p>
          <p className="text-brand-600 text-xs mt-1 mb-4">Create your first finance story</p>
          <Link href="/scenarios/new" className="text-xs text-accent hover:text-accent-2 underline">Create one →</Link>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden bg-[#0D1117]">
          {scenarios.map((s, i) => (
            <Link key={s.id} href={`/scenarios/${s.id}`}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group ${i > 0 ? 'border-t border-white/[0.05]' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                s.status === 'published' ? 'bg-success' :
                s.status === 'in_production' ? 'bg-warning' : 'bg-brand-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white group-hover:text-accent transition-colors truncate">{s.title}</p>
                <p className="text-[11px] text-brand-500 truncate mt-0.5">{s.hook}</p>
              </div>
              <span className={`text-[11px] hidden md:block shrink-0 px-2.5 py-1 rounded-full border ${NICHE_COLORS[s.niche] ?? 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'}`}>
                {NICHE_LABELS[s.niche] ?? s.niche}
              </span>
              <ScenarioStatusBadge status={s.status} />
              <span className="text-[11px] text-brand-600 shrink-0 hidden lg:block">{formatDate(s.created_at)}</span>
              <svg className="w-3.5 h-3.5 text-brand-600 group-hover:text-brand-300 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
