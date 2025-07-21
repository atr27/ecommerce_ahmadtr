import { Suspense } from 'react'
import ProductGrid from '@/components/products/product-grid'
import ProductFilters from '@/components/products/product-filters'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Product } from '@/types'

interface SearchParams {
  category?: string
  search?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  page?: string
}

async function getProducts(searchParams: SearchParams) {
  const supabase = createSupabaseServerClient()
  
  let query = supabase.from('products').select('*')

  // Apply filters
  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }

  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`)
  }

  if (searchParams.minPrice) {
    const minPrice = parseFloat(searchParams.minPrice)
    if (!isNaN(minPrice) && minPrice >= 0) {
      query = query.gte('price', minPrice)
    }
  }

  if (searchParams.maxPrice) {
    const maxPrice = parseFloat(searchParams.maxPrice)
    if (!isNaN(maxPrice) && maxPrice >= 0) {
      query = query.lte('price', maxPrice)
    }
  }

  // Apply sorting
  switch (searchParams.sort) {
    case 'price-low':
      query = query.order('price', { ascending: true })
      break
    case 'price-high':
      query = query.order('price', { ascending: false })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data: products, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return products || []
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const products = await getProducts(searchParams)

  const getPageTitle = () => {
    if (searchParams.search) {
      return `Search results for "${searchParams.search}"`
    }
    if (searchParams.category) {
      return `${searchParams.category} Games`
    }
    return 'All Games'
  }

  const getPageDescription = () => {
    if (searchParams.search) {
      return `Found ${products.length} games matching "${searchParams.search}"`
    }
    if (searchParams.category) {
      return `Discover the best ${searchParams.category} games`
    }
    return `Browse our collection of ${products.length} games`
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{getPageTitle()}</h1>
        <p className="text-muted-foreground">{getPageDescription()}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <Suspense fallback={<div>Loading filters...</div>}>
              <ProductFilters />
            </Suspense>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {products.length} products
            </p>
          </div>
          
          <Suspense fallback={<ProductGrid products={[]} isLoading />}>
            <ProductGrid products={products} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
