import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export function AdminField({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="font-mono text-[0.62rem] tracking-[0.24em] text-rose-500 uppercase">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  )
}

const CONTROL =
  'mt-1.5 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-rose-400'

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(CONTROL, props.className)} />
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(CONTROL, 'min-h-24 resize-y', props.className)} />
}

export function AdminButton({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const styles = {
    primary: 'bg-rose-500 text-white hover:bg-rose-600',
    ghost: 'border border-rose-300 text-rose-700 hover:bg-rose-100',
    danger: 'border border-rose-300 text-rose-700 hover:bg-rose-100',
  }[variant]

  return (
    <button
      {...props}
      className={cn(
        'rounded-full px-4 py-1.5 font-mono text-[0.64rem] tracking-[0.18em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        styles,
        className,
      )}
    />
  )
}

export function AdminRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>
}

export function AdminNote({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-ink-soft">{children}</p>
}