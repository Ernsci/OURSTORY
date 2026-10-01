import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { usePhotoLibrary } from '../hooks/usePhotoLibrary'
import { cn } from '../utils/cn'

export function UploadDrop() {
  const { uploadCount, error, addPhoto, configured } = usePhotoLibrary()
  const [dragging, setDragging] = useState(false)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const input = useRef<HTMLInputElement>(null)

  const take = (files: FileList | File[]) => {
    for (const file of Array.from(files)) void addPhoto(file, date)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    if (event.dataTransfer?.files?.length) take(event.dataTransfer.files)
  }

  const onSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) take(event.target.files)
    event.target.value = ''
  }

  return (
    <div className="space-y-4">
      <div className="stitched flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white/70 px-4 py-5">
        <label className="font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft uppercase">
          Date for these photos
        </label>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm"
        />
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'stitched rounded-2xl bg-white/70 px-6 py-10 text-center transition-colors',
          dragging ? 'bg-rose-100/80' : 'hover:bg-white',
        )}
      >
        <p className="font-hand text-2xl text-rose-700">Drop new photos here</p>
        <p className="mt-1 text-sm text-ink-soft">
          {configured
            ? 'They upload to Supabase and show up everywhere right away.'
            : 'Without Supabase they are kept in this browser only. To keep them forever, drop the files into pictures/ and name them YYYY_MMDD_HHMMSS.jpg.'}
        </p>
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="mt-5 rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-600"
        >
          Choose files
        </button>
        <input
          ref={input}
          type="file"
          accept="image/*"
          multiple
          onChange={onSelect}
          className="sr-only"
          aria-label="Upload photos"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {uploadCount > 0 && (
        <p className="font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft uppercase">
          {uploadCount} browser-only upload{uploadCount === 1 ? '' : 's'} saved
        </p>
      )}
    </div>
  )
}