import { StatusBadge } from '@/components/shared/StatusBadge'

export function ScenarioStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} />
}
