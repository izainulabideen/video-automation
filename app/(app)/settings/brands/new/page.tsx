import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { BrandForm } from '@/components/settings/BrandForm'

export default async function NewBrandPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'admin') redirect('/dashboard')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">New Brand</h1>
        <p className="text-xs text-brand-400 mt-0.5">Create an independent content channel with its own theme</p>
      </div>
      <BrandForm />
    </div>
  )
}
