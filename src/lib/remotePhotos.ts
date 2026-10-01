import type { Photo } from '../data/photos'
import { PHOTO_BUCKET, supabase } from './supabase'

interface RemoteRow {
  id: string
  storage_path: string
  file_name: string
  taken_at: string
}

export async function fetchRemotePhotos(): Promise<Photo[]> {
  if (!supabase) return []
  const client = supabase
  const { data, error } = await client
    .from('photos')
    .select('id, storage_path, file_name, taken_at')
    .order('taken_at', { ascending: false })

  if (error) throw new Error(error.message)

  return ((data ?? []) as RemoteRow[]).map((row) => ({
    id: row.id,
    src: client.storage.from(PHOTO_BUCKET).getPublicUrl(row.storage_path).data.publicUrl,
    filename: row.file_name,
    date: new Date(row.taken_at),
    storagePath: row.storage_path,
    source: 'supabase' as const,
  }))
}

export async function uploadRemotePhoto(file: File, date: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`

  const { error: uploadError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (uploadError) throw new Error(uploadError.message)

  const { error: insertError } = await supabase.from('photos').insert({
    storage_path: path,
    file_name: file.name,
    taken_at: new Date(`${date}T12:00:00`).toISOString(),
  })
  if (insertError) {
    await supabase.storage.from(PHOTO_BUCKET).remove([path])
    throw new Error(insertError.message)
  }
}

export async function deleteRemotePhoto(photo: Photo): Promise<void> {
  if (!supabase || !photo.storagePath) return
  const { error: storageError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .remove([photo.storagePath])
  if (storageError) throw new Error(storageError.message)

  const { error: rowError } = await supabase.from('photos').delete().eq('id', photo.id)
  if (rowError) throw new Error(rowError.message)
}