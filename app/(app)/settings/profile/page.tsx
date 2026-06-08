'use client'
import { useState } from 'react'
import { updateProfile, updatePassword } from '@/actions/profile'

const inputCls = 'w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-brand-500 focus:border-accent/50 focus:bg-white/[0.06] transition-all outline-none'
const labelCls = 'block text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-1.5'

function ProfileForm() {
  const [msg, setMsg]   = useState('')
  const [err, setErr]   = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(fd: FormData) {
    setBusy(true); setMsg(''); setErr('')
    const result = await updateProfile(fd)
    setBusy(false)
    if (result.success) setMsg('Name updated.')
    else setErr(result.error ?? 'Error')
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className={labelCls}>Display Name</label>
        <input name="name" required placeholder="Your name" className={inputCls} />
      </div>
      {err && <p className="text-xs text-danger">{err}</p>}
      {msg && <p className="text-xs text-success">{msg}</p>}
      <button type="submit" disabled={busy}
        className="bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all">
        {busy ? 'Saving…' : 'Update Name'}
      </button>
    </form>
  )
}

function PasswordForm() {
  const [msg, setMsg]   = useState('')
  const [err, setErr]   = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(fd: FormData) {
    setBusy(true); setMsg(''); setErr('')
    const result = await updatePassword(fd)
    setBusy(false)
    if (result.success) setMsg('Password changed successfully.')
    else setErr(result.error ?? 'Error')
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className={labelCls}>Current Password</label>
        <input name="current_password" type="password" required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>New Password</label>
        <input name="new_password" type="password" required minLength={8} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Confirm New Password</label>
        <input name="confirm_password" type="password" required minLength={8} className={inputCls} />
      </div>
      {err && <p className="text-xs text-danger">{err}</p>}
      {msg && <p className="text-xs text-success">{msg}</p>}
      <button type="submit" disabled={busy}
        className="bg-gradient-to-r from-accent to-accent-h text-white rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all">
        {busy ? 'Changing…' : 'Change Password'}
      </button>
    </form>
  )
}

export default function ProfilePage() {
  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Profile</h1>
        <p className="text-xs text-brand-400 mt-0.5">Update your name and password</p>
      </div>

      <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] p-6 mb-5">
        <h2 className="text-sm font-semibold text-white mb-5">Display Name</h2>
        <ProfileForm />
      </div>

      <div className="bg-[#0D1117] rounded-xl border border-white/[0.07] p-6">
        <h2 className="text-sm font-semibold text-white mb-5">Change Password</h2>
        <PasswordForm />
      </div>
    </div>
  )
}
