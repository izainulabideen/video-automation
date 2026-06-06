import Link from 'next/link'
import { ScenarioStatusBadge } from './ScenarioStatusBadge'
import { formatDate, truncate } from '@/lib/utils'
import type { Database } from '@/types/database'

type Scenario = Database['public']['Tables']['scenarios']['Row']

export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <Link href={`/scenarios/${scenario.id}`}>
      <div className="bg-white rounded-lg border border-brand-300 p-5 hover:shadow-sm transition cursor-pointer h-full">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium text-brand-900">{scenario.title}</h3>
          <ScenarioStatusBadge status={scenario.status} />
        </div>
        <p className="text-xs text-brand-500 uppercase tracking-wide font-medium mb-1">{scenario.niche}</p>
        <p className="text-sm text-brand-700 leading-relaxed">{truncate(scenario.hook, 100)}</p>
        <p className="mt-3 text-xs text-brand-500">{formatDate(scenario.created_at)}</p>
      </div>
    </Link>
  )
}
