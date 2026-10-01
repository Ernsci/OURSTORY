import { useMemo, useState } from 'react'
import { PhotoCard } from '../components/PhotoCard'
import { SectionHeading } from '../components/SectionHeading'
import { UploadDrop } from '../components/UploadDrop'
import { usePhotoLibrary } from '../hooks/usePhotoLibrary'
import { monthLabel } from '../utils/date'
import { cn } from '../utils/cn'

export function Moments() {
  const { photos, loading } = usePhotoLibrary()
  const [activeMonth, setActiveMonth] = useState<string | null>(null)

  const months = useMemo(() => {
    const groups = new Map<string, typeof photos>()
    for (const photo of photos) {
      const key = photo.date ? monthLabel(photo.date) : 'Undated'
      const bucket = groups.get(key)
      if (bucket) bucket.push(photo)
      else groups.set(key, [photo])
    }
    return Array.from(groups.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1))
  }, [photos])

  const visible = activeMonth ? months.filter(([key]) => key === activeMonth) : months

  return (
    <div className="space-y-12 pb-10">
      <SectionHeading
        kicker="Moments"
        title="Everything we kept"
        blurb="Filed by month, newest first. Tap any photo to make it big."
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveMonth(null)}
          className={cn(
            'rounded-full px-3 py-1.5 font-mono text-[0.66rem] tracking-[0.18em] uppercase transition-colors',
            activeMonth === null ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700 hover:bg-rose-200',
          )}
        >
          All months
        </button>
        {months.map(([key, items]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveMonth(key)}
            className={cn(
              'rounded-full px-3 py-1.5 font-mono text-[0.66rem] tracking-[0.18em] uppercase transition-colors',
              activeMonth === key ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700 hover:bg-rose-200',
            )}
          >
            {key} ({items.length})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-mono text-xs tracking-[0.2em] text-ink-soft uppercase">Opening the photo box…</p>
      ) : photos.length === 0 ? (
        <p className="text-ink-soft">No photos yet. Drop some into pictures/ and restart the dev server.</p>
      ) : (
        visible.map(([key, items]) => (
          <section key={key}>
            <h2 className="mb-6 border-b border-rose-200 pb-2 font-display text-2xl text-rose-700">{key}</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((photo, index) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  photos={photos}
                  tilt={index % 3 === 0 ? 'left' : index % 3 === 1 ? 'right' : 'none'}
                />
              ))}
            </div>
          </section>
        ))
      )}

      <section>
        <h2 className="mb-4 font-display text-2xl text-ink">Add to this book</h2>
        <UploadDrop />
      </section>
    </div>
  )
}