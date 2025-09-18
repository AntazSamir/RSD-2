import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client using the service role key.
// Never expose this client to the browser.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

let createdAdminClient: any = null
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  createdAdminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
}

export const supabaseAdmin = createdAdminClient as any


