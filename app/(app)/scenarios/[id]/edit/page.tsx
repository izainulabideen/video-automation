import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ScenarioForm } from '@/components/scenarios/ScenarioForm'
import { updateScenario } from '@/actions/scenarios'

interface Props { params: Promise<{ id: string }> }

export default async function EditScenarioPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: scenario } = await supabase.from('scenarios').select('*').eq('id', id).single()
  if (!scenario) notFound()

  async function update(fd: FormData) {
    'use server'
    return updateScenario(id, fd)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-900 tracking-tight mb-6">Edit Scenario</h1>
      <ScenarioForm action={update} defaultValues={scenario} submitLabel="Save Changes" />
    </div>
  )
}
