import { parsePhotoDate } from '../utils/date'

export type PhotoSource = 'file' | 'upload' | 'supabase'

export interface Photo {
  id: string
  src: string
  filename: string
  date: Date | null
  storagePath: string | null
  source: PhotoSource
}

const files = import.meta.glob('../../pictures/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const photos: Photo[] = Object.entries(files)
  .map(([path, src]) => {
    const filename = path.split('/').pop() ?? path
    return {
      id: `file:${filename}`,
      src,
      filename,
      date: parsePhotoDate(filename),
      storagePath: null,
      source: 'file' as const,
    }
  })
  .sort((a, b) => {
    if (!a.date && !b.date) return a.filename.localeCompare(b.filename)
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.getTime() - a.date.getTime()
  })