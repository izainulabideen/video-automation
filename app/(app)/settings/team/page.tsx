import { createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { InviteForm } from '@/components/settings/InviteForm'
import { formatDate } from '@/lib/utils'
import type { AppTables } from '@/types/app-tables'

type UserRow = AppTables['users']['Row']

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const colors = ['from-purple-500 to-indigo-600', 'from-amber-500 to-orange-600', 'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
      <span className="text-[11px] font-bold text-white">{initials}</span>
    </div>
  )
}

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
    <div className="max-w-3xl">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-white">Team Members</h1>
        <p className="text-xs text-brand-400 mt-0.5">Manage who has access to Veank Studio</p>
      </div>

      <div className="rounded-xl border border-white/[0.07] overflow-hidden bg-[#0D1117] mb-8">
        {!users?.length ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <p className="text-brand-400 text-sm">No team members yet</p>
            <p className="text-brand-600 text-xs mt-1">Invite someone below</p>
          </div>
        ) : users.map((user, i) => (
          <div key={user.id} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? 'border-t border-white/[0.05]' : ''}`}>
            <Avatar name={user.name} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white">{user.name}</p>
              <p className="text-[11px] text-brand-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`text-[11px] px-2.5 py-1 rounded-full border capitalize font-medium ${
                user.role === 'admin'
                  ? 'bg-accent/10 text-accent border-accent/20'
                  : 'bg-white/[0.04] text-brand-300 border-white/[0.08]'
              }`}>{user.role}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                user.is_active
                  ? 'bg-success/10 text-success border-success/20'
                  : 'bg-white/[0.04] text-brand-500 border-white/[0.07]'
              }`}>{user.is_active ? 'Active' : 'Inactive'}</span>
              <span className="text-[11px] text-brand-600 hidden lg:block">{formatDate(user.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] p-6">
        <h2 className="text-sm font-bold text-white mb-1">Invite Member</h2>
        <p className="text-[11px] text-brand-400 mb-5">Send an invitation to join the studio</p>
        <InviteForm />
      </div>
    </div>
  )
}
