'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createSupabaseClient } from '@/lib/supabase'

export default function PaymentFailedPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const handlePaymentFailure = async () => {
      try {
        const orderId = searchParams.get('order_id')
        
        if (orderId) {
          // Fetch order details
          const { data: order, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (name, image_url, category)
              )
            `)
            .eq('id', orderId)
            .single()

          if (!error && order) {
            setOrderDetails(order)
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    handlePaymentFailure()
  }, [searchParams, supabase])

  const handleRetryPayment = () => {
    if (orderDetails) {
      // Redirect back to checkout with the same order
      router.push(`/checkout?retry_order=${orderDetails.id}`)
    } else {
      router.push('/cart')
    }
  }

  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">Payment Failed</CardTitle>
            <p className="text-muted-foreground">
              We couldn't process your payment. Please try again.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderDetails && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-mono">#{orderDetails.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                      }).format(orderDetails.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="capitalize text-destructive">{orderDetails.status}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Common reasons for payment failure:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Insufficient funds in your account</li>
                <li>• Incorrect payment details</li>
                <li>• Network connection issues</li>
                <li>• Payment method not supported</li>
                <li>• Transaction timeout</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleRetryPayment}
                className="flex-1"
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Payment
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/cart')}
                className="flex-1"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Need help? Contact our support team
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <Link href="/contact" className="text-primary hover:underline">
                  Contact Support
                </Link>
                <Link href="/help" className="text-primary hover:underline">
                  Help Center
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
