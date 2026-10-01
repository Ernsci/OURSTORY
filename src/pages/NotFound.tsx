import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-[0.66rem] tracking-[0.3em] text-rose-500 uppercase">page missing</p>
      <h1 className="mt-4 font-display text-4xl text-ink">This page fell out of the book.</h1>
      <p className="mt-3 text-ink-soft">Probably never glued in. Let us get you back to the cover.</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-rose-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-600"
      >
        Back to the cover
      </Link>
    </div>
  )
}