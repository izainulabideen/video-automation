import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import type { Database } from '@/types/database'

type Video = Database['public']['Tables']['videos']['Row']

export function VideoCard({ video, scenarioTitle }: { video: Video; scenarioTitle?: string }) {
  const platforms = video.platform_urls as Record<string, string> | null
  return (
    <div className="bg-white rounded-lg border border-brand-300 p-5">
      <div className="flex items-start justify-between mb-2">
        <div>
          {scenarioTitle && <p className="text-sm font-medium text-brand-900">{scenarioTitle}</p>}
          <StatusBadge status={video.status} />
        </div>
        {video.duration_sec && (
          <span className="text-xs text-brand-500">{video.duration_sec}s</span>
        )}
      </div>
      {platforms && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {Object.entries(platforms).filter(([, v]) => v).map(([k, v]) => (
            <a key={k} href={v} target="_blank" rel="noopener noreferrer"
              className="text-xs text-accent-2 underline capitalize">{k}</a>
          ))}
        </div>
      )}
      {video.publish_date && (
        <p className="mt-2 text-xs text-brand-500">Published {formatDate(video.publish_date)}</p>
      )}
    </div>
  )
}
