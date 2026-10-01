import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { photos as diskPhotos } from '../data/photos'
import type { Photo } from '../data/photos'
import { listUploads, removeUpload, saveUpload } from '../lib/db'
import type { UploadedPhoto } from '../lib/db'
import { deleteRemotePhoto, fetchRemotePhotos, uploadRemotePhoto } from '../lib/remotePhotos'
import { describeError, isSupabaseConfigured } from '../lib/supabase'

interface Library {
  photos: Photo[]
  uploadCount: number
  loading: boolean
  error: string | null
  configured: boolean
  setError: (message: string | null) => void
  addPhoto: (file: File, date: string) => Promise<void>
  deletePhoto: (photo: Photo) => Promise<void>
}

const LibraryContext = createContext<Library | null>(null)

export function usePhotoLibrary(): Library {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('usePhotoLibrary must be used inside PhotoLibraryProvider')
  return context
}

function sortPhotos(photos: Photo[]): Photo[] {
  return [...photos].sort((a, b) => {
    if (!a.date && !b.date) return a.filename.localeCompare(b.filename)
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.getTime() - a.date.getTime()
  })
}

export function PhotoLibraryProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<UploadedPhoto[]>([])
  const [remote, setRemote] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return
    try {
      setRemote(await fetchRemotePhotos())
    } catch (cause) {
      setError(`Could not load photos from Supabase: ${describeError(cause)}`)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.allSettled([listUploads(), refresh()]).then((results) => {
      if (cancelled) return
      const uploadsResult = results[0]
      if (uploadsResult.status === 'fulfilled') setUploads(uploadsResult.value)
      else setError(describeError(uploadsResult.reason))
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [refresh])

  const localPhotos = useMemo<Photo[]>(
    () =>
      uploads.map((upload) => ({
        id: upload.id,
        src: URL.createObjectURL(upload.blob),
        filename: upload.filename,
        date: new Date(upload.date),
        storagePath: null,
        source: 'upload' as const,
      })),
    [uploads],
  )

  useEffect(() => {
    return () => {
      for (const photo of localPhotos) URL.revokeObjectURL(photo.src)
    }
  }, [localPhotos])

  const addPhoto = useCallback(
    async (file: File, date: string) => {
      if (!file.type.startsWith('image/')) {
        setError('That file is not an image, so nothing was added.')
        return
      }
      try {
        if (isSupabaseConfigured) {
          await uploadRemotePhoto(file, date)
          await refresh()
        } else {
          const saved = await saveUpload(file, null)
          setUploads((current) => [saved, ...current].sort((a, b) => b.date - a.date))
        }
        setError(null)
      } catch (cause) {
        setError(describeError(cause))
      }
    },
    [refresh],
  )

  const deletePhoto = useCallback(
    async (photo: Photo) => {
      if (photo.source === 'file') {
        setError('This photo lives in pictures/. Delete the file there and restart the dev server.')
        return
      }
      try {
        if (photo.source === 'supabase') await deleteRemotePhoto(photo)
        else {
          await removeUpload(photo.id)
          setUploads((current) => current.filter((upload) => upload.id !== photo.id))
        }
        setError(null)
      } catch (cause) {
        setError(describeError(cause))
      }
    },
    [],
  )

  const photos = useMemo(
    () => sortPhotos([...remote, ...localPhotos, ...diskPhotos]),
    [remote, localPhotos],
  )

  const uploadCount = uploads.length

  const value = useMemo<Library>(
    () => ({
      photos,
      uploadCount,
      loading,
      error,
      configured: isSupabaseConfigured,
      setError,
      addPhoto,
      deletePhoto,
    }),
    [photos, uploadCount, loading, error, addPhoto, deletePhoto],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}