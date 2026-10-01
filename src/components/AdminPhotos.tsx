import { useState } from 'react'
import type { Photo } from '../data/photos'
import { AdminButton, AdminNote } from './AdminField'
import { UploadDrop } from './UploadDrop'
import { usePhotoLibrary } from '../hooks/usePhotoLibrary'
import { humanDate } from '../utils/date'

export function AdminPhotos() {
  const { photos, deletePhoto, error, setError } = usePhotoLibrary()
  const [pending, setPending] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const remove = async (photo: Photo) => {
    if (pending !== photo.id) {
      setPending(photo.id)
      return
    }
    setPending(null)
    setBusy(photo.id)
    await deletePhoto(photo)
    setBusy(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <UploadDrop />

      {error && (
        <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div>
        <p className="mb-3 font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft uppercase">
          {photos.length} photo{photos.length === 1 ? '' : 's'} on the site
        </p>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((photo) => (
            <li key={photo.id} className="space-y-2">
              <img
                src={photo.src}
                alt=""
                loading="lazy"
                className="aspect-[4/3] w-full rounded-xl border-4 border-white object-cover shadow-sm"
              />
              <p className="font-mono text-[0.6rem] tracking-[0.16em] text-ink-soft uppercase">
                {photo.source === 'file'
                  ? 'pictures/'
                  : photo.source === 'supabase'
                    ? 'supabase'
                    : 'browser'}
                {photo.date ? ` · ${humanDate(photo.date)}` : ''}
              </p>
              <AdminButton
                variant={pending === photo.id ? 'primary' : 'danger'}
                disabled={photo.source === 'file' || busy === photo.id}
                onClick={() => void remove(photo)}
              >
                {busy === photo.id
                  ? 'Removing…'
                  : pending === photo.id
                    ? 'Really delete'
                    : 'Delete'}
              </AdminButton>
            </li>
          ))}
        </ul>
      </div>

      <AdminNote>
        Photos marked <span className="font-mono text-[0.65rem]">pictures/</span> come from files on disk. Delete
        those files in the project folder and restart the dev server; everything uploaded here can be removed
        straight from this page.
      </AdminNote>
    </div>
  )
}