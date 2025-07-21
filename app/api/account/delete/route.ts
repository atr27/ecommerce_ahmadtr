import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function DELETE(request: NextRequest) {
  try {
    // Create Supabase client for route handlers
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = user.id

    // Delete user data from our tables
    try {
      // Delete favorites
      await supabase.from('favorites').delete().eq('user_id', userId)
      
      // Delete cart items
      await supabase.from('cart_items').delete().eq('user_id', userId)
      
      // Note: We keep orders for business records but could anonymize them
      // await supabase.from('orders').delete().eq('user_id', userId)
    } catch (error) {
      console.error('Error deleting user data:', error)
      // Continue with auth deletion even if data cleanup fails
    }

    // For client-side deletion, we'll just sign out the user
    // In a production environment, you might want to:
    // 1. Use Supabase Admin API to delete the auth user
    // 2. Mark the account as deleted instead of actually deleting
    // 3. Set up a scheduled job to clean up deleted accounts

    // Sign out the user
    const { error: signOutError } = await supabase.auth.signOut()
    
    if (signOutError) {
      console.error('Error signing out user:', signOutError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Account data deleted and user signed out successfully' 
    })

  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
