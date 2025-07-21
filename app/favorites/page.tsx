'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { createSupabaseClient } from '@/lib/supabase'
import { useFavoritesStore } from '@/store/favorites'
import ProductCard from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null)
  const { favorites, isLoading, fetchFavorites } = useFavoritesStore()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await fetchFavorites()
      }
    }

    checkUser()
  }, [])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            You need to sign in to view your favorite games.
          </p>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            {favorites.length > 0 
              ? `You have ${favorites.length} favorite game${favorites.length === 1 ? '' : 's'}`
              : 'No favorite games yet'
            }
          </p>
        </motion.div>
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto">
            <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-4">No Favorites Yet</h2>
            <p className="text-muted-foreground mb-8">
              Start exploring our amazing collection of games and add your favorites by clicking the heart icon on any game card.
            </p>
            <div className="space-x-4">
              <Link href="/products">
                <Button>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Browse Games
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Call to Action */}
      {favorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12 pt-8 border-t"
        >
          <h3 className="text-xl font-semibold mb-4">Discover More Games</h3>
          <p className="text-muted-foreground mb-6">
            Explore our full collection to find more amazing games to add to your favorites.
          </p>
          <Link href="/products">
            <Button variant="outline">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse All Games
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  )
}
