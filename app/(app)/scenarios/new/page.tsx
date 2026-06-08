import { ScenarioForm } from '@/components/scenarios/ScenarioForm'
import { createScenario } from '@/actions/scenarios'

export default function NewScenarioPage() {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-bold text-white">New Story</h1>
        <p className="text-xs text-brand-400 mt-0.5">Create a new finance scenario</p>
      </div>
      <ScenarioForm action={createScenario} submitLabel="Create Story" />
    </div>
  )
}
