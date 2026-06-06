'use client'
import { useState } from 'react'
import { upsertScript } from '@/actions/scripts'
import { ScriptWordCount } from './ScriptWordCount'
import type { Database } from '@/types/database'

type Script = Database['public']['Tables']['scripts']['Row']

export function ScriptEditor({ scenarioId, script }: { scenarioId: string; script?: Script }) {
  const [body, setBody] = useState(script?.body ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const fd = new FormData()
    fd.set('body', body)
    await upsertScript(scenarioId, fd)
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <ScriptWordCount text={body} durationSec={script?.duration_sec} />
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={20}
        className="w-full border border-brand-300 rounded-md px-3 py-2 text-sm leading-relaxed focus:ring-2 focus:ring-accent outline-none"
        placeholder="Write or paste the script here…"
      />
      <button onClick={handleSave} disabled={saving}
        className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-h text-sm font-medium disabled:opacity-50">
        {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Script'}
      </button>
    </div>
  )
}
