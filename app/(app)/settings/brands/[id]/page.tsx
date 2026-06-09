import { getSession } from '@/lib/session'
import { getBrand, updateBrand } from '@/actions/brands'
import { redirect, notFound } from 'next/navigation'
import { BrandForm } from '@/components/settings/BrandForm'

interface Props { params: Promise<{ id: string }> }

export default async function EditBrandPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'admin') redirect('/dashboard')
  const { id } = await params
  const brand = await getBrand(id)
  if (!brand) notFound()
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Edit Brand — {brand.name}</h1>
        <p className="text-xs text-brand-400 mt-0.5">Update theme, niches and style</p>
      </div>
      <BrandForm brand={brand} action={async (fd) => { 'use server'; return updateBrand(id, fd) }} actionWithId={updateBrand} />
    </div>
  )
}
