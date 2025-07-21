import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ProductDetailActions from '@/components/products/product-detail-actions'
import RelatedProducts from '@/components/products/related-products'

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string): Promise<Product | null> {
  const supabase = createSupabaseServerClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    return null
  }

  return product
}

async function getRelatedProducts(category: string, currentProductId: string): Promise<Product[]> {
  const supabase = createSupabaseServerClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', currentProductId)
    .limit(4)

  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }

  return products || []
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)

  const isInStock = product.stock > 0
  const stockStatus = product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link 
          href="/products" 
          className="inline-flex items-center text-purple-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative">
            <Card className="overflow-hidden bg-white/5 border-purple-500/20">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {!isInStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2 bg-purple-500/20 text-purple-300">
                {product.category}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">(4.0) • 127 reviews</span>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-purple-400 mb-4">
                {formatPrice(product.price)}
              </p>
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-3 h-3 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${isInStock ? 'text-green-400' : 'text-red-400'}`}>
                  {stockStatus}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-purple-500/20">
                <Truck className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="font-medium text-white">Free Shipping</p>
                  <p className="text-sm text-gray-400">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-purple-500/20">
                <Shield className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="font-medium text-white">Warranty</p>
                  <p className="text-sm text-gray-400">1 year coverage</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-purple-500/20">
                <RotateCcw className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="font-medium text-white">Returns</p>
                  <p className="text-sm text-gray-400">30-day policy</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <Suspense fallback={<div className="h-12 bg-gray-200 rounded animate-pulse"></div>}>
              <ProductDetailActions product={product} />
            </Suspense>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
            <Suspense fallback={<div className="h-64 bg-gray-200 rounded animate-pulse"></div>}>
              <RelatedProducts products={relatedProducts} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | GameSphere Console Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url],
    },
  }
}
