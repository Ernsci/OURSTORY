import { useState } from 'react'
import { AdminButton, AdminField, AdminInput } from '../components/AdminField'
import { AdminJournal } from '../components/AdminJournal'
import { AdminLetters } from '../components/AdminLetters'
import { AdminMonthsaries } from '../components/AdminMonthsaries'
import { AdminPeople } from '../components/AdminPeople'
import { AdminPhotos } from '../components/AdminPhotos'
import { AdminSettings } from '../components/AdminSettings'
import { SectionHeading } from '../components/SectionHeading'
import { useContent } from '../hooks/useContent'
import { usePhotoLibrary } from '../hooks/usePhotoLibrary'
import { cn } from '../utils/cn'

const TABS = [
  { id: 'settings', label: 'Settings' },
  { id: 'journal', label: 'Timeline' },
  { id: 'photos', label: 'Photos' },
  { id: 'monthsaries', label: 'Monthsaries' },
  { id: 'letters', label: 'Letters' },
  { id: 'people', label: 'Us' },
] as const

type TabId = (typeof TABS)[number]['id']

export function Admin() {
  const { configured, session, signIn, signOut } = useContent()
  const [tab, setTab] = useState<TabId>('settings')

  if (!configured) return <SetupNotice />
  if (!session) return <LoginPanel onSignIn={signIn} />

  return (
    <div className="space-y-10 pb-16">
      <SectionHeading
        kicker="Admin"
        title="Change anything, any time"
        blurb="Everything here saves straight to Supabase and appears on the scrapbook immediately."
      />

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              'rounded-full px-4 py-1.5 font-mono text-[0.64rem] tracking-[0.18em] uppercase transition-colors',
              tab === item.id ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700 hover:bg-rose-200',
            )}
          >
            {item.label}
          </button>
        ))}
        <AdminButton variant="ghost" className="ml-auto" onClick={() => void signOut()}>
          Sign out
        </AdminButton>
      </div>

      {tab === 'settings' && <AdminSettings />}
      {tab === 'journal' && <AdminJournal />}
      {tab === 'photos' && <AdminPhotos />}
      {tab === 'monthsaries' && <AdminMonthsaries />}
      {tab === 'letters' && <AdminLetters />}
      {tab === 'people' && <AdminPeople />}
    </div>
  )
}

function LoginPanel({ onSignIn }: { onSignIn: (email: string, password: string) => Promise<void> }) {
  const { error, setError } = useContent()
  const { error: photoError } = usePhotoLibrary()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true)
    await onSignIn(email.trim(), password)
    setBusy(false)
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <SectionHeading
        kicker="Admin"
        title="Sign in"
        blurb="Use the email you created in Supabase. The password is the one you set there."
        align="center"
      />
      <form onSubmit={submit} className="photo-frame space-y-4 rounded-2xl bg-white/90 p-6">
        <AdminField label="Email">
          <AdminInput
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </AdminField>
        <AdminField label="Password">
          <AdminInput
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </AdminField>
        {(error || photoError) && (
          <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error ?? photoError}
          </p>
        )}
        <AdminButton type="submit" disabled={busy} className="w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </AdminButton>
        <button
          type="button"
          onClick={() => setError(null)}
          className="w-full text-center text-xs text-ink-soft underline decoration-dashed underline-offset-4"
        >
          Clear the message
        </button>
      </form>
    </div>
  )
}

function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-10">
      <SectionHeading
        kicker="Admin"
        title="Supabase is not connected yet"
        blurb="The scrapbook is running on the built-in fallback data. Three steps turn everything on."
      />
      <ol className="photo-frame space-y-4 rounded-2xl bg-white/90 p-6 text-sm leading-relaxed text-ink-soft">
        <li>
          <span className="font-mono text-xs text-rose-600">1</span> Create a free project at{' '}
          <span className="font-mono text-xs">supabase.com</span>.
        </li>
        <li>
          <span className="font-mono text-xs text-rose-600">2</span> Open{' '}
          <span className="font-mono text-xs">SQL → New query</span>, paste{' '}
          <span className="font-mono text-xs">supabase/schema.sql</span> and run it once.
        </li>
        <li>
          <span className="font-mono text-xs text-rose-600">3</span> Copy{' '}
          <span className="font-mono text-xs">.env.example</span> to <span className="font-mono text-xs">.env</span>, fill in
          the URL and anon key from Project Settings → API, then restart the dev server.
        </li>
        <li>
          <span className="font-mono text-xs text-rose-600">4</span> In Authentication → Users, add yourself with the
          password <span className="font-mono text-xs">chadrei</span>.
        </li>
      </ol>
    </div>
  )
}