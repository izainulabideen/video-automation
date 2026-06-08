import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ScenarioStatusBadge } from '@/components/scenarios/ScenarioStatusBadge'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export const revalidate = 60

interface Props { params: Promise<{ id: string }> }

export default async function ScenarioDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: scenario } = await supabase
    .from('scenarios')
    .select('*')
    .eq('id', id)
    .single()
  if (!scenario) notFound()

  const tabs = [
    { label: 'Prompts',  href: `/scenarios/${id}/prompts` },
    { label: 'Script',   href: `/scenarios/${id}/script` },
    { label: 'Graphics', href: `/scenarios/${id}/graphics` },
    { label: 'Video',    href: `/scenarios/${id}/video` },
  ]

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-brand-900 tracking-tight">{scenario.title}</h1>
          <p className="text-xs text-brand-500 uppercase tracking-wide font-medium mt-1">{scenario.niche}</p>
        </div>
        <div className="flex items-center gap-3">
          <ScenarioStatusBadge status={scenario.status} />
          <Link href={`/scenarios/${id}/edit`}
            className="border border-brand-300 rounded-md px-4 py-2 hover:bg-brand-100 text-sm">
            Edit
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-brand-300 p-5 mb-6 space-y-3">
        {([
          { label: 'Hook',     value: scenario.hook },
          { label: 'Audience', value: scenario.audience },
          { label: 'Emotion',  value: scenario.emotion },
          { label: 'Palette',  value: scenario.palette },
          { label: 'Notes',    value: scenario.notes },
        ] as { label: string; value: string | null }[]).filter(f => f.value).map(f => (
          <div key={f.label}>
            <span className="text-xs text-brand-500 uppercase tracking-wide font-medium">{f.label}</span>
            <p className="text-sm text-brand-700 mt-0.5">{f.value}</p>
          </div>
        ))}
        <p className="text-xs text-brand-500">Created {formatDate(scenario.created_at)}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <Link key={t.href} href={t.href}
            className="border border-brand-300 rounded-md px-4 py-2 hover:bg-brand-100 text-sm">
            {t.label} →
          </Link>
        ))}
      </div>
    </div>
  )
}
