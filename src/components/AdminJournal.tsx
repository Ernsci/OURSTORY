import { useState } from 'react'
import { AdminButton, AdminField, AdminInput, AdminNote, AdminTextarea } from './AdminField'
import type { JournalEntry } from '../data/couple'
import { useContent } from '../hooks/useContent'
import { humanDate, parseDate } from '../utils/date'

const blank = (): JournalEntry => ({
  id: `new-${Date.now()}`,
  date: new Date().toISOString().slice(0, 10),
  message: '',
  feeling: '',
})

export function AdminJournal() {
  const { journal, saveJournal, removeJournal } = useContent()
  const [draft, setDraft] = useState<JournalEntry | null>(null)

  const sorted = [...journal].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft uppercase">
          {journal.length} day{journal.length === 1 ? '' : 's'} written
        </p>
        <AdminButton onClick={() => setDraft(blank())}>Add a day</AdminButton>
      </div>

      {draft && (
        <form
          onSubmit={async (event) => {
            event.preventDefault()
            await saveJournal(draft)
            setDraft(null)
          }}
          className="photo-frame space-y-4 rounded-2xl bg-rose-50/80 p-6"
        >
          <AdminField label="Date">
            <AdminInput
              type="date"
              required
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
          </AdminField>
          <AdminField label="Message">
            <AdminTextarea
              value={draft.message}
              onChange={(e) => setDraft({ ...draft, message: e.target.value })}
            />
          </AdminField>
          <AdminField label="Feeling" hint="One word is plenty.">
            <AdminInput
              value={draft.feeling}
              onChange={(e) => setDraft({ ...draft, feeling: e.target.value })}
            />
          </AdminField>
          <div className="flex gap-3">
            <AdminButton type="submit">Save day</AdminButton>
            <AdminButton variant="ghost" type="button" onClick={() => setDraft(null)}>
              Cancel
            </AdminButton>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {sorted.map((entry) => (
          <li
            key={entry.id}
            className="photo-frame flex flex-wrap items-start gap-4 rounded-2xl bg-white/90 p-5"
          >
            <div className="min-w-40">
              <p className="font-mono text-xs text-rose-600">{humanDate(parseDate(entry.date))}</p>
              <p className="mt-1 text-sm text-ink">{entry.feeling || <span className="text-ink-soft">no feeling yet</span>}</p>
            </div>
            <p className="min-w-0 flex-1 text-sm leading-relaxed whitespace-pre-line text-ink-soft">
              {entry.message || <span className="italic">no message yet</span>}
            </p>
            <div className="flex gap-2">
              <AdminButton variant="ghost" onClick={() => setDraft(entry)}>
                Edit
              </AdminButton>
              <AdminButton variant="danger" onClick={() => void removeJournal(entry.id)}>
                Delete
              </AdminButton>
            </div>
          </li>
        ))}
      </ul>

      {sorted.length === 0 && <AdminNote>Nothing written yet. Add the first day.</AdminNote>}
    </div>
  )
}