import { useEffect, useState } from 'react'
import { AdminButton, AdminField, AdminInput, AdminRow, AdminTextarea } from './AdminField'
import { useContent } from '../hooks/useContent'

export function AdminSettings() {
  const { couple, saveCouple } = useContent()
  const [draft, setDraft] = useState(couple)
  const [saved, setSaved] = useState(false)

  useEffect(() => setDraft(couple), [couple])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    await saveCouple(draft)
    setSaved(true)
  }

  return (
    <form onSubmit={submit} className="photo-frame space-y-5 rounded-2xl bg-white/90 p-6">
      <AdminRow>
        <AdminField label="Title" hint="Shown big on the cover.">
          <AdminInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </AdminField>
        <AdminField label="Short title" hint="Used in the top-left corner.">
          <AdminInput
            value={draft.shortTitle}
            onChange={(e) => setDraft({ ...draft, shortTitle: e.target.value })}
          />
        </AdminField>
      </AdminRow>

      <AdminField label="Day one" hint="The counter on the home page counts up from this date.">
        <AdminInput
          type="date"
          value={draft.startDate}
          onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
        />
      </AdminField>

      <AdminField label="Tagline">
        <AdminInput value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} />
      </AdminField>

      <AdminField label="About" hint="A sentence or two about the two of you.">
        <AdminTextarea value={draft.about} onChange={(e) => setDraft({ ...draft, about: e.target.value })} />
      </AdminField>

      <div className="flex items-center gap-3">
        <AdminButton type="submit">Save</AdminButton>
        {saved && <span className="text-xs text-rose-600">Saved. The live page already shows it.</span>}
      </div>
    </form>
  )
}