'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingCart, User, Search, Heart, Menu, X, LayoutDashboard, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cart'
import { useFavoritesStore } from '@/store/favorites'
import { formatPrice, formatDate, getBaseUrl } from '@/lib/utils'
import { createSupabaseClient } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const supabase = createSupabaseClient()
  const { getTotalItems, fetchCart, clearCart, clearCartState } = useCartStore()
  const { fetchFavorites, clearFavorites, favorites } = useFavoritesStore()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchCart()
        fetchFavorites()
      } else {
        clearFavorites()
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCart()
        fetchFavorites()
      } else {
        // Clear both cart and favorites when user logs out
        clearCartState() // Use immediate state clearing for better UX
        clearFavorites()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, fetchCart, fetchFavorites, clearCartState, clearFavorites])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    // Clear cart and favorites state immediately
    clearCartState()
    clearFavorites()
    
    // Sign out from Supabase (no redirectTo parameter needed)
    await supabase.auth.signOut()
    
    // Manually redirect to home page
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="gaming-gradient rounded-lg p-2">
            <span className="text-xl font-bold text-white">GS</span>
          </div>
          <span className="text-xl font-bold">GameSphere</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
            All Games
          </Link>
          <Link href="/products?category=PS5" className="text-sm font-medium hover:text-playstation transition-colors">
            PlayStation
          </Link>
          <Link href="/products?category=Xbox" className="text-sm font-medium hover:text-xbox transition-colors">
            Xbox
          </Link>
          <Link href="/products?category=Nintendo" className="text-sm font-medium hover:text-nintendo transition-colors">
            Nintendo
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Link href="/favorites" className="relative">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Button>
              </Link>
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon" title="Dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button variant="ghost" size="icon" title="My Orders">
                    <Package className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/account">
                  <Button variant="ghost" size="icon" title="Account">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors py-2">
                All Games
              </Link>
              <Link href="/products?category=PS5" className="text-sm font-medium hover:text-playstation transition-colors py-2">
                PlayStation
              </Link>
              <Link href="/products?category=Xbox" className="text-sm font-medium hover:text-xbox transition-colors py-2">
                Xbox
              </Link>
              <Link href="/products?category=Nintendo" className="text-sm font-medium hover:text-nintendo transition-colors py-2">
                Nintendo
              </Link>
            </nav>

            {/* Mobile User Actions */}
            {user ? (
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors py-2">
                  Dashboard
                </Link>
                <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors py-2">
                  My Orders
                </Link>
                <Link href="/account" className="text-sm font-medium hover:text-primary transition-colors py-2">
                  My Account
                </Link>
                <Link href="/favorites" className="text-sm font-medium hover:text-primary transition-colors py-2">
                  Favorites
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
