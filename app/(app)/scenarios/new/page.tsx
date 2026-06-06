import { ScenarioForm } from '@/components/scenarios/ScenarioForm'
import { createScenario } from '@/actions/scenarios'

export default function NewScenarioPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-900 tracking-tight mb-6">New Scenario</h1>
      <ScenarioForm action={createScenario} submitLabel="Create Scenario" />
    </div>
  )
}
