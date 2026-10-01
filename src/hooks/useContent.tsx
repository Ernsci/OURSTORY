import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { defaultCouple, defaultJournal, defaultLetters, defaultPeople } from '../data/couple'
import type { CoupleSettings, JournalEntry, Letter, Person } from '../data/couple'
import { defaultMonthsaries } from '../data/monthsaries'
import type { MonthsaryEntry } from '../data/monthsaries'
import {
  coupleValues,
  deleteRow,
  fetchCoupleSettings,
  fetchTable,
  insertRow,
  journalValues,
  letterValues,
  monthsaryValues,
  personValues,
  toJournal,
  toLetter,
  toMonthsary,
  toPerson,
  updateRow,
} from '../lib/remoteContent'
import type { Table } from '../lib/remoteContent'
import { describeError, isSupabaseConfigured, supabase } from '../lib/supabase'

interface Saveable {
  id: string
}

interface Content {
  loading: boolean
  error: string | null
  configured: boolean
  setError: (message: string | null) => void
  couple: CoupleSettings
  people: Person[]
  journal: JournalEntry[]
  monthsaries: MonthsaryEntry[]
  letters: Letter[]
  session: Session | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
  saveCouple: (value: CoupleSettings) => Promise<void>
  savePerson: (value: Person) => Promise<void>
  removePerson: (id: string) => Promise<void>
  saveJournal: (value: JournalEntry) => Promise<void>
  removeJournal: (id: string) => Promise<void>
  saveMonthsary: (value: MonthsaryEntry) => Promise<void>
  removeMonthsary: (id: string) => Promise<void>
  saveLetter: (value: Letter) => Promise<void>
  removeLetter: (id: string) => Promise<void>
}

const ContentContext = createContext<Content | null>(null)
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function useContent(): Content {
  const context = useContext(ContentContext)
  if (!context) throw new Error('useContent must be used inside ContentProvider')
  return context
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [couple, setCouple] = useState<CoupleSettings>(defaultCouple)
  const [people, setPeople] = useState<Person[]>(defaultPeople)
  const [journal, setJournal] = useState<JournalEntry[]>(defaultJournal)
  const [monthsaries, setMonthsaries] = useState<MonthsaryEntry[]>(defaultMonthsaries)
  const [letters, setLetters] = useState<Letter[]>(defaultLetters)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    try {
      const [settings, peopleRows, journalRows, monthsaryRows, letterRows] = await Promise.all([
        fetchCoupleSettings(),
        fetchTable('people', toPerson),
        fetchTable('journal_entries', toJournal, 'entry_date'),
        fetchTable('monthsary_entries', toMonthsary, 'month'),
        fetchTable('letters', toLetter),
      ])
      if (settings) setCouple(settings)
      if (peopleRows.length) setPeople(peopleRows)
      if (journalRows.length) setJournal(journalRows)
      if (monthsaryRows.length) setMonthsaries(monthsaryRows)
      if (letterRows.length) setLetters(letterRows)
      setError(null)
    } catch (cause) {
      setError(`Could not load from Supabase: ${describeError(cause)}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  const run = useCallback(async (work: () => Promise<void>) => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet, so nothing was saved.')
      return
    }
    try {
      await work()
      setError(null)
    } catch (cause) {
      setError(describeError(cause))
    }
  }, [])

  const save = useCallback(
    (table: Table, row: Saveable, values: Record<string, unknown>) =>
      run(async () => {
        if (UUID.test(row.id)) await updateRow(table, row.id, values)
        else await insertRow(table, values)
        await refresh()
      }),
    [run, refresh],
  )

  const remove = useCallback(
    (table: Table, id: string) =>
      run(async () => {
        await deleteRow(table, id)
        await refresh()
      }),
    [run, refresh],
  )

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      setError('Supabase is not configured yet.')
      return
    }
    const { error: failure } = await supabase.auth.signInWithPassword({ email, password })
    if (failure) setError(failure.message)
    else setError(null)
  }, [])

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
  }, [])

  const saveCouple = useCallback(
    (value: CoupleSettings) =>
      run(async () => {
        await updateRow('couple_settings', 'true', coupleValues(value))
        setCouple(value)
      }),
    [run],
  )

  const value = useMemo<Content>(
    () => ({
      loading,
      error,
      configured: isSupabaseConfigured,
      setError,
      couple,
      people,
      journal,
      monthsaries,
      letters,
      session,
      signIn,
      signOut,
      refresh,
      saveCouple,
      savePerson: (row: Person) => save('people', row, personValues(row)),
      removePerson: (id: string) => remove('people', id),
      saveJournal: (row: JournalEntry) => save('journal_entries', row, journalValues(row)),
      removeJournal: (id: string) => remove('journal_entries', id),
      saveMonthsary: (row: MonthsaryEntry) => save('monthsary_entries', row, monthsaryValues(row)),
      removeMonthsary: (id: string) => remove('monthsary_entries', id),
      saveLetter: (row: Letter) => save('letters', row, letterValues(row)),
      removeLetter: (id: string) => remove('letters', id),
    }),
    [
      loading,
      error,
      couple,
      people,
      journal,
      monthsaries,
      letters,
      session,
      signIn,
      signOut,
      refresh,
      saveCouple,
      save,
      remove,
    ],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}