import { createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { InviteForm } from '@/components/settings/InviteForm'
import { formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { AppTables } from '@/types/app-tables'

type UserRow = AppTables['users']['Row']

export default async function TeamPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'admin') redirect('/dashboard')

  const db = createAdminClient()
  const { data: users } = await db
    .from('users')
    .select('id, name, email, role, is_active, created_at')
    .order('created_at') as { data: Pick<UserRow, 'id' | 'name' | 'email' | 'role' | 'is_active' | 'created_at'>[] | null }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-brand-900 tracking-tight">Team Members</h1>
      </div>

      <div className="bg-white rounded-lg border border-brand-300 mb-8">
        {users?.map((user, i) => (
          <div key={user.id} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? 'border-t border-brand-100' : ''}`}>
            <div>
              <p className="text-sm font-medium text-brand-900">{user.name}</p>
              <p className="text-xs text-brand-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-brand-500 capitalize">{user.role}</span>
              <StatusBadge status={user.is_active ? 'published' : 'draft'} />
              <span className="text-xs text-brand-500">{formatDate(user.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-md">
        <h2 className="text-lg font-semibold text-brand-900 mb-4">Invite Member</h2>
        <InviteForm />
      </div>
    </div>
  )
}
