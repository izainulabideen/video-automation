import { createAdminClient } from '@/lib/supabase/admin'
import { ScenarioCard } from '@/components/scenarios/ScenarioCard'
import Link from 'next/link'

export const revalidate = 300

export default async function DashboardPage() {
  const supabase = createAdminClient()

  const [
    { count: scenarioCount },
    { count: promptCount },
    { count: graphicCount },
    { count: videoCount },
    { data: recent },
    { data: byStatus },
  ] = await Promise.all([
    supabase.from('scenarios').select('*', { count: 'exact', head: true }),
    supabase.from('prompts').select('*', { count: 'exact', head: true }),
    supabase.from('graphics').select('*', { count: 'exact', head: true }),
    supabase.from('videos').select('*', { count: 'exact', head: true }),
    supabase.from('scenarios').select('id, title, niche, hook, status, created_at').order('created_at', { ascending: false }).limit(8),
    supabase.from('scenarios').select('status').limit(1000),
  ])

  const statusCounts = { draft: 0, in_production: 0, published: 0 }
  byStatus?.forEach(s => { statusCounts[s.status as keyof typeof statusCounts]++ })

  const stats = [
    { label: 'Scenarios', value: scenarioCount ?? 0 },
    { label: 'Prompts',   value: promptCount ?? 0 },
    { label: 'Graphics',  value: graphicCount ?? 0 },
    { label: 'Videos',    value: videoCount ?? 0 },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-900 tracking-tight mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-brand-300 p-5">
            <p className="text-xs text-brand-500 uppercase tracking-wide font-medium">{s.label}</p>
            <p className="text-3xl font-semibold text-brand-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mb-8 flex-wrap">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-white rounded-lg border border-brand-300 px-4 py-3">
            <p className="text-xs text-brand-500 capitalize">{status.replace('_', ' ')}</p>
            <p className="text-xl font-semibold text-brand-900">{count}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-brand-900">Recent Scenarios</h2>
        <div className="flex gap-2 flex-wrap">
          <Link href="/scenarios/new" className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium">New Scenario</Link>
          <Link href="/prompts" className="border border-brand-300 rounded-md px-4 py-2 hover:bg-brand-100 text-sm">Browse Prompts</Link>
          <Link href="/graphics" className="border border-brand-300 rounded-md px-4 py-2 hover:bg-brand-100 text-sm">View Graphics</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recent?.map(s => <ScenarioCard key={s.id} scenario={s as any} />)}
      </div>
    </div>
  )
}
