import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (for use in client components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client component Supabase client (for use in client components with auth)
export const createSupabaseClient = () => createClientComponentClient()
