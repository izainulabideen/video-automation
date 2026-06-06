import { StatusBadge } from '@/components/shared/StatusBadge'
import type { ScenarioStatus } from '@/types/app'

export function ScenarioStatusBadge({ status }: { status: ScenarioStatus }) {
  return <StatusBadge status={status} />
}
