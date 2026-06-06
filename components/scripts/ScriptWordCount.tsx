export function ScriptWordCount({ text, durationSec }: { text: string; durationSec?: number | null }) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const estimated = Math.round(words / 2.5)
  return (
    <div className="flex gap-4 text-xs text-brand-500">
      <span><strong className="text-brand-900">{words}</strong> words</span>
      <span><strong className="text-brand-900">{estimated}s</strong> estimated</span>
      {durationSec && <span><strong className="text-brand-900">{durationSec}s</strong> saved</span>}
    </div>
  )
}
