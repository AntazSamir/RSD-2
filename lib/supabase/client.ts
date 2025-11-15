import { createClient } from '@supabase/supabase-js'

// Lazily create the client only when env vars exist to avoid build-time errors
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

let createdClient: any = null
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    createdClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn('Supabase is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.')
  }
}

export const supabase = createdClient as any