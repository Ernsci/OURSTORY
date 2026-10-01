import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { PaperCard } from '../components/PaperCard'
import { SectionHeading } from '../components/SectionHeading'
import { Stamp } from '../components/Stamp'
import type { JournalEntry } from '../data/couple'
import { useContent } from '../hooks/useContent'
import { monthLabel, parseDate, stampWithDay } from '../utils/date'
import { cn } from '../utils/cn'

interface JournalItem extends JournalEntry {
  parsed: Date
}

export function Timeline() {
  const { journal } = useContent()
  const entries = useMemo<JournalItem[]>(
    () =>
      [...journal]
        .map((entry) => ({ ...entry, parsed: parseDate(entry.date) }))
        .sort((a, b) => b.parsed.getTime() - a.parsed.getTime()),
    [journal],
  )

  return (
    <div className="space-y-10 pb-10">
      <SectionHeading
        kicker="Timeline"
        title="Day by day"
        blurb="One card per day. Write whatever you want — the loud days, the quiet ones, the ones in between."
      />

      {entries.length === 0 ? (
        <p className="text-ink-soft">Nothing written down yet.</p>
      ) : (
        <ol className="relative space-y-8 border-l-2 border-dashed border-rose-200 pl-6 sm:pl-10">
          {entries.map((entry, index) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              tilt={index % 2 === 0 ? 'left' : 'right'}
              first={index === 0}
            />
          ))}
        </ol>
      )}

      <PaperCard tape="top-left" className="stitched bg-white/60">
        <p className="font-hand text-2xl text-rose-700">Writing a new day</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Every day on this page is a message and a feeling. Add or edit them any time from the
          admin page — no code needed.
        </p>
        <Link
          to="/admin"
          className="mt-4 inline-block rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-600"
        >
          Open the admin page
        </Link>
      </PaperCard>
    </div>
  )
}

interface JournalCardProps {
  entry: JournalItem
  tilt: 'left' | 'right'
  first: boolean
}

function JournalCard({ entry, tilt, first }: JournalCardProps) {
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className={cn(
          'absolute -left-[1.9rem] top-8 size-3.5 rounded-full border-2 border-rose-400 bg-paper sm:-left-[3.1rem]',
          first && 'bg-rose-400',
        )}
      />

      <PaperCard
        tape={tilt === 'left' ? 'top-left' : 'top-right'}
        rotate={tilt === 'left' ? 0 : 1}
        className={cn('bg-white/90', tilt === 'left' ? 'sm:mr-10' : 'sm:ml-10')}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Stamp>{stampWithDay(entry.parsed)}</Stamp>
          <p className="font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft/70 uppercase">
            {monthLabel(entry.parsed)}
          </p>
        </div>

        <div className="mt-6">
          <p className="font-mono text-[0.62rem] tracking-[0.28em] text-rose-500 uppercase">Message</p>
          {entry.message ? (
            <p className="mt-1 text-base leading-relaxed whitespace-pre-line text-ink">{entry.message}</p>
          ) : (
            <p className="ruled mt-2 min-h-20 pt-2 font-hand text-2xl leading-[28px] text-ink-soft/45">
              write something here…
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-rose-200 pt-4">
          <p className="font-mono text-[0.62rem] tracking-[0.28em] text-rose-500 uppercase">Feeling</p>
          {entry.feeling ? (
            <span className="rounded-full border border-dashed border-rose-300 bg-rose-50 px-4 py-1 font-hand text-2xl text-rose-700">
              {entry.feeling}
            </span>
          ) : (
            <span className="stitched px-4 py-1.5 font-mono text-[0.6rem] tracking-[0.2em] text-ink-soft/70 uppercase">
              not written yet
            </span>
          )}
        </div>
      </PaperCard>
    </li>
  )
}