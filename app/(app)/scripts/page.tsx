import { createAdminClient } from '@/lib/supabase/admin'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export const revalidate = 120

export default async function ScriptsPage() {
  const supabase = createAdminClient()
  const { data: scripts } = await supabase
    .from('scripts')
    .select('id, body, word_count, duration_sec, scenario_id, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-900 tracking-tight mb-6">Script Library</h1>
      {!scripts?.length ? (
        <EmptyState title="No scripts yet" />
      ) : (
        <div className="space-y-4">
          {scripts.map(s => (
            <div key={s.id} className="bg-white rounded-lg border border-brand-300 p-5">
              <div className="flex items-center gap-4 mb-2 text-xs text-brand-500">
                <span><strong className="text-brand-900">{s.word_count ?? 0}</strong> words</span>
                <span><strong className="text-brand-900">{s.duration_sec ?? 0}s</strong></span>
                <span>{formatDate(s.created_at)}</span>
                {s.scenario_id && (
                  <Link href={`/scenarios/${s.scenario_id}/script`} className="text-accent-2">Edit →</Link>
                )}
              </div>
              <p className="text-sm text-brand-700 leading-relaxed line-clamp-4">{s.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
