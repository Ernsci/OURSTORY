import type { Photo } from '../data/photos'
import { humanDate } from '../utils/date'
import { cn } from '../utils/cn'
import { useLightbox } from './Lightbox'
import { Tape } from './Tape'

interface PhotoCardProps {
  photo: Photo
  photos: Photo[]
  className?: string
  tilt?: 'left' | 'right' | 'none'
}

const TILTS: Record<NonNullable<PhotoCardProps['tilt']>, string> = {
  left: '-rotate-1',
  right: 'rotate-1',
  none: '',
}

export function PhotoCard({ photo, photos, className, tilt = 'none' }: PhotoCardProps) {
  const { open } = useLightbox()
  const index = photos.findIndex((item) => item.id === photo.id)
  const label = photo.date ? `Photo from ${humanDate(photo.date)}` : 'Photo'

  return (
    <figure className={cn('group relative', TILTS[tilt], className)}>
      <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
      <button
        type="button"
        onClick={() => open(photos, index)}
        className="photo-frame block w-full overflow-hidden rounded-xl bg-white p-2 transition-transform duration-300 group-hover:-translate-y-1"
        aria-label={`Open ${label.toLowerCase()}`}
      >
        <img
          src={photo.src}
          alt={label}
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full rounded-lg object-cover"
        />
      </button>
    </figure>
  )
}