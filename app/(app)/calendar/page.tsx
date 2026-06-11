import { createAdminClient } from '@/lib/supabase/admin'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'
import { Calendar } from 'lucide-react'

export const revalidate = 0

interface Props {
  searchParams: Promise<{ month?: string; year?: string }>
}

export default async function CalendarPage({ searchParams }: Props) {
  const params = await searchParams
  const now    = new Date()
  const year   = parseInt(params.year  ?? String(now.getFullYear()))
  const month  = parseInt(params.month ?? String(now.getMonth() + 1)) // 1-indexed

  const monthStart = new Date(year, month - 1, 1).toISOString().slice(0, 10)
  const monthEnd   = new Date(year, month, 0).toISOString().slice(0, 10)   // last day

  const db = createAdminClient()

  // Scenarios with due_date in this month
  const [
    { data: dueScenarios },
    { data: publishedVideos },
  ] = await Promise.all([
    db.from('scenarios')
      .select('id, title, status, niche, due_date, assigned_to')
      .gte('due_date', monthStart)
      .lte('due_date', monthEnd)
      .not('due_date', 'is', null),
    db.from('videos')
      .select('scenario_id, publish_date, scenarios!inner(id, title, niche, status)')
      .gte('publish_date', monthStart)
      .lte('publish_date', monthEnd)
      .not('publish_date', 'is', null),
  ])

  type VideoRow = {
    scenario_id: string
    publish_date: string
    scenarios: { id: string; title: string; niche: string; status: string } | { id: string; title: string; niche: string; status: string }[]
  }

  // Merge into events
  const events = [
    ...(dueScenarios ?? []).map(s => ({
      id:     `due-${s.id}`,
      date:   s.due_date as string,
      type:   'due' as const,
      title:  s.title,
      niche:  s.niche,
      status: s.status,
      href:   `/scenarios/${s.id}`,
      sub:    s.assigned_to ?? undefined,
    })),
    ...((publishedVideos ?? []) as VideoRow[]).map(v => {
      const sc = Array.isArray(v.scenarios) ? v.scenarios[0] : v.scenarios
      return {
        id:     `pub-${v.scenario_id}`,
        date:   v.publish_date,
        type:   'publish' as const,
        title:  sc?.title ?? 'Video',
        niche:  sc?.niche ?? '',
        status: sc?.status ?? '',
        href:   `/scenarios/${sc?.id ?? v.scenario_id}`,
        sub:    undefined,
      }
    }),
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Calendar size={15} className="text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Content Calendar</h1>
          <p className="text-xs text-brand-400 mt-0.5">Due dates and publish schedules</p>
        </div>
      </div>
      {events.length === 0 && (
        <p className="text-[13px] text-brand-400 mb-4">
          Nothing scheduled this month. Set a due date on a scenario or a publish date on a video and it will appear here.
        </p>
      )}
      <CalendarGrid year={year} month={month} events={events} />
    </div>
  )
}
