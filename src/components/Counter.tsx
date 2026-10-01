import { useContent } from '../hooks/useContent'
import { useNow } from '../hooks/useNow'
import { firstDayOf } from '../utils/derive'
import { elapsedSince, humanDate, ordinal } from '../utils/date'
import { Stamp } from './Stamp'

const UNITS = ['months', 'hours', 'minutes', 'seconds'] as const

export function Counter() {
  const now = useNow()
  const { couple } = useContent()
  const firstDay = firstDayOf(couple.startDate)
  const elapsed = elapsedSince(firstDay, now)

  return (
    <section aria-labelledby="counter-title" className="relative">
      <Stamp className="mb-6">LIVE COUNTER</Stamp>
      <h2 id="counter-title" className="sr-only">
        How long we have been together
      </h2>

      <p className="font-display text-[4.5rem] leading-none text-rose-600 sm:text-[6.5rem]">
        {elapsed.totalDays.toLocaleString('en-GB')}
      </p>
      <p className="mt-2 font-hand text-3xl text-rose-700">
        {elapsed.totalDays === 1 ? 'day' : 'days'} and counting, since {humanDate(firstDay)}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[elapsed.months, elapsed.hours, elapsed.minutes, elapsed.seconds].map((value, index) => (
          <div key={UNITS[index]} className="photo-frame rounded-xl bg-white/80 px-4 py-5 text-center">
            <dt className="font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft uppercase">
              {UNITS[index]}
            </dt>
            <dd className="mt-2 font-mono text-3xl text-ink tabular-nums sm:text-4xl">
              {String(value).padStart(2, '0')}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 font-hand text-2xl text-ink-soft">
        {elapsed.months === 0
          ? 'Still inside month one.'
          : `${elapsed.months} ${elapsed.months === 1 ? 'month' : 'months'} and ${elapsed.daysAfterLastMonthsary} ${elapsed.daysAfterLastMonthsary === 1 ? 'day' : 'days'} deep — ${ordinal(elapsed.months)} monthsary.`}
      </p>
    </section>
  )
}