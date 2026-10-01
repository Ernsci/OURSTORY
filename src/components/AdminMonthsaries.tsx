import { useState } from 'react'
import { AdminButton, AdminField, AdminInput, AdminTextarea } from './AdminField'
import type { MonthsaryEntry } from '../data/monthsaries'
import { useContent } from '../hooks/useContent'

export function AdminMonthsaries() {
  const { monthsaries, saveMonthsary, removeMonthsary } = useContent()
  const [draft, setDraft] = useState<MonthsaryEntry | null>(null)

  const sorted = [...monthsaries].sort((a, b) => a.month - b.month)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft uppercase">
          {sorted.length} monthsary pages
        </p>
        <AdminButton
          onClick={() =>
            setDraft({
              id: `new-${Date.now()}`,
              month: Math.min(12, (sorted.at(-1)?.month ?? 0) + 1),
              title: '',
              theme: '',
              body: '',
              ritual: '',
            })
          }
        >
          Add a month
        </AdminButton>
      </div>

      {draft && (
        <form
          onSubmit={async (event) => {
            event.preventDefault()
            await saveMonthsary(draft)
            setDraft(null)
          }}
          className="photo-frame space-y-4 rounded-2xl bg-rose-50/80 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Month number" hint="1 to 12.">
              <AdminInput
                type="number"
                min={1}
                max={12}
                required
                value={draft.month}
                onChange={(e) => setDraft({ ...draft, month: Number(e.target.value) })}
              />
            </AdminField>
            <AdminField label="Title">
              <AdminInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </AdminField>
          </div>
          <AdminField label="Theme">
            <AdminInput value={draft.theme} onChange={(e) => setDraft({ ...draft, theme: e.target.value })} />
          </AdminField>
          <AdminField label="Body">
            <AdminTextarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          </AdminField>
          <AdminField label="Ritual">
            <AdminInput value={draft.ritual} onChange={(e) => setDraft({ ...draft, ritual: e.target.value })} />
          </AdminField>
          <div className="flex gap-3">
            <AdminButton type="submit">Save month</AdminButton>
            <AdminButton variant="ghost" type="button" onClick={() => setDraft(null)}>
              Cancel
            </AdminButton>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {sorted.map((entry) => (
          <li key={entry.id} className="photo-frame rounded-2xl bg-white/90 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[0.62rem] tracking-[0.24em] text-rose-500 uppercase">
                  Month {entry.month}
                </p>
                <p className="font-display text-xl text-ink">{entry.title || 'Untitled'}</p>
                <p className="font-hand text-lg text-rose-600">{entry.theme}</p>
              </div>
              <div className="flex gap-2">
                <AdminButton variant="ghost" onClick={() => setDraft(entry)}>
                  Edit
                </AdminButton>
                <AdminButton variant="danger" onClick={() => void removeMonthsary(entry.id)}>
                  Delete
                </AdminButton>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink-soft">{entry.body}</p>
            <p className="mt-2 text-sm text-ink-soft">Ritual: {entry.ritual}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}