import { cn } from '@/lib/utils'

const styles: Record<string, string> = {
  draft:         'bg-white/[0.05] text-brand-300 border border-white/[0.08]',
  in_production: 'bg-warning/10 text-warning border border-warning/20',
  published:     'bg-success/10 text-success border border-success/20',
  editing:       'bg-info/10 text-info border border-info/20',
  exported:      'bg-accent/10 text-accent border border-accent/20',
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
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium',
      styles[status] ?? 'bg-white/[0.05] text-brand-300 border border-white/[0.08]'
    )}>
      {labels[status] ?? status}
    </span>
  )
}
