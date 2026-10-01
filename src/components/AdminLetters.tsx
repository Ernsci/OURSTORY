import { useState } from 'react'
import { AdminButton, AdminField, AdminInput, AdminNote, AdminRow, AdminTextarea } from './AdminField'
import type { Letter } from '../data/couple'
import { useContent } from '../hooks/useContent'

const blank = (): Letter => ({
  id: `new-${Date.now()}`,
  from: '',
  to: '',
  date: new Date().toISOString().slice(0, 10),
  title: '',
  body: [''],
  signature: '',
})

export function AdminLetters() {
  const { letters, saveLetter, removeLetter } = useContent()
  const [draft, setDraft] = useState<Letter | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft uppercase">
          {letters.length} letter{letters.length === 1 ? '' : 's'}
        </p>
        <AdminButton onClick={() => setDraft(blank())}>Add a letter</AdminButton>
      </div>

      {draft && (
        <form
          onSubmit={async (event) => {
            event.preventDefault()
            await saveLetter({ ...draft, body: draft.body.filter((p) => p.trim() !== '') })
            setDraft(null)
          }}
          className="photo-frame space-y-4 rounded-2xl bg-rose-50/80 p-6"
        >
          <AdminRow>
            <AdminField label="From">
              <AdminInput value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} />
            </AdminField>
            <AdminField label="To">
              <AdminInput value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} />
            </AdminField>
          </AdminRow>
          <AdminRow>
            <AdminField label="Date">
              <AdminInput
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
            </AdminField>
            <AdminField label="Title">
              <AdminInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </AdminField>
          </AdminRow>
          {draft.body.map((paragraph, index) => (
            <AdminField key={index} label={`Paragraph ${index + 1}`}>
              <AdminTextarea
                value={paragraph}
                onChange={(e) => {
                  const body = [...draft.body]
                  body[index] = e.target.value
                  setDraft({ ...draft, body })
                }}
              />
            </AdminField>
          ))}
          <div className="flex flex-wrap gap-3">
            <AdminButton
              variant="ghost"
              type="button"
              onClick={() => setDraft({ ...draft, body: [...draft.body, ''] })}
            >
              Add paragraph
            </AdminButton>
            {draft.body.length > 1 && (
              <AdminButton
                variant="ghost"
                type="button"
                onClick={() => setDraft({ ...draft, body: draft.body.slice(0, -1) })}
              >
                Remove last
              </AdminButton>
            )}
          </div>
          <AdminField label="Signature">
            <AdminInput
              value={draft.signature}
              onChange={(e) => setDraft({ ...draft, signature: e.target.value })}
            />
          </AdminField>
          <div className="flex gap-3">
            <AdminButton type="submit">Save letter</AdminButton>
            <AdminButton variant="ghost" type="button" onClick={() => setDraft(null)}>
              Cancel
            </AdminButton>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {letters.map((letter) => (
          <li key={letter.id} className="photo-frame rounded-2xl bg-white/90 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[0.62rem] tracking-[0.24em] text-rose-500 uppercase">
                  To {letter.to || '—'} · {letter.date}
                </p>
                <p className="font-display text-xl text-ink">{letter.title || 'Untitled'}</p>
                <p className="text-sm text-ink-soft">{letter.signature}</p>
              </div>
              <div className="flex gap-2">
                <AdminButton variant="ghost" onClick={() => setDraft(letter)}>
                  Edit
                </AdminButton>
                <AdminButton variant="danger" onClick={() => void removeLetter(letter.id)}>
                  Delete
                </AdminButton>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink-soft">
              {letter.body.join('\n\n') || <span className="italic">empty</span>}
            </p>
          </li>
        ))}
      </ul>

      <AdminNote>Empty paragraphs are dropped when you save.</AdminNote>
    </div>
  )
}