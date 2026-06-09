'use client'
import { useState, useTransition } from 'react'
import { addBrandMember, removeBrandMember } from '@/actions/brand-members'
import { UserPlus, Trash2 } from 'lucide-react'

type Member = {
  id: string
  user_id: string
  users: { name: string; email: string } | null
}

type User = {
  id: string
  name: string
  email: string
}

interface Props {
  brandId: string
  members: Member[]
  allUsers: User[]
}

export function BrandMembers({ brandId, members: initialMembers, allUsers }: Props) {
  const [members, setMembers] = useState(initialMembers)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const memberUserIds = new Set(members.map(m => m.user_id))
  const availableUsers = allUsers.filter(u => !memberUserIds.has(u.id))

  function handleAdd() {
    if (!selectedUserId) return
    setError(null)
    startTransition(async () => {
      const result = await addBrandMember(brandId, selectedUserId)
      if (!result.success) {
        setError(result.error)
        return
      }
      const user = allUsers.find(u => u.id === selectedUserId)
      if (user) {
        setMembers(prev => [...prev, {
          id: crypto.randomUUID(),
          user_id: selectedUserId,
          users: { name: user.name, email: user.email },
        }])
      }
      setSelectedUserId('')
    })
  }

  function handleRemove(memberId: string) {
    setError(null)
    startTransition(async () => {
      const result = await removeBrandMember(memberId, brandId)
      if (!result.success) {
        setError(result.error)
        return
      }
      setMembers(prev => prev.filter(m => m.id !== memberId))
    })
  }

  const inputCls = 'bg-white/[0.04] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-brand-500 focus:border-accent/50 focus:bg-white/[0.06] transition-all'

  return (
    <div className="mt-10">
      <h2 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">Brand Members</h2>

      {members.length === 0 ? (
        <p className="text-sm text-brand-500 mb-4">No members assigned yet.</p>
      ) : (
        <ul className="space-y-2 mb-5">
          {members.map(m => (
            <li key={m.id} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.07] rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">{m.users?.name ?? '—'}</p>
                <p className="text-xs text-brand-400">{m.users?.email ?? ''}</p>
              </div>
              <button
                onClick={() => handleRemove(m.id)}
                disabled={isPending}
                className="text-brand-500 hover:text-red-400 transition-colors p-1 rounded"
                aria-label="Remove member"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {availableUsers.length > 0 && (
        <div className="flex items-center gap-3">
          <select
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
            className={`${inputCls} flex-1`}
          >
            <option value="" className="bg-[#111827]">Select user to add…</option>
            {availableUsers.map(u => (
              <option key={u.id} value={u.id} className="bg-[#111827]">{u.name} — {u.email}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!selectedUserId || isPending}
            className="flex items-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 rounded-lg px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-50"
          >
            <UserPlus size={14} />
            Add
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}
