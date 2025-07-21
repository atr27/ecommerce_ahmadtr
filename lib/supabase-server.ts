import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Safe environment variable access with build-time fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'

// Server component Supabase client (for use in server components)
export const createSupabaseServerClient = () => {
  // Runtime validation only when actually creating the client
  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-anon-key') {
    throw new Error('Supabase environment variables are not configured')
  }
  
  return createServerComponentClient({ cookies })
}

// Service role client for admin operations (server-side only)
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

export const supabaseAdmin = (() => {
  if (_supabaseAdmin) return _supabaseAdmin
  
  // Runtime validation only when actually creating the client
  if (supabaseUrl === 'https://placeholder.supabase.co' || serviceRoleKey === 'placeholder-service-role-key') {
    throw new Error('Supabase environment variables are not configured')
  }
  
  _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  return _supabaseAdmin
})()
