'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/store/cart'
import { createSupabaseClient } from '@/lib/supabase'

interface OrderItem {
  id: string
  quantity: number
  price: number
  products: {
    name: string
    image_url: string
    category: string
  }
}

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  shipping_address: string
  order_items: OrderItem[]
}

// Supabase response type (products comes as array)
interface SupabaseOrderResponse {
  id: string
  total_amount: number
  status: string
  created_at: string
  shipping_address: string
  order_items: {
    id: string
    quantity: number
    price: number
    products: {
      name: string
      image_url: string
      category: string
    }[]
  }[]
}

export default function PaymentSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCartStore()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Get order ID from URL params (comes from Xendit redirect)
        const orderId = searchParams.get('order_id')
        const invoiceId = searchParams.get('invoice_id')

        if (!orderId) {
          router.push('/cart')
          return
        }

        // Verify user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        // First, update the order status to 'paid' if it's not already
        console.log('Updating order status for order ID:', orderId)
        
        let updateData = {
          status: 'paid',
          updated_at: new Date().toISOString()
        }

        // Update order status to 'paid' and payment_status to 'completed'
        try {
          const { data: updateResult, error: updateError } = await supabase
            .from('orders')
            .update({
              ...updateData,
              payment_status: 'completed'
            })
            .eq('id', orderId)
            .eq('user_id', user.id)
            .neq('status', 'paid') // Only update if not already paid
            .select()

          if (updateError) {
            console.error('Failed to update order with payment_status:', updateError)
            // Fallback: try updating without payment_status column
            const { data: fallbackResult, error: fallbackError } = await supabase
              .from('orders')
              .update(updateData)
              .eq('id', orderId)
              .eq('user_id', user.id)
              .neq('status', 'paid')
              .select()
            
            if (fallbackError) {
              console.error('Failed to update order status (fallback):', fallbackError)
            } else {
              console.log('Order status updated successfully (fallback):', fallbackResult)
            }
          } else {
            console.log('Order status updated successfully:', updateResult)
          }
        } catch (error) {
          console.error('Error updating order:', error)
        }

        // Fetch order details
        const { data: order, error } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            shipping_address,
            order_items (
              id,
              quantity,
              price,
              products (
                name,
                image_url,
                category
              )
            )
          `)
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single()

        if (error || !order) {
          console.error('Order fetch error:', error)
          router.push('/account')
          return
        }

        // Transform Supabase response to match our Order interface
        const transformedOrder: Order = {
          ...order,
          order_items: order.order_items.map(item => ({
            ...item,
            products: item.products[0] // Take first product from array
          }))
        }
        
        setOrder(transformedOrder)

        // Clear the cart since payment was successful
        await clearCart()

        // Redirect to dashboard after 3 seconds with success parameters
        setTimeout(() => {
          router.push(`/dashboard?payment_success=true&order_id=${orderId}${invoiceId ? `&invoice_id=${invoiceId}` : ''}`)
        }, 3000)

      } catch (error) {
        console.error('Payment success handling error:', error)
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    handlePaymentSuccess()
  }, [searchParams, router, supabase, clearCart])

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Processing your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        {/* Order Summary */}
        {order && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order Number</p>
                  <p className="font-medium">#{order.id.slice(0, 8)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Amount</p>
                  <p className="font-medium text-lg">
                    Rp {order.total_amount.toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                    Paid
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Items Ordered</h4>
                <div className="space-y-2">
                  {order.order_items?.map((item: OrderItem, index: number) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{item.products?.name}</p>
                        <p className="text-muted-foreground">
                          Qty: {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <p className="font-medium">
                        Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <p className="text-sm text-muted-foreground">
                  {order.shipping_address}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email confirmation with your order details.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">2</span>
              </div>
              <div>
                <p className="font-medium">Processing</p>
                <p className="text-sm text-muted-foreground">
                  We'll prepare your games for shipment within 1-2 business days.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <div>
                <p className="font-medium">Shipping</p>
                <p className="text-sm text-muted-foreground">
                  Track your package and receive updates via email.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redirect Notice */}
        <div className="text-center mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium mb-2">
              🎉 Redirecting you to your dashboard...
            </p>
            <p className="text-blue-600 text-sm">
              You'll be automatically redirected in a few seconds to view your order status.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto">
              <Package className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="outline" className="w-full sm:w-auto">
              <Package className="mr-2 h-4 w-4" />
              View All Orders
            </Button>
          </Link>
          <Link href="/products">
            <Button className="w-full sm:w-auto">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Need help with your order?
          </p>
          <Link href="/contact" className="text-primary hover:underline text-sm">
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  )
}
