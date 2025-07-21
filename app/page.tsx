import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, TrendingUp, Users, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ProductGrid from '@/components/products/product-grid'
import { createSupabaseServerClient } from '@/lib/supabase-server'

async function getFeaturedProducts() {
  const supabase = createSupabaseServerClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .limit(8)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return products || []
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container relative">
          <div className="flex flex-col lg:flex-row items-center py-16 lg:py-24">
            <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  GameSphere
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                Discover the latest console games for PlayStation, Xbox, and Nintendo. 
                Your ultimate gaming destination with the best prices and fastest delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products">
                  <Button size="lg" className="text-lg px-8">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products?category=PS5">
                  <Button variant="outline" size="lg" className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎮</div>
                    <h3 className="text-2xl font-bold text-white mb-2">10,000+</h3>
                    <p className="text-gray-300">Games Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose GameSphere?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We provide the best gaming experience with unmatched service and competitive prices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Premium Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Only authentic games from official distributors with full warranty coverage.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle>Best Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Competitive pricing with regular discounts and special offers for members.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle>24/7 Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Round-the-clock customer support to help you with any questions or issues.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle>Secure Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Safe and secure payment processing with multiple payment options available.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Platform</h2>
          <p className="text-muted-foreground text-lg">
            Find games for your favorite gaming console
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/products?category=PS5" className="group">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="playstation-gradient p-8 text-white text-center">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold mb-2">PlayStation 5</h3>
                <p className="opacity-90">Latest PS5 exclusives and games</p>
              </div>
            </Card>
          </Link>

          <Link href="/products?category=Xbox" className="group">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="xbox-gradient p-8 text-white text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2">Xbox Series</h3>
                <p className="opacity-90">Xbox Game Pass and exclusives</p>
              </div>
            </Card>
          </Link>

          <Link href="/products?category=Nintendo" className="group">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="nintendo-gradient p-8 text-white text-center">
                <div className="text-4xl mb-4">🕹️</div>
                <h3 className="text-2xl font-bold mb-2">Nintendo Switch</h3>
                <p className="opacity-90">Family-friendly Nintendo games</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Games</h2>
              <p className="text-muted-foreground">Discover the latest and most popular games</p>
            </div>
            <Link href="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-muted/50">
        <div className="container py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Gaming?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of gamers who trust GameSphere for their gaming needs. 
              Create an account today and get exclusive access to deals and early releases.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8">
                  Create Account
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Browse Games
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
