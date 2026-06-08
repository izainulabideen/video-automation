import Link from 'next/link'
import { Suspense } from 'react'
import { createAdminClient } from '@/lib/supabase/admin'
import { ScenariosFilters } from '@/components/scenarios/ScenariosFilters'
import { KanbanBoard } from '@/components/scenarios/KanbanBoard'
import { ViewToggle } from '@/components/scenarios/ViewToggle'
import { BulkScenarioActions } from '@/components/scenarios/BulkScenarioActions'
import { Plus, Film } from 'lucide-react'

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
    .select('id, title, niche, hook, status, created_at, brand:brands(name, theme_config)')

  if (view !== 'kanban') {
    if (params.status) query = query.eq('status', params.status as never)
  }
  if (params.q) query = query.or(`title.ilike.%${params.q}%,hook.ilike.%${params.q}%`)

  if (params.sort === 'title')       query = query.order('title')
  else if (params.sort === 'status') query = query.order('status')
  else if (params.sort === 'niche')  query = query.order('niche')
  else                               query = query.order('created_at', { ascending: false })

  const { data: allScenarios } = await query.limit(500)
  const allList    = allScenarios ?? []
  const totalCount = allList.length
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const scenarios  = view === 'kanban'
    ? allList
    : allList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Scenarios</h1>
          <p className="text-xs text-brand-400 mt-0.5">{totalCount} stories</p>
        </div>
        <div className="flex items-center gap-2">
          <Suspense fallback={null}><ViewToggle /></Suspense>
          <Link href="/scenarios/new"
            className="flex items-center gap-2 bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-4 py-2.5 hover:opacity-90 transition-all text-sm font-semibold shadow-lg shadow-accent/20">
            <Plus size={14} />
            New Story
          </Link>
        </div>
      </div>

      {view !== 'kanban' && <Suspense fallback={null}><ScenariosFilters /></Suspense>}

      {view === 'kanban' ? (
        <KanbanBoard scenarios={scenarios as never[]} />
      ) : !scenarios.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
            <Film size={22} className="text-brand-500" />
          </div>
          <p className="text-brand-400 text-sm font-medium">No scenarios yet</p>
          <p className="text-brand-600 text-xs mt-1 mb-4">Create your first finance story</p>
          <Link href="/scenarios/new" className="text-xs text-accent hover:text-accent-2 underline">Create one →</Link>
        </div>
      ) : (
        <BulkScenarioActions scenarios={scenarios as never[]} />
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
