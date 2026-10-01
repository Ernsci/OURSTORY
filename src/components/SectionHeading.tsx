import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface SectionHeadingProps {
  kicker?: string
  title: string
  blurb?: ReactNode
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ kicker, title, blurb, className, align = 'left' }: SectionHeadingProps) {
  return (
    <header className={cn('mb-8 max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {kicker && (
        <p className="mb-2 font-mono text-[0.68rem] tracking-[0.3em] text-rose-500 uppercase">{kicker}</p>
      )}
      <h2 className="text-3xl text-ink sm:text-4xl">{title}</h2>
      {blurb && <p className="mt-3 text-base leading-relaxed text-ink-soft">{blurb}</p>}
    </header>
  )
}