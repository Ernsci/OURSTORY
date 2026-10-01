import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface StampProps {
  children: ReactNode
  className?: string
  tone?: 'rose' | 'ink' | 'brass'
}

const TONES: Record<NonNullable<StampProps['tone']>, string> = {
  rose: 'border-rose-300 text-rose-600',
  ink: 'border-ink/25 text-ink-soft',
  brass: 'border-brass/60 text-brass',
}

export function Stamp({ children, className, tone = 'rose' }: StampProps) {
  return (
    <span
      className={cn(
        'inline-flex -rotate-2 items-center rounded-md border-2 border-dashed px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.18em] uppercase',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}