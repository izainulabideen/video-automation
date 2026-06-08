import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ScenarioStatusBadge } from '@/components/scenarios/ScenarioStatusBadge'
import { formatDate } from '@/lib/utils'
import { NICHE_LABELS } from '@/lib/constants'
import { getSession } from '@/lib/session'
import { BookOpen, CheckCircle, Clapperboard, FileText, Globe, ImageIcon } from 'lucide-react'

export const revalidate = 60

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const supabase = createAdminClient()
  const session = await getSession()

  const hour = new Date().getHours()
  const greeting = getGreeting(hour)
  const name = session?.name ?? 'there'

  // Fetch all stats in parallel
  const [
    { count: totalScenarios },
    { count: draftCount },
    { count: inProductionCount },
    { count: publishedCount },
    { count: totalScripts },
    { count: totalGraphics },
    { count: publicCount },
    { data: recentScenarios },
  ] = await Promise.all([
    supabase.from('scenarios').select('*', { count: 'exact', head: true }),
    supabase.from('scenarios').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('scenarios').select('*', { count: 'exact', head: true }).eq('status', 'in_production'),
    supabase.from('scenarios').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('scripts').select('*', { count: 'exact', head: true }),
    supabase.from('graphics').select('*', { count: 'exact', head: true }),
    supabase.from('public_settings').select('*', { count: 'exact', head: true }).eq('is_public', true),
    supabase
      .from('scenarios')
      .select('id, title, niche, hook, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const statCards = [
    {
      label: 'Total Stories',
      value: totalScenarios ?? 0,
      icon: BookOpen,
      color: 'text-[#C8922A]',
    },
    {
      label: 'Published',
      value: publishedCount ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-400',
    },
    {
      label: 'In Production',
      value: inProductionCount ?? 0,
      icon: Clapperboard,
      color: 'text-amber-400',
    },
    {
      label: 'Drafts',
      value: draftCount ?? 0,
      icon: FileText,
      color: 'text-brand-400',
    },
    {
      label: 'Public',
      value: publicCount ?? 0,
      icon: Globe,
      color: 'text-sky-400',
    },
    {
      label: 'Scripts',
      value: totalScripts ?? 0,
      icon: FileText,
      color: 'text-violet-400',
    },
    {
      label: 'Graphics',
      value: totalGraphics ?? 0,
      icon: ImageIcon,
      color: 'text-pink-400',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {greeting}, {name}
        </h1>
        <p className="text-sm text-brand-400 mt-1">Here&apos;s an overview of your content pipeline.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-xl bg-[#0D1117] border border-white/[0.07] px-4 py-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-brand-500 uppercase tracking-wide font-medium">{card.label}</span>
                <Icon size={14} className={card.color} />
              </div>
              <span className={`text-2xl font-bold ${card.color}`}>{card.value}</span>
            </div>
          )
        })}
      </div>

      {/* Recent Stories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Recent Stories</h2>
          <Link
            href="/scenarios"
            className="text-[11px] text-[#C8922A] hover:text-amber-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        {!recentScenarios?.length ? (
          <div className="rounded-xl bg-[#0D1117] border border-white/[0.07] px-5 py-10 text-center">
            <p className="text-brand-400 text-sm">No stories yet.</p>
            <Link href="/scenarios/new" className="text-xs text-[#C8922A] hover:text-amber-300 mt-2 inline-block">
              Create your first story →
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.07] overflow-hidden bg-[#0D1117]">
            {recentScenarios.map((s, i) => (
              <Link
                key={s.id}
                href={`/scenarios/${s.id}`}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group ${
                  i > 0 ? 'border-t border-white/[0.05]' : ''
                }`}
              >
                {/* Status dot */}
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    s.status === 'published'
                      ? 'bg-emerald-400'
                      : s.status === 'in_production'
                      ? 'bg-amber-400'
                      : 'bg-brand-500'
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white group-hover:text-[#C8922A] transition-colors truncate">
                    {s.title}
                  </p>
                  <p className="text-[11px] text-brand-500 truncate mt-0.5">{s.hook}</p>
                </div>

                <span className="text-[11px] text-brand-500 hidden md:block shrink-0 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                  {NICHE_LABELS[s.niche] ?? s.niche}
                </span>
                <ScenarioStatusBadge status={s.status} />
                <span className="text-[11px] text-brand-600 shrink-0 hidden lg:block">
                  {formatDate(s.created_at)}
                </span>
                <svg
                  className="w-3.5 h-3.5 text-brand-600 group-hover:text-brand-300 transition-colors shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
