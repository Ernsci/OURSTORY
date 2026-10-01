import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { firstDayOf } from '../utils/derive'
import { humanDate } from '../utils/date'

export function Footer() {
  const { couple } = useContent()
  const firstDay = firstDayOf(couple.startDate)

  return (
    <footer className="mt-20 border-t border-rose-200/70 bg-paper/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <p className="font-hand text-xl text-rose-700">{couple.title}, in the making since {humanDate(firstDay)}.</p>
        <p className="font-mono text-[0.62rem] tracking-[0.24em] uppercase">
          Made with too much pink and not enough glue ·{' '}
          <Link to="/admin" className="underline decoration-dashed underline-offset-4 hover:text-rose-700">
            admin
          </Link>
        </p>
      </div>
    </footer>
  )
}