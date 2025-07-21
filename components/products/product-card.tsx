'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/index'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useFavoritesStore } from '@/store/favorites'
import { createSupabaseClient } from '@/lib/supabase'

interface ProductCardProps {
  product: Product
  onFavoriteRemoved?: () => void
}

export default function ProductCard({ product, onFavoriteRemoved }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCartStore()
  const { isFavorited, addToFavorites, removeFromFavorites } = useFavoritesStore()
  const supabase = createSupabaseClient()
  
  const isProductFavorited = isFavorited(product.id)

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Redirect to login
        window.location.href = '/auth/login'
        return
      }
      await addItem(product.id)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login'
        return
      }

      if (isProductFavorited) {
        await removeFromFavorites(product.id)
        onFavoriteRemoved?.()
      } else {
        await addToFavorites(product.id)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PS5':
        return 'text-playstation'
      case 'Xbox':
        return 'text-xbox'
      case 'Nintendo':
        return 'text-nintendo'
      default:
        return 'text-primary'
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'PS5':
        return 'bg-playstation/10 text-playstation border-playstation/20'
      case 'Xbox':
        return 'bg-xbox/10 text-xbox border-xbox/20'
      case 'Nintendo':
        return 'bg-nintendo/10 text-nintendo border-nintendo/20'
      default:
        return 'bg-primary/10 text-primary border-primary/20'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryBadge(product.category)}`}>
              {product.category}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isProductFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-2 left-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                Only {product.stock} left
              </span>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">4.5</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || product.stock === 0}
            className="w-full"
          >
            {isLoading ? (
              'Adding...'
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
