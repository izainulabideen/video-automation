import { useState, useCallback } from 'react'

interface UseUploadOptions {
  bucket: 'graphics' | 'videos'
  scenarioId: string
  onSuccess?: (fileUrl: string, fileName: string) => void
}

export function useUpload({ bucket, scenarioId, onSuccess }: UseUploadOptions) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const res = await fetch(`/api/upload/${bucket}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, scenarioId }),
      })
      const { uploadUrl, fileUrl } = await res.json() as { uploadUrl: string; fileUrl: string }
      await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      onSuccess?.(fileUrl, file.name)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [bucket, scenarioId, onSuccess])

  return { upload, uploading, error }
}
