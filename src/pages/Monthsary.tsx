import { PhotoCard } from '../components/PhotoCard'
import { PaperCard } from '../components/PaperCard'
import { SectionHeading } from '../components/SectionHeading'
import { Stamp } from '../components/Stamp'
import { useContent } from '../hooks/useContent'
import { useNow } from '../hooks/useNow'
import { usePhotoLibrary } from '../hooks/usePhotoLibrary'
import { firstDayOf, monthsaryDateOf, monthsaryWindowOf, nextMonthsaryOf } from '../utils/derive'
import { elapsedSince, humanDate } from '../utils/date'
import { cn } from '../utils/cn'

export function Monthsary() {
  const now = useNow()
  const { photos } = usePhotoLibrary()
  const { couple, monthsaries } = useContent()
  const firstDay = firstDayOf(couple.startDate)
  const state = nextMonthsaryOf(couple.startDate, monthsaries, now)
  const elapsed = elapsedSince(firstDay, now)

  const photosIn = (month: number) => {
    const { from, to } = monthsaryWindowOf(couple.startDate, month)
    return photos.filter((photo) => photo.date && photo.date >= from && photo.date < to)
  }

  return (
    <div className="space-y-12 pb-10">
      <SectionHeading
        kicker="Monthsary"
        title={`${elapsed.months} month${elapsed.months === 1 ? '' : 's'} in`}
        blurb="One page per month. The finished ones are filled in; the rest are waiting for us."
      />

      <PaperCard tape="top-left" className="bg-rose-50/90">
        <Stamp tone="brass">{state.currentIsToday ? 'TODAY' : 'IN PROGRESS'}</Stamp>
        <h2 className="mt-4 font-display text-3xl text-rose-700">{state.entry.theme}</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">{state.entry.body}</p>
        <p className="mt-5 font-hand text-2xl text-rose-600">Ritual: {state.entry.ritual}</p>
        <p className="mt-2 font-mono text-[0.66rem] tracking-[0.2em] text-ink-soft uppercase">
          {state.entry.title} · {humanDate(state.current)} · {elapsed.daysAfterLastMonthsary} days in
        </p>
        {state.currentIsToday && (
          <p className="mt-4 font-hand text-3xl text-rose-600">It is monthsary. Go be embarrassing about it.</p>
        )}
      </PaperCard>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {monthsaries.map((entry) => {
          const reached = entry.month <= state.reached
          const isCurrent = entry.month === state.reached
          const monthPhotos = reached ? photosIn(entry.month) : []
          return (
            <article
              key={entry.month}
              className={cn(
                'photo-frame relative rounded-2xl p-6',
                reached ? 'bg-white/90' : 'stitched bg-white/40',
                isCurrent && 'ring-2 ring-rose-400',
              )}
            >
              <p className="font-mono text-[0.62rem] tracking-[0.24em] text-rose-500 uppercase">
                {humanDate(monthsaryDateOf(couple.startDate, entry.month))}
              </p>
              <h3 className="mt-2 font-display text-2xl text-ink">{entry.title}</h3>
              <p className="mt-1 font-hand text-xl text-rose-600">{entry.theme}</p>
              <p className={cn('mt-3 text-sm leading-relaxed text-ink-soft', !reached && 'italic')}>
                {reached ? entry.body : 'Not written yet. This page is still blank on purpose.'}
              </p>
              {monthPhotos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {monthPhotos.slice(0, 2).map((photo) => (
                    <PhotoCard key={photo.id} photo={photo} photos={photos} tilt="none" />
                  ))}
                </div>
              )}
              {isCurrent && (
                <span className="absolute -top-3 -right-2 rounded-full bg-rose-500 px-3 py-1 font-mono text-[0.6rem] tracking-[0.18em] text-white uppercase">
                  now
                </span>
              )}
            </article>
          )
        })}
      </div>

      <PaperCard tape="bottom-right" className="bg-paper-deep/80">
        <p className="font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft uppercase">Next up</p>
        <p className="mt-2 font-display text-2xl text-rose-700">
          {state.nextEntry.title} — {humanDate(state.upcoming)}
        </p>
        <p className="mt-2 text-ink-soft">{state.nextEntry.theme}</p>
        <p className="mt-1 font-mono text-[0.66rem] tracking-[0.2em] text-ink-soft uppercase">
          {state.daysToUpcoming} days to go
        </p>
      </PaperCard>
    </div>
  )
}