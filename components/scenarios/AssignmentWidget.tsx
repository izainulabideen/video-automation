'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { assignScenario } from '@/actions/comments'
import { UserCircle, Calendar, X, Check } from 'lucide-react'

interface Props {
  scenarioId: string
  assignedTo: string | null
  dueDate: string | null
  teamMembers: string[]
}

export function AssignmentWidget({ scenarioId, assignedTo: initialAssigned, dueDate: initialDue, teamMembers }: Props) {
  const router = useRouter()
  const [assignedTo, setAssignedTo] = useState(initialAssigned ?? '')
  const [dueDate, setDueDate]       = useState(initialDue ?? '')
  const [saved, setSaved]           = useState(false)
  const [, startTransition]         = useTransition()

  function save() {
    startTransition(async () => {
      await assignScenario(scenarioId, assignedTo || null, dueDate || null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    })
  }

  const isOverdue = dueDate && new Date(dueDate) < new Date() && !saved

  return (
    <div className="space-y-3">
      {/* Assigned to */}
      <div>
        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-1.5">
          <UserCircle size={11} />
          Assigned to
        </label>
        <div className="flex gap-2">
          <input
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            list="team-members-list"
            placeholder="Team member name…"
            className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-sm text-white placeholder-brand-500 focus:border-accent/50 outline-none transition-all"
          />
          <datalist id="team-members-list">
            {teamMembers.map(m => <option key={m} value={m} />)}
          </datalist>
          {assignedTo && (
            <button onClick={() => setAssignedTo('')}
              className="p-2 rounded-lg border border-white/[0.08] text-brand-600 hover:text-danger hover:border-danger/20 transition-all">
              <X size={13} />
            </button>
          )}
        </div>
        {assignedTo && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent/60 to-accent-2/60 flex items-center justify-center text-[9px] font-bold text-white">
              {assignedTo.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-brand-200">{assignedTo}</span>
          </div>
        )}
      </div>

      {/* Due date */}
      <div>
        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-1.5">
          <Calendar size={11} />
          Due Date
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className={`bg-white/[0.04] border rounded-lg px-3 py-2 text-sm text-white focus:border-accent/50 outline-none transition-all ${
            isOverdue ? 'border-danger/40 bg-danger/[0.03]' : 'border-white/[0.09]'
          }`}
        />
        {isOverdue && (
          <p className="text-[10px] text-danger mt-1">Overdue</p>
        )}
      </div>

      {/* Save */}
      <button onClick={save}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
          saved
            ? 'bg-success/15 border border-success/25 text-success'
            : 'bg-white/[0.04] border border-white/[0.09] text-brand-300 hover:bg-white/[0.07] hover:text-white'
        }`}>
        {saved ? <><Check size={11} /> Saved</> : 'Save Assignment'}
      </button>
    </div>
  )
}
