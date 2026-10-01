import { cn } from '../utils/cn'

const ROTATIONS: Record<number, string> = {
  [-8]: '-rotate-8',
  [-5]: '-rotate-5',
  [-3]: '-rotate-3',
  [0]: 'rotate-0',
  [3]: 'rotate-3',
  [5]: 'rotate-5',
  [8]: 'rotate-8',
}

interface TapeProps {
  className?: string
  rotate?: number
}

export function Tape({ className, rotate = -4 }: TapeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'tape pointer-events-none absolute block w-24 rounded-[2px]',
        ROTATIONS[rotate] ?? '-rotate-3',
        className,
      )}
    />
  )
}