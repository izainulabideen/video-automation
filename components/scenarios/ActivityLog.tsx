import type { ActivityLog } from '@/actions/activity'
import { Clock } from 'lucide-react'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

const ACTION_ICONS: Record<string, string> = {
  'Checked':   '✓',
  'Unchecked': '○',
  'Uploaded':  '↑',
  'Deleted':   '✕',
  'Set cover': '★',
  'Script':    '✎',
  'Status':    '◈',
  'Created':   '✦',
  'Updated':   '✦',
}

function getIcon(action: string): string {
  for (const [key, icon] of Object.entries(ACTION_ICONS)) {
    if (action.startsWith(key)) return icon
  }
  return '·'
}

interface Props {
  logs: ActivityLog[]
}

export function ActivityLogView({ logs }: Props) {
  if (!logs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2">
        <Clock size={18} className="text-brand-600" />
        <p className="text-[11px] text-brand-600">No activity yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {logs.map((log, i) => (
        <div key={log.id} className="flex gap-3 group">
          {/* Timeline */}
          <div className="flex flex-col items-center shrink-0 w-6">
            <div className="w-5 h-5 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mt-0.5">
              <span className="text-[9px] text-brand-400">{getIcon(log.action)}</span>
            </div>
            {i < logs.length - 1 && (
              <div className="w-px flex-1 bg-white/[0.04] mt-1 mb-1" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-4">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[12px] font-medium text-brand-200">{log.user_name}</span>
              <span className="text-[11px] text-brand-400">{log.action}</span>
            </div>
            {log.details && (
              <p className="text-[11px] text-brand-600 mt-0.5">{log.details}</p>
            )}
            <p className="text-[10px] text-brand-700 mt-0.5">{timeAgo(log.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
