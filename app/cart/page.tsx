'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { createSupabaseClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { CartItem } from '@/types/index'

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const { 
    items, 
    fetchCart, 
    updateQuantity, 
    removeItem, 
    getTotalPrice, 
    getTotalItems,
    isLoading: cartLoading 
  } = useCartStore()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
      await fetchCart()
      setIsLoading(false)
    }
    
    checkUser()
  }, [supabase.auth, fetchCart, router])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId)
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any games to your cart yet. 
            Start shopping to fill it up!
          </p>
          <Link href="/products">
            <Button size="lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Link href="/products" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: CartItem) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product?.image_url || '/placeholder.jpg'}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {item.product?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product?.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || cartLoading}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={cartLoading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatPrice((item.product?.price || 0) * item.quantity)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.product?.price || 0)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(getTotalPrice() * 0.1)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(getTotalPrice() * 1.1)}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCheckout} 
                className="w-full" 
                size="lg"
                disabled={cartLoading}
              >
                Proceed to Checkout
              </Button>

              <div className="text-center">
                <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
                  Continue Shopping
                </Link>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground pt-4 border-t">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Secure checkout powered by Midtrans</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
