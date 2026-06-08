import { ScenarioForm } from '@/components/scenarios/ScenarioForm'
import { createScenario } from '@/actions/scenarios'
import { getBrands } from '@/actions/brands'

export default async function NewScenarioPage() {
  const brands = await getBrands()
  const activeB = brands.filter(b => b.is_active)

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-bold text-white">New Story</h1>
        <p className="text-xs text-brand-400 mt-0.5">Create a new scenario</p>
      </div>
      <ScenarioForm action={createScenario} submitLabel="Create Story" showTemplates brands={activeB} />
    </div>
  )
}
