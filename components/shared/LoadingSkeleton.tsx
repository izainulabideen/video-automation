import { cn } from '@/lib/utils'

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-brand-100 rounded-md', className)} />
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-brand-300 p-5 space-y-3">
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-3 w-1/2" />
      <LoadingSkeleton className="h-3 w-2/3" />
    </div>
  )
}
