import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ScenarioCard } from '@/components/scenarios/ScenarioCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { NICHES, STATUS_OPTIONS } from '@/lib/constants'

export const revalidate = 60

interface Props {
  searchParams: Promise<{ status?: string; niche?: string; q?: string; sort?: string }>
}

export default async function ScenariosPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createServerClient()

  let query = supabase
    .from('scenarios')
    .select('id, title, niche, hook, status, created_at')

  if (params.status) query = query.eq('status', params.status)
  if (params.niche)  query = query.eq('niche', params.niche)
  if (params.q)      query = query.or(`title.ilike.%${params.q}%,hook.ilike.%${params.q}%`)

  const asc = params.sort === 'oldest'
  query = query.order('created_at', { ascending: asc }).limit(20)

  const { data: scenarios } = await query

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-brand-900 tracking-tight">Scenarios</h1>
        <Link href="/scenarios/new"
          className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium">
          New Scenario
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        {[{ value: '', label: 'All' }, ...STATUS_OPTIONS].map(s => (
          <Link key={s.value} href={`/scenarios${s.value ? `?status=${s.value}` : ''}`}
            className={`text-sm px-3 py-1.5 rounded-md border ${params.status === s.value || (!params.status && !s.value) ? 'bg-accent text-white border-accent' : 'border-brand-300 hover:bg-brand-100'}`}>
            {s.label}
          </Link>
        ))}
      </div>
      {!scenarios?.length ? (
        <EmptyState title="No scenarios yet" description="Create your first scenario to get started."
          action={<Link href="/scenarios/new" className="bg-accent text-white rounded-md px-4 py-2 text-sm font-medium">New Scenario</Link>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map(s => <ScenarioCard key={s.id} scenario={s as any} />)}
        </div>
      )}
    </div>
  )
}
