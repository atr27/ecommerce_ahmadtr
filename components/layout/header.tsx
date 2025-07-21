'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingCart, User, Search, Heart, Menu, X, LayoutDashboard, Package, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { useCartStore } from '@/store/cart'
import { useFavoritesStore } from '@/store/favorites'
import { createSupabaseClient } from '@/lib/supabase'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { User as SupabaseUser } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const supabase = createSupabaseClient()
  const { getTotalItems, fetchCart, clearCartState } = useCartStore()
  const { fetchFavorites, clearFavorites } = useFavoritesStore()

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

        return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, fetchCart, fetchFavorites, clearCartState, clearFavorites])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

    const handleSignOut = async () => {
    clearCartState()
    clearFavorites()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh() // Ensures the page is re-rendered with the user signed out
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <div className="gaming-gradient rounded-lg p-2 shadow-md">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <span className="hidden sm:inline-block text-xl font-bold">GameSphere</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/products" className="text-muted-foreground transition-colors hover:text-primary">All Games</Link>
          <Link href="/products?category=PS5" className="text-muted-foreground transition-colors hover:text-playstation">PlayStation</Link>
          <Link href="/products?category=Xbox" className="text-muted-foreground transition-colors hover:text-xbox">Xbox</Link>
          <Link href="/products?category=Nintendo" className="text-muted-foreground transition-colors hover:text-nintendo">Nintendo</Link>
        </nav>

        <div className="flex items-center justify-end flex-1 space-x-2 sm:space-x-4">
          <form onSubmit={handleSearch} className="hidden sm:block relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-9"
            />
          </form>

          <Link href="/favorites" passHref>
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {useFavoritesStore.getState().favorites.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {useFavoritesStore.getState().favorites.length}
                </span>
              )}
              <span className="sr-only">Favorites</span>
            </Button>
          </Link>

          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {getTotalItems()}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard" passHref><DropdownMenuItem><LayoutDashboard className="mr-2 h-4 w-4" /><span>Dashboard</span></DropdownMenuItem></Link>
                <Link href="/orders" passHref><DropdownMenuItem><Package className="mr-2 h-4 w-4" /><span>My Orders</span></DropdownMenuItem></Link>
                <Link href="/account" passHref><DropdownMenuItem><User className="mr-2 h-4 w-4" /><span>My Account</span></DropdownMenuItem></Link>
                <Link href="/favorites" passHref><DropdownMenuItem><Heart className="mr-2 h-4 w-4" /><span>Favorites</span></DropdownMenuItem></Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}><X className="mr-2 h-4 w-4" /><span>Sign Out</span></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/auth/login" passHref><Button variant="outline" size="sm">Sign In</Button></Link>
              <Link href="/auth/register" passHref><Button size="sm">Sign Up</Button></Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xs">
              <nav className="flex flex-col space-y-4">
                <SheetClose asChild><Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">All Games</Link></SheetClose>
                <SheetClose asChild><Link href="/products?category=PS5" className="text-sm font-medium hover:text-playstation transition-colors">PlayStation</Link></SheetClose>
                <SheetClose asChild><Link href="/products?category=Xbox" className="text-sm font-medium hover:text-xbox transition-colors">Xbox</Link></SheetClose>
                <SheetClose asChild><Link href="/products?category=Nintendo" className="text-sm font-medium hover:text-nintendo transition-colors">Nintendo</Link></SheetClose>
              </nav>
              <div className="pt-4 mt-4 border-t">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <SheetClose asChild><Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors py-2">Dashboard</Link></SheetClose>
                    <SheetClose asChild><Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors py-2">My Orders</Link></SheetClose>
                    <SheetClose asChild><Link href="/account" className="text-sm font-medium hover:text-primary transition-colors py-2">My Account</Link></SheetClose>
                    <SheetClose asChild><Link href="/favorites" className="text-sm font-medium hover:text-primary transition-colors py-2">Favorites</Link></SheetClose>
                    <SheetClose asChild><Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">Sign Out</Button></SheetClose>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <SheetClose asChild><Link href="/auth/login" passHref><Button variant="outline" size="sm" className="w-full">Sign In</Button></Link></SheetClose>
                    <SheetClose asChild><Link href="/auth/register" passHref><Button size="sm" className="w-full">Sign Up</Button></Link></SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
