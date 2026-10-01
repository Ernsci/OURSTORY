import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

export const PHOTO_BUCKET = 'scrapbook'

function requireClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'db no configured',
    )
  }
  return supabase
}

export function describeError(cause: unknown): string {
  if (cause instanceof Error) return cause.message
  return 'Something went wrong talking to the database.'
}

export const db = {
  client: () => requireClient(),
}