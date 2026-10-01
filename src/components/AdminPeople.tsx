import { useState } from 'react'
import { AdminButton, AdminField, AdminInput, AdminNote } from './AdminField'
import type { Person } from '../data/couple'
import { useContent } from '../hooks/useContent'

export function AdminPeople() {
  const { people, savePerson, removePerson } = useContent()
  const [draft, setDraft] = useState<Person | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[0.62rem] tracking-[0.24em] text-ink-soft uppercase">The two of you</p>
        <AdminButton
          onClick={() =>
            setDraft({ id: `new-${Date.now()}`, name: '', initials: '', birthday: '', role: '', traits: [] })
          }
        >
          Add a person
        </AdminButton>
      </div>

      {draft && (
        <PersonForm
          draft={draft}
          onChange={setDraft}
          onCancel={() => setDraft(null)}
          onSave={async (person) => {
            await savePerson(person)
            setDraft(null)
          }}
        />
      )}

      <ul className="space-y-3">
        {people.map((person) => (
          <li key={person.id} className="photo-frame rounded-2xl bg-white/90 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl text-ink">{person.name}</p>
                <p className="font-hand text-lg text-rose-600">{person.role}</p>
                <p className="font-mono text-[0.62rem] tracking-[0.2em] text-ink-soft uppercase">
                  {person.birthday || 'no birthday set'}
                </p>
              </div>
              <div className="flex gap-2">
                <AdminButton variant="ghost" onClick={() => setDraft(person)}>
                  Edit
                </AdminButton>
                <AdminButton variant="danger" onClick={() => void removePerson(person.id)}>
                  Delete
                </AdminButton>
              </div>
            </div>
            {person.traits.length > 0 && (
              <ul className="mt-2 font-hand text-lg text-rose-700">
                {person.traits.map((trait) => (
                  <li key={trait}>✧ {trait}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <AdminNote>Traits are one per line. Blank lines are ignored.</AdminNote>
    </div>
  )
}

interface PersonFormProps {
  draft: Person
  onChange: (person: Person) => void
  onSave: (person: Person) => Promise<void>
  onCancel: () => void
}

function PersonForm({ draft, onChange, onSave, onCancel }: PersonFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void onSave({
          ...draft,
          traits: draft.traits.map((trait) => trait.trim()).filter(Boolean),
        })
      }}
      className="photo-frame space-y-4 rounded-2xl bg-rose-50/80 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <AdminField label="Name">
          <AdminInput value={draft.name} onChange={(e) => onChange({ ...draft, name: e.target.value })} />
        </AdminField>
        <AdminField label="Initial">
          <AdminInput
            maxLength={2}
            value={draft.initials}
            onChange={(e) => onChange({ ...draft, initials: e.target.value })}
          />
        </AdminField>
        <AdminField label="Birthday">
          <AdminInput
            type="date"
            value={draft.birthday}
            onChange={(e) => onChange({ ...draft, birthday: e.target.value })}
          />
        </AdminField>
      </div>
      <AdminField label="Role">
        <AdminInput value={draft.role} onChange={(e) => onChange({ ...draft, role: e.target.value })} />
      </AdminField>
      <AdminField label="Traits" hint="One per line.">
        <textarea
          value={draft.traits.join('\n')}
          onChange={(e) => onChange({ ...draft, traits: e.target.value.split('\n') })}
          className="mt-1.5 min-h-24 w-full resize-y rounded-lg border border-rose-200 bg-white px-3 py-2 font-hand text-xl text-ink outline-none focus:border-rose-400"
        />
      </AdminField>
      <div className="flex gap-3">
        <AdminButton type="submit">Save</AdminButton>
        <AdminButton variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </AdminButton>
      </div>
    </form>
  )
}