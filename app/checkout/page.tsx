'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CreditCard, MapPin, User, Phone, Mail, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { createSupabaseClient } from '@/lib/supabase'

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(5, 'Postal code must be at least 5 digits'),
  notes: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const [paymentUrl, setPaymentUrl] = useState('')
  const [orderId, setOrderId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const { items, getTotalPrice, getTotalItems } = useCartStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
      
      // Pre-fill form with user data
      setValue('email', user.email || '')
      setValue('name', user.user_metadata?.name || '')
    }
    
    checkUser()
  }, [supabase.auth, router, setValue])

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const onSubmit = async (data: CheckoutForm) => {
    setIsLoading(true)
    
    try {
      // Create order in database
      const orderData = {
        user_id: user?.id,
        total_amount: getTotalPrice() * 1.1, // Including tax
        shipping_address: `${data.address}, ${data.city}, ${data.postalCode}`,
        status: 'pending',
        order_items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product?.price || 0,
          product_name: item.product?.name || 'Game Product'
        }))
      }

      // Call API to create Xendit Invoice
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData,
          customerDetails: {
            first_name: data.name.split(' ')[0],
            last_name: data.name.split(' ').slice(1).join(' '),
            email: data.email,
            phone: data.phone,
          },
          shippingAddress: {
            first_name: data.name.split(' ')[0],
            last_name: data.name.split(' ').slice(1).join(' '),
            address: data.address,
            city: data.city,
            postal_code: data.postalCode,
            phone: data.phone,
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        setPaymentUrl(result.payment_url)
        setOrderId(result.order_id)
      } else {
        throw new Error(result.error || 'Failed to create payment')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to process checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return null // Will redirect to cart
  }

  // Show payment redirect if we have a payment URL
  if (paymentUrl) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
          <p className="text-muted-foreground">
            Secure payment for {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Ready
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your order has been created successfully. Click the button below to complete your payment securely through Xendit.
              </p>
              <div className="space-y-3">
                <p className="text-sm font-medium">Order ID: #{orderId}</p>
                <p className="text-sm text-muted-foreground">
                  You will be redirected to Xendit's secure payment page.
                </p>
              </div>
              <Button 
                onClick={() => window.open(paymentUrl, '_blank')}
                className="w-full"
                size="lg"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Pay Now with Xendit
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                After payment, you'll be redirected back to our site.
              </p>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatPrice(item.product?.price || 0)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice((item.product?.price || 0) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>{formatPrice(getTotalPrice() * 0.1)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(getTotalPrice() * 1.1)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your order for {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Street Address *
                </label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="Enter your street address"
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    City *
                  </label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="postalCode" className="text-sm font-medium">
                    Postal Code *
                  </label>
                  <Input
                    id="postalCode"
                    {...register('postalCode')}
                    placeholder="Enter postal code"
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Delivery Notes (Optional)
                </label>
                <Input
                  id="notes"
                  {...register('notes')}
                  placeholder="Any special delivery instructions"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × {formatPrice(item.product?.price || 0)}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(getTotalPrice() * 0.1)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(getTotalPrice() * 1.1)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Secure payment processing powered by Xendit. Your payment information is encrypted and secure.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span>Accepted payments:</span>
                  <span className="font-medium">Credit Card, Debit Card, Bank Transfer, E-Wallets</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSubmit(onSubmit)}
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : `Continue to Payment - ${formatPrice(getTotalPrice() * 1.1)}`}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            By placing your order, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
