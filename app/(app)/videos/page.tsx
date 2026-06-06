import { createServerClient } from '@/lib/supabase/server'
import { VideoCard } from '@/components/videos/VideoCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { STATUS_OPTIONS } from '@/lib/constants'
import Link from 'next/link'

export const revalidate = 120

interface Props { searchParams: Promise<{ status?: string }> }

export default async function VideosPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createServerClient()

  let query = supabase
    .from('videos')
    .select('id, file_url, platform_urls, duration_sec, status, publish_date, performance, notes, scenario_id, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(50)
  if (params.status) query = query.eq('status', params.status)

  const { data: videos } = await query

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-900 tracking-tight mb-6">Video Library</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ value: '', label: 'All' }, ...STATUS_OPTIONS].map(s => (
          <Link key={s.value} href={`/videos${s.value ? `?status=${s.value}` : ''}`}
            className={`text-sm px-3 py-1.5 rounded-md border ${params.status === s.value || (!params.status && !s.value) ? 'bg-accent text-white border-accent' : 'border-brand-300 hover:bg-brand-100'}`}>
            {s.label}
          </Link>
        ))}
      </div>
      {!videos?.length ? (
        <EmptyState title="No videos yet" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map(v => <VideoCard key={v.id} video={v as any} />)}
        </div>
      )}
    </div>
  )
}
