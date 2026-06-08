import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ScenarioStatusBadge } from '@/components/scenarios/ScenarioStatusBadge'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'

export const revalidate = 60

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function ScenariosPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = createAdminClient()

  let query = supabase
    .from('scenarios')
    .select('id, title, niche, hook, status, created_at')

  if (params.status) query = query.eq('status', params.status as never)
  if (params.q)      query = query.or(`title.ilike.%${params.q}%,hook.ilike.%${params.q}%`)

  const { data: scenarios } = await query.order('created_at', { ascending: false }).limit(50)

  const statuses = [
    { value: '',              label: 'All' },
    { value: 'draft',         label: 'Draft' },
    { value: 'in_production', label: 'In Production' },
    { value: 'published',     label: 'Published' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-brand-900">Scenarios</h1>
        <Link href="/scenarios/new"
          className="flex items-center gap-1.5 bg-accent text-white rounded-md px-3 py-1.5 hover:bg-accent-h text-sm font-medium">
          <Plus size={14} /> New
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {statuses.map(s => (
          <Link key={s.value}
            href={`/scenarios${s.value ? `?status=${s.value}` : ''}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              (params.status ?? '') === s.value
                ? 'bg-accent text-white border-accent'
                : 'border-brand-300 text-brand-600 hover:bg-brand-100'
            }`}>
            {s.label}
          </Link>
        ))}
        <form className="ml-auto">
          <input
            name="q"
            defaultValue={params.q ?? ''}
            placeholder="Search…"
            className="border border-brand-300 rounded-md px-3 py-1.5 text-xs w-44 focus:ring-2 focus:ring-accent outline-none"
          />
        </form>
      </div>

      {!scenarios?.length ? (
        <div className="text-center py-20 text-brand-500 text-sm">
          No scenarios yet.{' '}
          <Link href="/scenarios/new" className="text-accent underline">Create one</Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-brand-200 overflow-hidden">
          {scenarios.map((s, i) => (
            <Link
              key={s.id}
              href={`/scenarios/${s.id}`}
              className={`flex items-center gap-4 px-5 py-3.5 hover:bg-brand-50 transition-colors ${i > 0 ? 'border-t border-brand-100' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-900 truncate">{s.title}</p>
                <p className="text-xs text-brand-500 truncate mt-0.5">{s.hook}</p>
              </div>
              <span className="text-xs text-brand-400 uppercase tracking-wide hidden md:block shrink-0">{s.niche}</span>
              <ScenarioStatusBadge status={s.status} />
              <span className="text-xs text-brand-400 shrink-0 hidden lg:block">{formatDate(s.created_at)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
