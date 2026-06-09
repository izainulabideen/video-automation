import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ScenarioForm } from '@/components/scenarios/ScenarioForm'
import { updateScenario } from '@/actions/scenarios'
import { getBrands } from '@/actions/brands'

interface Props { params: Promise<{ id: string }> }

export default async function EditScenarioPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const [{ data: scenario }, brands] = await Promise.all([
    supabase.from('scenarios').select('*').eq('id', id).single(),
    getBrands(),
  ])
  if (!scenario) notFound()

  async function update(fd: FormData) {
    'use server'
    return updateScenario(id, fd)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white tracking-tight mb-6">Edit Scenario</h1>
      <ScenarioForm action={update} defaultValues={scenario} submitLabel="Save Changes" brands={brands.filter(b => b.is_active)} />
    </div>
  )
}
