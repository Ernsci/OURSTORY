import { Link } from 'react-router-dom'
import { Counter } from '../components/Counter'
import { PaperCard } from '../components/PaperCard'
import { PhotoCard } from '../components/PhotoCard'
import { SectionHeading } from '../components/SectionHeading'
import { Stamp } from '../components/Stamp'
import { useContent } from '../hooks/useContent'
import { useNow } from '../hooks/useNow'
import { usePhotoLibrary } from '../hooks/usePhotoLibrary'
import { firstDayOf, nextMonthsaryOf, upcomingBirthdaysOf } from '../utils/derive'
import { elapsedSince, humanDate, ordinal, stampWithDay } from '../utils/date'

export function Home() {
  const now = useNow()
  const { photos, loading } = usePhotoLibrary()
  const { couple, people, monthsaries } = useContent()
  const firstDay = firstDayOf(couple.startDate)
  const monthsary = nextMonthsaryOf(couple.startDate, monthsaries, now)
  const birthday = upcomingBirthdaysOf(people, now)[0]
  const elapsed = elapsedSince(firstDay, now)
  const recent = photos.slice(0, 4)

  return (
    <div className="space-y-20 pb-10">
      <section className="pt-6 text-center">
        <Stamp tone="brass">EST. AUGUST 2026</Stamp>
        <h1 className="mt-6 font-display text-5xl text-ink sm:text-7xl">
          {couple.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-hand text-3xl text-rose-600">{couple.tagline}</p>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">{couple.about}</p>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <PaperCard tape="top-left" className="animate-rise">
          <Counter />
        </PaperCard>

        <div className="space-y-6">
          <PaperCard tape="top-right" rotate={1}>
            <p className="font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft uppercase">Coming up</p>
            <ul className="mt-4 space-y-4">
              <li>
                <p className="font-display text-2xl text-rose-700">
                  {birthday.days === 0 ? 'Today' : `${birthday.days} days`}
                </p>
                <p className="text-ink-soft">
                  {birthday.person.name}&rsquo;s birthday — {humanDate(birthday.date)}
                </p>
              </li>
              <li>
                <p className="font-display text-2xl text-rose-700">
                  {monthsary.currentIsToday
                    ? 'Today'
                    : monthsary.daysToUpcoming === 0
                      ? 'Today'
                      : `In ${monthsary.daysToUpcoming} days`}
                </p>
                <p className="text-ink-soft">
                  {ordinal(monthsary.reached + 1)} monthsary — {humanDate(monthsary.upcoming)}
                </p>
              </li>
            </ul>
          </PaperCard>

          <PaperCard rotate={0} className="bg-rose-50/80">
            <p className="font-hand text-2xl text-rose-700">{monthsary.entry.theme}</p>
            <p className="mt-2 text-ink-soft">{monthsary.entry.body}</p>
            <Link
              to="/monthsary"
              className="mt-4 inline-block font-mono text-[0.68rem] tracking-[0.2em] text-rose-600 uppercase underline decoration-dashed underline-offset-4 hover:text-rose-700"
            >
              Open the monthsary pages
            </Link>
          </PaperCard>
        </div>
      </div>

      <section>
        <SectionHeading
          kicker="Recent pages"
          title="The latest glue-ups"
          blurb="Everything in pictures/ gets filed here automatically, newest on top."
          className="flex flex-wrap items-end justify-between gap-4"
        />
        {loading ? (
          <p className="font-mono text-xs tracking-[0.2em] text-ink-soft uppercase">Opening the photo box…</p>
        ) : recent.length === 0 ? (
          <p className="text-ink-soft">No photos yet. Add some to pictures/ and reload.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                photos={photos}
                tilt={index % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: '/moments', label: 'Moments', note: 'Every photo, by month' },
          { to: '/timeline', label: 'Timeline', note: 'Everything that happened' },
          { to: '/monthsary', label: 'Monthsary', note: 'Twelve pages, one per month' },
          { to: '/letters', label: 'Letters', note: 'The things we meant to say' },
        ].map((tile) => (
          <Link
            key={tile.to}
            to={tile.to}
            className="photo-frame group rounded-2xl bg-white/80 p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <p className="font-display text-2xl text-rose-700">{tile.label}</p>
            <p className="mt-1 text-sm text-ink-soft">{tile.note}</p>
          </Link>
        ))}
      </section>

      <p className="text-center font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft uppercase">
        Book opened {stampWithDay(firstDay)} · {elapsed.totalDays} days so far
      </p>
    </div>
  )
}