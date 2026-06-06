'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { createGraphicRecord } from '@/actions/graphics'

export function GraphicsUploader({ scenarioId }: { scenarioId: string }) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (files: File[]) => {
    setUploading(true)
    for (const file of files) {
      const res = await fetch('/api/upload/graphics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, scenarioId }),
      })
      const { uploadUrl, fileUrl } = await res.json() as { uploadUrl: string; fileUrl: string }
      await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      await createGraphicRecord({
        scenarioId,
        fileUrl,
        fileName: file.name,
        fileSizeKb: Math.round(file.size / 1024),
      })
    }
    setUploading(false)
  }, [scenarioId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } })

  return (
    <div {...getRootProps()} className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${isDragActive ? 'border-accent bg-accent/5' : 'border-brand-300 hover:border-accent'}`}>
      <input {...getInputProps()} />
      <p className="text-sm text-brand-500">{uploading ? 'Uploading…' : 'Drop images here or click to upload'}</p>
    </div>
  )
}
