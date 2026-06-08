'use client'
import { useState } from 'react'
import { NICHES, NICHE_LABELS } from '@/lib/constants'

const inputCls = 'w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-brand-500 focus:border-accent/50 focus:bg-white/[0.06] transition-all outline-none'
const labelCls = 'block text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-1.5'

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
]

export default function DefaultSettingsPage() {
  const [msg, setMsg]   = useState('')
  const [err, setErr]   = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true); setMsg(''); setErr('')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/settings/defaults', {
        method: 'POST',
        body: fd,
      })
      const json = await res.json() as { success: boolean; error?: string }
      if (json.success) setMsg('Settings saved.')
      else setErr(json.error ?? 'Error saving settings')
    } catch {
      setErr('Network error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Default Settings</h1>
        <p className="text-xs text-brand-400 mt-0.5">Preferences applied when creating new scenarios</p>
      </div>

      <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelCls}>Default Niche</label>
            <select name="default_niche" className={inputCls}>
              <option value="" className="bg-[#111827]">None (always ask)</option>
              {NICHES.map(n => (
                <option key={n} value={n} className="bg-[#111827]">{NICHE_LABELS[n] ?? n}</option>
              ))}
            </select>
            <p className="text-[11px] text-brand-600 mt-1.5">Pre-selected niche when creating a new story.</p>
          </div>

          <div>
            <label className={labelCls}>Timezone</label>
            <select name="timezone" className={inputCls}>
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz} className="bg-[#111827]">{tz}</option>
              ))}
            </select>
            <p className="text-[11px] text-brand-600 mt-1.5">Used for due date display and calendar events.</p>
          </div>

          {err && <p className="text-xs text-danger">{err}</p>}
          {msg && <p className="text-xs text-success">{msg}</p>}

          <button type="submit" disabled={busy}
            className="bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all">
            {busy ? 'Saving…' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  )
}
