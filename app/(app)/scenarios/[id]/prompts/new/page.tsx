import { PromptForm } from '@/components/prompts/PromptForm'
import { createPrompt } from '@/actions/prompts'

interface Props { params: Promise<{ id: string }> }

export default async function NewPromptPage({ params }: Props) {
  const { id } = await params

  async function create(fd: FormData) {
    'use server'
    fd.set('scenario_id', id)
    return createPrompt(fd)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-900 tracking-tight mb-6">Add Prompt</h1>
      <PromptForm action={create} scenarioId={id} />
    </div>
  )
}
