'use client'

import { useState } from 'react'
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { useCartStore } from '@/store/cart'
import { createSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ProductDetailActionsProps {
  product: Product
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const { addItem } = useCartStore()
  const supabase = createSupabaseClient()
  const router = useRouter()

  const isInStock = product.stock > 0
  const maxQuantity = Math.min(product.stock, 10) // Limit to 10 or stock, whichever is lower

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please sign in to add items to cart')
        router.push('/auth/login')
        return
      }

      await addItem(product.id, quantity)
      toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add item to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleFavorite = async () => {
    setIsTogglingFavorite(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please sign in to add favorites')
        router.push('/auth/login')
        return
      }

      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id)

        if (error) throw error
        setIsFavorited(false)
        toast.success('Removed from favorites')
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id
          })

        if (error) throw error
        setIsFavorited(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    if (!isAddingToCart) {
      router.push('/cart')
    }
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      {isInStock && (
        <div className="flex items-center gap-4">
          <span className="text-white font-medium">Quantity:</span>
          <div className="flex items-center border border-purple-500/30 rounded-lg bg-white/5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="text-white hover:bg-purple-500/20"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="px-4 py-2 text-white font-medium min-w-[3rem] text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= maxQuantity}
              className="text-white hover:bg-purple-500/20"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <span className="text-gray-400 text-sm">
            {maxQuantity} available
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={!isInStock || isAddingToCart}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          size="lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
        
        <Button
          onClick={handleBuyNow}
          disabled={!isInStock || isAddingToCart}
          variant="outline"
          className="flex-1 border-purple-500 text-purple-300 hover:bg-purple-500/20"
          size="lg"
        >
          Buy Now
        </Button>

        <Button
          onClick={handleToggleFavorite}
          disabled={isTogglingFavorite}
          variant="outline"
          size="lg"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorited ? 'fill-current text-red-500' : ''}`} 
          />
        </Button>
      </div>

      {!isInStock && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 font-medium">This item is currently out of stock</p>
          <p className="text-red-300 text-sm mt-1">
            Check back later or browse similar products
          </p>
        </div>
      )}
    </div>
  )
}
