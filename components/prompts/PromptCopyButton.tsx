'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function PromptCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy}
      className="border border-brand-300 rounded-md p-1.5 hover:bg-brand-100 text-brand-500">
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}
