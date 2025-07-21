import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Get environment variables with fallbacks for build time
const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is required in production')
    }
    // Return a placeholder during build time
    return 'https://placeholder.supabase.co'
  }
  return url
}

const getSupabaseAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required in production')
    }
    // Return a placeholder during build time
    return 'placeholder-anon-key'
  }
  return key
}

const getServiceRoleKey = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required in production')
    }
    // Return a placeholder during build time
    return 'placeholder-service-role-key'
  }
  return key
}

// Server component Supabase client (for use in server components)
export const createSupabaseServerClient = () => {
  // Only validate environment variables when actually creating the client
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  
  if (url === 'https://placeholder.supabase.co' || key === 'placeholder-anon-key') {
    throw new Error('Supabase environment variables are not configured')
  }
  
  return createServerComponentClient({ cookies })
}

// Service role client for admin operations (server-side only)
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

export const supabaseAdmin = (() => {
  if (_supabaseAdmin) return _supabaseAdmin
  
  const url = getSupabaseUrl()
  const serviceKey = getServiceRoleKey()
  
  if (url === 'https://placeholder.supabase.co' || serviceKey === 'placeholder-service-role-key') {
    throw new Error('Supabase environment variables are not configured')
  }
  
  _supabaseAdmin = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  return _supabaseAdmin
})()
