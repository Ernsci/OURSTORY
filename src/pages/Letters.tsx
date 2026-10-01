import { PaperCard } from '../components/PaperCard'
import { SectionHeading } from '../components/SectionHeading'
import { Stamp } from '../components/Stamp'
import { useContent } from '../hooks/useContent'
import { humanDate, parseDate } from '../utils/date'

export function Letters() {
  const { letters } = useContent()
  return (
    <div className="space-y-12 pb-10">
      <SectionHeading
        kicker="Letters"
        title="The things we meant to say"
        blurb="Folded into the back pages. Rewrite them any time — they are only text."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {letters.map((letter, index) => (
          <PaperCard key={letter.id} tape={index === 0 ? 'top-left' : 'top-right'} rotate={index}>
            <div className="flex items-center justify-between gap-3">
              <Stamp>To {letter.to}</Stamp>
              <span className="font-mono text-[0.62rem] tracking-[0.2em] text-ink-soft uppercase">
                {humanDate(parseDate(letter.date))}
              </span>
            </div>

            <h2 className="mt-5 font-display text-2xl text-ink">{letter.title}</h2>

            <div className="ruled mt-4 pt-3 font-hand text-[1.6rem] leading-[28px] text-ink">
              {letter.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mb-1">
                  {paragraph}
                </p>
              ))}
            </div>

            <p className="mt-6 font-hand text-2xl text-rose-600">{letter.signature}</p>
          </PaperCard>
        ))}
      </div>

      <PaperCard className="stitched bg-white/60">
        <p className="font-hand text-2xl text-rose-700">One more envelope</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Write a letter or something
          <span className="font-mono text-xs"> please</span>
        </p>
      </PaperCard>
    </div>
  )
}
