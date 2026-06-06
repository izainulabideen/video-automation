import { createServerClient } from './server'

export async function getPresignedUploadUrl(
  bucket: string,
  path: string,
): Promise<{ uploadUrl: string; fileUrl: string } | { error: string }> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path)
  if (error) return { error: error.message }
  const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
  return { uploadUrl: data.signedUrl, fileUrl }
}

export async function deleteStorageFile(bucket: string, path: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  return error ? { error: error.message } : { success: true }
}
