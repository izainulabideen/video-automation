import { cn } from '@/lib/utils'

const styles: Record<string, string> = {
  draft:         'bg-brand-100 text-brand-700',
  in_production: 'bg-yellow-100 text-yellow-800',
  published:     'bg-green-100 text-green-800',
  editing:       'bg-blue-100 text-blue-800',
  exported:      'bg-purple-100 text-purple-800',
}

const labels: Record<string, string> = {
  draft:         'Draft',
  in_production: 'In Production',
  published:     'Published',
  editing:       'Editing',
  exported:      'Exported',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      styles[status] ?? 'bg-brand-100 text-brand-700'
    )}>
      {labels[status] ?? status}
    </span>
  )
}
