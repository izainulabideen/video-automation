'use client'
import { useState } from 'react'

interface ConfirmDialogProps {
  title: string
  description: string
  onConfirm: () => void | Promise<void>
  children: React.ReactNode
}

export function ConfirmDialog({ title, description, onConfirm, children }: ConfirmDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await onConfirm()
    setLoading(false)
    setOpen(false)
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg border border-brand-300 p-6 max-w-sm w-full mx-4">
            <h3 className="text-sm font-semibold text-brand-900">{title}</h3>
            <p className="mt-2 text-sm text-brand-700">{description}</p>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => setOpen(false)}
                className="border border-brand-300 rounded-md px-4 py-2 hover:bg-brand-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="bg-danger text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
