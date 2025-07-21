'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Package, Heart, ShoppingCart, TrendingUp, Calendar, CheckCircle, Clock, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createSupabaseClient } from '@/lib/supabase'
import { formatPrice, formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'



interface DashboardStats {
  totalOrders: number
  totalSpent: number
  pendingOrders: number
  favoriteItems: number
}

interface UserProfile {
  id: string
  email: string
  user_metadata: {
    name?: string
    avatar_url?: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    favoriteItems: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createSupabaseClient()

  useEffect(() => {
    // Check if user came from successful payment
    const paymentSuccess = searchParams.get('payment_success')
    const orderId = searchParams.get('order_id')
    
    if (paymentSuccess === 'true' && orderId) {
      setShowSuccessAlert(true)
      // Clean up URL parameters
      const url = new URL(window.location.href)
      url.searchParams.delete('payment_success')
      url.searchParams.delete('order_id')
      url.searchParams.delete('invoice_id')
      window.history.replaceState({}, '', url.toString())
    }

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        router.push('/auth/login')
        return
      }

      // Transform Supabase User to UserProfile with proper type handling
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email || '', // Handle undefined email
        user_metadata: user.user_metadata || {}
      }
      setUser(userProfile)



      // Fetch dashboard statistics
      const [ordersCount, totalSpent, pendingCount, favoritesCount] = await Promise.all([
        // Total orders count
        supabase
          .from('orders')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id),
        
        // Total amount spent (only delivered orders)
        supabase
          .from('orders')
          .select('total_amount')
          .eq('user_id', user.id)
          .eq('status', 'delivered'),
        
        // Pending orders count
        supabase
          .from('orders')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('status', 'pending'),
        
        // Favorites count
        supabase
          .from('favorites')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
      ])

      const totalSpentAmount = totalSpent.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

      setStats({
        totalOrders: ordersCount.count || 0,
        totalSpent: totalSpentAmount,
        pendingOrders: pendingCount.count || 0,
        favoriteItems: favoritesCount.count || 0
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }



  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Alert */}
      {showSuccessAlert && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Payment Successful!</strong> Your order has been confirmed and is being processed.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Gamer'}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your GameSphere account
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              All time purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              On completed orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteItems}</div>
            <p className="text-xs text-muted-foreground">
              Games in wishlist
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/orders')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              View All Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your orders and view purchase history
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/favorites')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              My Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Browse your favorite games and wishlist
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/account')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage your profile and preferences
            </p>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}
