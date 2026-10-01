import type { CoupleSettings, JournalEntry, Letter, Person } from '../data/couple'
import { defaultCouple } from '../data/couple'
import type { MonthsaryEntry } from '../data/monthsaries'
import { supabase } from './supabase'

export type Table = 'couple_settings' | 'people' | 'journal_entries' | 'monthsary_entries' | 'letters'

function client() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

function asTextArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string')
  return []
}

export function toPerson(row: Record<string, unknown>): Person {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    initials: String(row.initials ?? ''),
    birthday: String(row.birthday ?? '').slice(0, 10),
    role: String(row.role ?? ''),
    traits: asTextArray(row.traits),
  }
}

export function toJournal(row: Record<string, unknown>): JournalEntry {
  return {
    id: String(row.id),
    date: String(row.entry_date ?? '').slice(0, 10),
    message: String(row.message ?? ''),
    feeling: String(row.feeling ?? ''),
  }
}

export function toMonthsary(row: Record<string, unknown>): MonthsaryEntry {
  return {
    id: String(row.id),
    month: Number(row.month ?? 1),
    title: String(row.title ?? ''),
    theme: String(row.theme ?? ''),
    body: String(row.body ?? ''),
    ritual: String(row.ritual ?? ''),
  }
}

export function toLetter(row: Record<string, unknown>): Letter {
  return {
    id: String(row.id),
    from: String(row.author ?? ''),
    to: String(row.recipient ?? ''),
    date: String(row.letter_date ?? '').slice(0, 10),
    title: String(row.title ?? ''),
    body: asTextArray(row.body),
    signature: String(row.signature ?? ''),
  }
}

export function toCouple(row: Record<string, unknown>): CoupleSettings {
  const value = (field: unknown, fallback: string) => {
    const text = String(field ?? '').trim()
    return text === '' ? fallback : text
  }
  return {
    title: value(row.title, defaultCouple.title),
    shortTitle: value(row.short_title, defaultCouple.shortTitle),
    startDate: String(row.start_date ?? '').slice(0, 10) || defaultCouple.startDate,
    tagline: value(row.tagline, defaultCouple.tagline),
    about: value(row.about, defaultCouple.about),
  }
}

export async function fetchTable<T>(
  table: Table,
  mapper: (row: Record<string, unknown>) => T,
  orderBy?: string,
): Promise<T[]> {
  const query = client().from(table).select('*')
  const { data, error } = orderBy ? await query.order(orderBy, { ascending: false }) : await query
  if (error) throw new Error(error.message)
  return ((data ?? []) as Record<string, unknown>[]).map(mapper)
}

export async function fetchCoupleSettings(): Promise<CoupleSettings | null> {
  const rows = await fetchTable('couple_settings', (row) => row)
  const row = rows[0]
  return row ? toCouple(row) : null
}

export async function insertRow(table: Table, values: Record<string, unknown>): Promise<void> {
  const { error } = await client().from(table).insert(values)
  if (error) throw new Error(error.message)
}

export async function updateRow(table: Table, id: string, values: Record<string, unknown>): Promise<void> {
  const { error } = await client().from(table).update(values).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteRow(table: Table, id: string): Promise<void> {
  const { error } = await client().from(table).delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export const coupleValues = (couple: CoupleSettings) => ({
  id: true,
  title: couple.title,
  short_title: couple.shortTitle,
  start_date: couple.startDate,
  tagline: couple.tagline,
  about: couple.about,
})

export const personValues = (person: Person) => ({
  name: person.name,
  initials: person.initials,
  birthday: person.birthday,
  role: person.role,
  traits: person.traits,
})

export const journalValues = (entry: JournalEntry) => ({
  entry_date: entry.date,
  message: entry.message,
  feeling: entry.feeling,
})

export const monthsaryValues = (entry: MonthsaryEntry) => ({
  month: entry.month,
  title: entry.title,
  theme: entry.theme,
  body: entry.body,
  ritual: entry.ritual,
})

export const letterValues = (letter: Letter) => ({
  author: letter.from,
  recipient: letter.to,
  letter_date: letter.date,
  title: letter.title,
  body: letter.body,
  signature: letter.signature,
})