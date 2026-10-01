import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import { Tape } from './Tape'

interface PaperCardProps {
  children: ReactNode
  className?: string
  tape?: 'top-left' | 'top-right' | 'bottom-right' | 'none'
  rotate?: number
}

const TAPE_CLASSES: Record<NonNullable<PaperCardProps['tape']>, string> = {
  'top-left': '-top-3 -left-6 -rotate-6',
  'top-right': '-top-3 -right-6 rotate-6',
  'bottom-right': '-bottom-3 right-6 rotate-3',
  none: '',
}

export function PaperCard({ children, className, tape = 'none', rotate }: PaperCardProps) {
  const rotation = rotate === undefined ? '' : rotate % 2 === 0 ? '-rotate-1' : 'rotate-1'

  return (
    <article className={cn('photo-frame relative rounded-2xl bg-white/85 p-6 sm:p-8', rotation, className)}>
      {tape !== 'none' && <Tape className={TAPE_CLASSES[tape]} />}
      {children}
    </article>
  )
}