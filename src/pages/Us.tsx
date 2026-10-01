import { PaperCard } from '../components/PaperCard'
import { SectionHeading } from '../components/SectionHeading'
import { Stamp } from '../components/Stamp'
import { useContent } from '../hooks/useContent'
import { useNow } from '../hooks/useNow'
import { firstDayOf, upcomingBirthdaysOf } from '../utils/derive'
import { ageOn, elapsedSince, humanDate, parseDate, stamp } from '../utils/date'

export function Us() {
  const now = useNow()
  const { couple, people } = useContent()
  const firstDay = firstDayOf(couple.startDate)
  const elapsed = elapsedSince(firstDay, now)
  const upcoming = upcomingBirthdaysOf(people, now)

  return (
    <div className="space-y-12 pb-10">
      <SectionHeading kicker="Us" title="The two of us" blurb={couple.about} />

      <div className="grid gap-6 sm:grid-cols-2">
        {people.map((person, index) => {
          const birthday = parseDate(person.birthday)
          const next = upcoming.find((item) => item.person.name === person.name)
          return (
            <PaperCard key={person.name} tape={index === 0 ? 'top-left' : 'top-right'} rotate={index}>
              <div className="flex items-start gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-rose-200 font-display text-2xl text-rose-700">
                  {person.initials}
                </span>
                <div>
                  <h2 className="font-display text-3xl text-ink">{person.name}</h2>
                  <p className="font-hand text-xl text-rose-600">{person.role}</p>
                </div>
              </div>

              <dl className="mt-6 space-y-3 border-t border-rose-200 pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Born</dt>
                  <dd className="text-right font-mono text-xs text-ink">{humanDate(birthday)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Turning</dt>
                  <dd className="text-right font-mono text-xs text-ink">
                    {ageOn(birthday, next?.date ?? now) + 1} on {humanDate(next?.date ?? birthday)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Birthday in</dt>
                  <dd className="text-right font-mono text-xs text-ink">
                    {next?.days === 0 ? 'today' : `${next?.days} days`}
                  </dd>
                </div>
              </dl>

              <ul className="mt-5 space-y-1.5 font-hand text-xl text-rose-700">
                {person.traits.map((trait) => (
                  <li key={trait}>✧ {trait}</li>
                ))}
              </ul>
            </PaperCard>
          )
        })}
      </div>

      <PaperCard tape="bottom-right" className="bg-rose-50/90">
        <Stamp tone="brass">THE HEADLINE NUMBER</Stamp>
        <p className="mt-4 font-display text-6xl text-rose-600">{elapsed.totalDays.toLocaleString('en-GB')}</p>
        <p className="mt-2 font-hand text-2xl text-rose-700">
          days since {humanDate(firstDay)} — {elapsed.months} whole months and{' '}
          {elapsed.daysAfterLastMonthsary} days past the last one.
        </p>
        <p className="mt-4 font-mono text-[0.66rem] tracking-[0.2em] text-ink-soft uppercase">
          Book opened {stamp(firstDay)}
        </p>
      </PaperCard>
    </div>
  )
}