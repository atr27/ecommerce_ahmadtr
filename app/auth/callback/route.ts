import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const errorCode = requestUrl.searchParams.get('error_code')
  
  // Get the correct base URL (ngrok URL from environment)
  const baseUrl = getBaseUrl()

  console.log('OAuth callback received:', {
    code: code ? 'present' : 'missing',
    error,
    errorDescription,
    errorCode,
    url: requestUrl.toString(),
    baseUrl
  })

  // Handle OAuth errors from provider
  if (error) {
    console.error('OAuth provider error:', { error, errorDescription, errorCode })
    const errorMessage = errorDescription || error
    return NextResponse.redirect(
      `${baseUrl}/auth/login?error=oauth_error&message=${encodeURIComponent(errorMessage)}`
    )
  }

  // Handle missing authorization code
  if (!code) {
    console.error('No authorization code received')
    return NextResponse.redirect(
      `${baseUrl}/auth/login?error=missing_code&message=${encodeURIComponent('Authorization code missing')}`
    )
  }

  // Exchange code for session
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(
        `${baseUrl}/auth/login?error=exchange_failed&message=${encodeURIComponent(exchangeError.message)}`
      )
    }

    if (data?.user) {
      console.log('OAuth authentication successful for user:', data.user.email)
      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(`${baseUrl}/dashboard`)
    } else {
      console.error('No user data received after code exchange')
      return NextResponse.redirect(
        `${baseUrl}/auth/login?error=no_user&message=${encodeURIComponent('No user data received')}`
      )
    }
  } catch (error) {
    console.error('Unexpected error during OAuth callback:', error)
    return NextResponse.redirect(
      `${baseUrl}/auth/login?error=unexpected&message=${encodeURIComponent('Authentication failed')}`
    )
  }
}
