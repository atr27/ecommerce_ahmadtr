'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Heart, Settings, LogOut, Edit, Trash2, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createSupabaseClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'



interface UserProfile {
  id: string
  email: string
  user_metadata: {
    name?: string
    avatar_url?: string
  }
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [favorites, setFavorites] = useState<Array<{
    id: any;
    products: Array<{
      id: any;
      name: any;
      price: any;
      image_url: any;
      category: any;
    }>;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/auth/login')
        return
      }

      setUser(user as UserProfile)
      setName(user.user_metadata?.name || '')

      // Fetch user favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select(`
          id,
          products (
            id,
            name,
            price,
            image_url,
            category
          )
        `)
        .eq('user_id', user.id)

      if (favoritesData) {
        setFavorites(favoritesData)
      }

      setIsLoading(false)
    }

    fetchUserData()
  }, [supabase, router])

  const handleUpdateProfile = async () => {
    if (!user) return

    const { error } = await supabase.auth.updateUser({
      data: { name }
    })

    if (error) {
      alert('Failed to update profile')
    } else {
      setIsEditing(false)
      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser()
      if (updatedUser) {
        setUser(updatedUser as UserProfile)
      }
    }
  }

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage('Please fill in both password fields')
      setMessageType('error')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match')
      setMessageType('error')
      return
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long')
      setMessageType('error')
      return
    }

    setIsUpdating(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        setMessage(error.message)
        setMessageType('error')
      } else {
        setMessage('Password updated successfully')
        setMessageType('success')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      setMessage('Failed to update password')
      setMessageType('error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data including orders, favorites, and profile information.'
    )

    if (!confirmed) return

    setIsDeleting(true)
    setMessage('')

    try {
      // Call our API endpoint to delete the account
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete account')
      }

      setMessage('Account deleted successfully')
      setMessageType('success')
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/')
      }, 2000)
      
    } catch (error) {
      console.error('Account deletion error:', error)
      setMessage('Failed to delete account. Please try again or contact support.')
      setMessageType('error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }



  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="md:col-span-2 h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground">
          Manage your profile and account settings
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert className={`mb-6 ${messageType === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <AlertDescription className={messageType === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleUpdateProfile}>
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold">
                      {user?.user_metadata?.name || 'User'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/orders')}
              >
                <Settings className="mr-2 h-4 w-4" />
                View Orders
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Orders and Favorites */}
        <div className="md:col-span-2 space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Change Password */}
              <div className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                <div className="space-y-3">
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button onClick={handleChangePassword} disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </div>
              
              {/* Delete Account */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-medium text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Favorites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Favorites ({favorites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No favorites yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Heart the games you love to save them here
                  </p>
                  <Button className="mt-4" onClick={() => router.push('/products')}>
                    Browse Games
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.slice(0, 4).map((favorite: any) => (
                    <div key={favorite.id} className="border rounded-lg p-3">
                      <div className="flex space-x-3">
                        <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {favorite.products?.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {favorite.products?.category}
                          </p>
                          <p className="font-semibold text-sm mt-1">
                            {formatPrice(favorite.products?.price || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {favorites.length > 4 && (
                    <Button variant="outline" className="col-span-full">
                      View All Favorites
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
