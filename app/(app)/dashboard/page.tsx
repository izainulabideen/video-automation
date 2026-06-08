import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ScenarioStatusBadge } from '@/components/scenarios/ScenarioStatusBadge'
import { formatDate } from '@/lib/utils'
import { NICHE_LABELS, NICHE_COLORS, NICHES } from '@/lib/constants'
import { getSession } from '@/lib/session'
import { BookOpen, CheckCircle, Clapperboard, FileText, Globe, ImageIcon, TrendingUp, Clock, Zap } from 'lucide-react'

export const revalidate = 60

function getGreeting(hour: number) {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function MiniBar({ value, max, color = '#C8922A' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[11px] text-brand-500 tabular-nums w-5 text-right">{value}</span>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: number; icon: React.ElementType; color: string; sub?: string
}) {
  return (
    <div className="rounded-xl bg-[#0D1117] border border-white/[0.07] px-4 py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-brand-500 uppercase tracking-wide font-medium">{label}</span>
        <Icon size={14} className={color} />
      </div>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      {sub && <span className="text-[10px] text-brand-600">{sub}</span>}
    </div>
  )
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m    = Math.floor(diff / 60000)
  const h    = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (m < 1)    return 'just now'
  if (m < 60)   return `${m}m ago`
  if (h < 24)   return `${h}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString()
}

export default async function DashboardPage() {
  const supabase = createAdminClient()
  const session  = await getSession()
  const hour     = new Date().getHours()
  const name     = session?.name ?? 'there'

  const now    = new Date()
  const d7ago  = new Date(now.getTime() -  7 * 86400000).toISOString()
  const d30ago = new Date(now.getTime() - 30 * 86400000).toISOString()

  const [
    { count: total },
    { count: drafts },
    { count: inProd },
    { count: published },
    { count: scripts },
    { count: graphics },
    { count: publicCount },
    { count: last7 },
    { count: last30 },
    { data: allScenarios },
    { data: recentScenarios },
    { data: recentActivity },
    { data: overdue },
  ] = await Promise.all([
    supabase.from('scenarios').select('*', { count: 'exact', head: true }),
    supabase.from('scenarios').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('scenarios').select('*', { count: 'exact', head: true }).eq('status', 'in_production'),
    supabase.from('scenarios').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('scripts').select('*', { count: 'exact', head: true }),
    supabase.from('graphics').select('*', { count: 'exact', head: true }),
    supabase.from('public_settings').select('*', { count: 'exact', head: true }).eq('is_public', true),
    supabase.from('scenarios').select('*', { count: 'exact', head: true }).gte('created_at', d7ago),
    supabase.from('scenarios').select('*', { count: 'exact', head: true }).gte('created_at', d30ago),
    supabase.from('scenarios').select('niche, status'),
    supabase.from('scenarios').select('id, title, niche, hook, status, created_at').order('created_at', { ascending: false }).limit(6),
    supabase.from('activity_logs').select('id, user_name, action, created_at').order('created_at', { ascending: false }).limit(8),
    supabase.from('scenarios').select('id, title, due_date, assigned_to')
      .lt('due_date', now.toISOString().slice(0, 10))
      .neq('status', 'published')
      .not('due_date', 'is', null)
      .order('due_date')
      .limit(5),
  ])

  const totalN     = total ?? 0
  const publishPct = totalN > 0 ? Math.round(((published ?? 0) / totalN) * 100) : 0
  const scriptPct  = totalN > 0 ? Math.round(((scripts  ?? 0) / totalN) * 100) : 0

  const nicheStats = NICHES.map(niche => ({
    niche,
    count:     (allScenarios ?? []).filter(s => s.niche === niche).length,
    published: (allScenarios ?? []).filter(s => s.niche === niche && s.status === 'published').length,
  })).filter(n => n.count > 0).sort((a, b) => b.count - a.count)
  const maxNiche = nicheStats[0]?.count ?? 1

  const statCards = [
    { label: 'Total',         value: totalN,           icon: BookOpen,     color: 'text-[#C8922A]',   sub: `${last7 ?? 0} this week` },
    { label: 'Published',     value: published ?? 0,   icon: CheckCircle,  color: 'text-emerald-400', sub: `${publishPct}% of total` },
    { label: 'In Production', value: inProd ?? 0,      icon: Clapperboard, color: 'text-amber-400',   sub: undefined },
    { label: 'Drafts',        value: drafts ?? 0,      icon: FileText,     color: 'text-brand-400',   sub: undefined },
    { label: 'Public',        value: publicCount ?? 0, icon: Globe,        color: 'text-sky-400',     sub: undefined },
    { label: 'Scripts',       value: scripts ?? 0,     icon: FileText,     color: 'text-violet-400',  sub: `${scriptPct}% coverage` },
    { label: 'Graphics',      value: graphics ?? 0,    icon: ImageIcon,    color: 'text-pink-400',    sub: undefined },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{getGreeting(hour)}, {name}</h1>
        <p className="text-sm text-brand-400 mt-1">
          {last30 ?? 0} stories created in the last 30 days
          {(overdue?.length ?? 0) > 0 && (
            <span className="ml-2 text-danger font-medium">· {overdue!.length} overdue</span>
          )}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        {statCards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Analytics row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Pipeline funnel */}
        <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-accent" />
            <h2 className="text-sm font-semibold text-white">Pipeline</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Drafts',        value: drafts    ?? 0, color: '#6B7280' },
              { label: 'In Production', value: inProd    ?? 0, color: '#F59E0B' },
              { label: 'Published',     value: published ?? 0, color: '#10B981' },
            ].map(stage => (
              <div key={stage.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-brand-400">{stage.label}</span>
                </div>
                <MiniBar value={stage.value} max={totalN} color={stage.color} />
              </div>
            ))}
            <div className="pt-3 border-t border-white/[0.05] grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-brand-600 mb-0.5">Publish rate</p>
                <p className="text-lg font-bold text-emerald-400">{publishPct}%</p>
              </div>
              <div>
                <p className="text-[10px] text-brand-600 mb-0.5">Script coverage</p>
                <p className="text-lg font-bold text-violet-400">{scriptPct}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Niche breakdown */}
        <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-accent" />
            <h2 className="text-sm font-semibold text-white">By Niche</h2>
          </div>
          {nicheStats.length === 0 ? (
            <p className="text-[11px] text-brand-600 mt-8 text-center">No data yet</p>
          ) : (
            <div className="space-y-2.5">
              {nicheStats.slice(0, 7).map(n => (
                <div key={n.niche}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${NICHE_COLORS[n.niche] ?? 'text-brand-400 bg-white/[0.03] border-white/[0.06]'}`}>
                      {NICHE_LABELS[n.niche] ?? n.niche}
                    </span>
                    <span className="text-[10px] text-brand-600 ml-2 shrink-0">
                      {n.published}/{n.count} pub
                    </span>
                  </div>
                  <MiniBar value={n.count} max={maxNiche} color="#C8922A" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-accent" />
            <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
          </div>
          {!recentActivity?.length ? (
            <p className="text-[11px] text-brand-600 mt-8 text-center">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map(log => (
                <div key={log.id} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent/40 to-accent-2/40 flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5">
                    {log.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-brand-300 leading-snug">
                      <span className="font-medium text-brand-200">{log.user_name}</span>{' '}{log.action}
                    </p>
                    <p className="text-[10px] text-brand-700">{timeAgo(log.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overdue alert */}
      {(overdue?.length ?? 0) > 0 && (
        <div className="mb-6 bg-danger/[0.04] border border-danger/20 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-danger mb-3 flex items-center gap-2">
            <Clock size={13} /> {overdue!.length} Overdue {overdue!.length === 1 ? 'Story' : 'Stories'}
          </h3>
          <div className="space-y-1">
            {overdue!.map(s => (
              <Link key={s.id} href={`/scenarios/${s.id}`}
                className="flex items-center gap-3 text-sm hover:bg-white/[0.02] rounded-lg px-2 py-1.5 transition-colors group">
                <span className="text-brand-200 group-hover:text-white transition-colors truncate flex-1">{s.title}</span>
                {s.assigned_to && <span className="text-[11px] text-brand-500 shrink-0">{s.assigned_to as string}</span>}
                <span className="text-[11px] text-danger shrink-0">
                  Due {new Date(s.due_date as string).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Stories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Recent Stories</h2>
          <Link href="/scenarios" className="text-[11px] text-accent hover:text-accent-2 transition-colors">View all →</Link>
        </div>
        {!recentScenarios?.length ? (
          <div className="rounded-xl bg-[#0D1117] border border-white/[0.07] px-5 py-10 text-center">
            <p className="text-brand-400 text-sm">No stories yet.</p>
            <Link href="/scenarios/new" className="text-xs text-accent hover:text-accent-2 mt-2 inline-block">Create your first story →</Link>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.07] overflow-hidden bg-[#0D1117]">
            {recentScenarios.map((s, i) => (
              <Link key={s.id} href={`/scenarios/${s.id}`}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group ${i > 0 ? 'border-t border-white/[0.05]' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  s.status === 'published' ? 'bg-emerald-400' :
                  s.status === 'in_production' ? 'bg-amber-400' : 'bg-brand-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white group-hover:text-accent transition-colors truncate">{s.title}</p>
                  <p className="text-[11px] text-brand-500 truncate mt-0.5">{s.hook}</p>
                </div>
                <span className={`text-[11px] hidden md:block shrink-0 px-2.5 py-1 rounded-full border ${NICHE_COLORS[s.niche] ?? 'text-brand-400 bg-white/[0.03] border-white/[0.06]'}`}>
                  {NICHE_LABELS[s.niche] ?? s.niche}
                </span>
                <ScenarioStatusBadge status={s.status} />
                <span className="text-[11px] text-brand-600 shrink-0 hidden lg:block">{formatDate(s.created_at)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
