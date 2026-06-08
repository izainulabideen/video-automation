import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ScenarioStatusBadge } from '@/components/scenarios/ScenarioStatusBadge'
import { ScenariosFilters } from '@/components/scenarios/ScenariosFilters'
import { KanbanBoard } from '@/components/scenarios/KanbanBoard'
import { ViewToggle } from '@/components/scenarios/ViewToggle'
import { BulkScenarioActions } from '@/components/scenarios/BulkScenarioActions'
import { formatDate } from '@/lib/utils'
import { Plus, Film } from 'lucide-react'
import { NICHE_LABELS, NICHE_COLORS } from '@/lib/constants'

export const revalidate = 0

const PAGE_SIZE = 25

interface Props {
  searchParams: Promise<{ status?: string; q?: string; sort?: string; view?: string; page?: string }>
}

export default async function ScenariosPage({ searchParams }: Props) {
  const params   = await searchParams
  const supabase = createAdminClient()
  const view     = params.view ?? 'list'
  const page     = Math.max(1, parseInt(params.page ?? '1', 10))

  let query = supabase
    .from('scenarios')
    .select('id, title, niche, hook, status, created_at, assigned_to, due_date')

  if (view !== 'kanban') {
    if (params.status) query = query.eq('status', params.status as never)
  }
  if (params.q) query = query.or(`title.ilike.%${params.q}%,hook.ilike.%${params.q}%`)

  if (params.sort === 'title')       query = query.order('title')
  else if (params.sort === 'status') query = query.order('status')
  else if (params.sort === 'niche')  query = query.order('niche')
  else                               query = query.order('created_at', { ascending: false })

  const { data: allScenarios } = await query.limit(500)
  const totalCount = allScenarios?.length ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const scenarios  = view === 'kanban'
    ? allScenarios
    : allScenarios?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Scenarios</h1>
          <p className="text-xs text-brand-400 mt-0.5">{totalCount} stories</p>
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

      {view !== 'kanban' && <ScenariosFilters />}

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
        <BulkScenarioActions
          scenarios={scenarios as never[]}
          renderRow={(s, selected, toggle) => (
            <div key={s.id}
              className={`flex items-center gap-3 px-4 py-4 border-t first:border-t-0 border-white/[0.05] hover:bg-white/[0.02] transition-colors group ${selected ? 'bg-accent/[0.03]' : ''}`}>
              <button onClick={toggle} className="shrink-0 text-brand-600 hover:text-accent transition-colors p-0.5">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selected ? 'bg-accent border-accent' : 'border-white/20 group-hover:border-white/40'}`}>
                  {selected && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </button>
              <Link href={`/scenarios/${s.id}`} className="flex items-center gap-4 flex-1 min-w-0">
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
              </Link>
            </div>
          )}
        />
      )}

      {/* Pagination */}
      {view !== 'kanban' && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          {page > 1 && (
            <Link href={`/scenarios?${new URLSearchParams({ ...(params.status ? { status: params.status } : {}), ...(params.q ? { q: params.q } : {}), ...(params.sort ? { sort: params.sort } : {}), page: String(page - 1) })}`}
              className="px-4 py-2 rounded-lg border border-white/[0.09] text-sm text-brand-400 hover:text-white hover:border-accent/30 transition-all">
              ← Prev
            </Link>
          )}
          <span className="text-[11px] text-brand-600">{page} / {totalPages}</span>
          {page < totalPages && (
            <Link href={`/scenarios?${new URLSearchParams({ ...(params.status ? { status: params.status } : {}), ...(params.q ? { q: params.q } : {}), ...(params.sort ? { sort: params.sort } : {}), page: String(page + 1) })}`}
              className="px-4 py-2 rounded-lg border border-white/[0.09] text-sm text-brand-400 hover:text-white hover:border-accent/30 transition-all">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
