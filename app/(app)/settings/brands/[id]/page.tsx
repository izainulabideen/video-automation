import { getSession } from '@/lib/session'
import { getBrand, updateBrand } from '@/actions/brands'
import { getBrandMembers } from '@/actions/brand-members'
import { redirect, notFound } from 'next/navigation'
import { BrandForm } from '@/components/settings/BrandForm'
import { BrandMembers } from '@/components/settings/BrandMembers'
import { createAdminClient } from '@/lib/supabase/admin'

interface Props { params: Promise<{ id: string }> }

export default async function EditBrandPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'admin') redirect('/dashboard')
  const { id } = await params
  const supabase = createAdminClient()
  const [brand, members, allUsersResult] = await Promise.all([
    getBrand(id),
    getBrandMembers(id),
    supabase.from('users').select('id, name, email').order('name').then(r => r.data ?? []),
  ])
  if (!brand) notFound()
  const allUsers = allUsersResult as { id: string; name: string; email: string }[]
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Edit Brand — {brand.name}</h1>
        <p className="text-xs text-brand-400 mt-0.5">Update theme, niches and style</p>
      </div>
      <BrandForm brand={brand} action={async (fd) => { 'use server'; return updateBrand(id, fd) }} actionWithId={updateBrand} />
      <BrandMembers
        brandId={id}
        members={members as unknown as { id: string; user_id: string; users: { name: string; email: string } | null }[]}
        allUsers={allUsers}
      />
    </div>
  )
}
