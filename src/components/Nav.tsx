import { NavLink } from 'react-router-dom'
import { cn } from '../utils/cn'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/moments', label: 'Moments' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/monthsary', label: 'Monthsary' },
  { to: '/us', label: 'Us' },
  { to: '/letters', label: 'Letters' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-rose-200/70 bg-paper/85 backdrop-blur-md">
      <nav aria-label="Scrapbook pages" className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <NavLink to="/" className="font-display text-lg tracking-tight text-rose-700">
          C<span className="text-rose-400">&amp;</span>R
        </NavLink>
        <ul className="flex flex-1 gap-1 overflow-x-auto pb-0.5">
          {links.map((link) => (
            <li key={link.to} className="shrink-0">
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'block rounded-full px-3 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'bg-rose-500 text-white'
                      : 'text-ink-soft hover:bg-rose-100 hover:text-rose-700',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}