import { createClient } from '@supabase/supabase-js'

// Lazily create the client only when env vars exist to avoid build-time errors
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let createdClient: any = null
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  createdClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

export const supabase = createdClient as any