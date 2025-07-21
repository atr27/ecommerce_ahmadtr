'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, Calendar, CreditCard, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createSupabaseClient } from '@/lib/supabase'
import { formatPrice, formatDate } from '@/lib/utils'
import Image from 'next/image'

interface OrderItem {
  id: string
  quantity: number
  price: number
  products: {
    id: string
    name: string
    image_url: string
    category: string
  }
}

interface Order {
  id: string
  total_amount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
  shipping_address: string
  payment_token?: string
  order_items: OrderItem[]
}

const statusConfig = {
  pending: { 
    icon: Clock, 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'Pending Payment'
  },
  paid: { 
    icon: CheckCircle, 
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Payment Confirmed'
  },
  shipped: { 
    icon: Package, 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    label: 'Shipped'
  },
  delivered: { 
    icon: Package, 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    label: 'Delivered'
  },
  cancelled: { 
    icon: XCircle, 
    color: 'bg-red-100 text-red-800 border-red-200',
    label: 'Cancelled'
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        router.push('/auth/login')
        return
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            products (
              id,
              name,
              image_url,
              category
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Error fetching orders:', ordersError)
        return
      }

      setOrders(ordersData || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }



  const markAsDelivered = async (orderId: string) => {
    try {
      setUpdatingOrderId(orderId)
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'delivered',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) {
        console.error('Error updating order status:', error)
        alert('Failed to update order status. Please try again.')
        return
      }

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'delivered' as const, updated_at: new Date().toISOString() }
            : order
        )
      )

      // Update selected order if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? {
          ...prev,
          status: 'delivered' as const,
          updated_at: new Date().toISOString()
        } : null)
      }

      alert('Order marked as delivered successfully!')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update order status. Please try again.')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    const StatusIcon = statusConfig[status].icon
    return <StatusIcon className="h-4 w-4" />
  }

  const getStatusBadge = (status: Order['status']) => {
    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={`${config.color} font-medium`}>
        {getStatusIcon(status)}
        <span className="ml-1">{config.label}</span>
      </Badge>
    )
  }

  const calculateOrderTotal = (orderItems: OrderItem[]) => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)
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
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your game orders</p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping for your favorite games!
            </p>
            <Button onClick={() => router.push('/')}>
              Browse Games
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {formatPrice(order.total_amount)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    {order.status === 'paid' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => markAsDelivered(order.id)}
                        disabled={updatingOrderId === order.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {updatingOrderId === order.id ? (
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        {updatingOrderId === order.id ? 'Updating...' : 'Has Arrived'}
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Order Details #{order.id.slice(-8).toUpperCase()}
                          </DialogTitle>
                          <DialogDescription>
                            View complete order information including items, status, and shipping details.
                          </DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Order Status */}
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">Order Status</h4>
                                <p className="text-sm text-muted-foreground">
                                  Last updated: {formatDate(selectedOrder.updated_at)}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                {getStatusBadge(selectedOrder.status)}
                                {selectedOrder.status === 'paid' && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => markAsDelivered(selectedOrder.id)}
                                    disabled={updatingOrderId === selectedOrder.id}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {updatingOrderId === selectedOrder.id ? (
                                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                    )}
                                    {updatingOrderId === selectedOrder.id ? 'Updating...' : 'Has Arrived'}
                                  </Button>
                                )}
                              </div>
                            </div>

                            <Separator />

                            {/* Order Items */}
                            <div>
                              <h4 className="font-semibold mb-4">Items Ordered</h4>
                              <div className="space-y-4">
                                {selectedOrder.order_items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                      <Image
                                        src={item.products.image_url || '/placeholder-game.jpg'}
                                        alt={item.products.name}
                                        fill
                                        className="object-cover rounded"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium">{item.products.name}</h5>
                                      <p className="text-sm text-muted-foreground">
                                        {item.products.category} • Qty: {item.quantity}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">{formatPrice(item.price)}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Total: {formatPrice(item.price * item.quantity)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Shipping Address */}
                            <div>
                              <h4 className="font-semibold mb-2">Shipping Address</h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {selectedOrder.shipping_address}
                              </p>
                            </div>

                            <Separator />

                            {/* Order Summary */}
                            <div>
                              <h4 className="font-semibold mb-4">Order Summary</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Subtotal</span>
                                  <span>{formatPrice(selectedOrder.total_amount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Shipping</span>
                                  <span>Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                  <span>Total</span>
                                  <span>{formatPrice(selectedOrder.total_amount)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Order Items Preview */}
                <div className="space-y-3">
                  {order.order_items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={item.products.image_url || '/placeholder-game.jpg'}
                          alt={item.products.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.products.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} • {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.order_items.length > 2 && (
                    <p className="text-sm text-muted-foreground">
                      +{order.order_items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Shipping Address Preview */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Shipping to:</strong> {order.shipping_address.split('\n')[0]}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
