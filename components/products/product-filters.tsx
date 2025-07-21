'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface ProductFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export default function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  
  // Local state for custom price inputs to enable debouncing
  const [localMinPrice, setLocalMinPrice] = useState('')
  const [localMaxPrice, setLocalMaxPrice] = useState('')

  const currentCategory = searchParams.get('category') || ''
  const currentSearch = searchParams.get('search') || ''
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''
  
  // Sync local state with URL params
  useEffect(() => {
    setLocalMinPrice(currentMinPrice)
    setLocalMaxPrice(currentMaxPrice)
  }, [currentMinPrice, currentMaxPrice])

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'PS5', label: 'PlayStation 5', color: 'playstation' },
    { value: 'Xbox', label: 'Xbox Series', color: 'xbox' },
    { value: 'Nintendo', label: 'Nintendo Switch', color: 'nintendo' },
    { value: 'PC', label: 'PC Games', color: 'primary' },
  ]

  const priceRanges = [
    { min: '', max: '', label: 'All Prices' },
    { min: '0', max: '500000', label: 'Under Rp 500K' },
    { min: '500000', max: '1000000', label: 'Rp 500K - Rp 1M' },
    { min: '1000000', max: '1500000', label: 'Rp 1M - Rp 1.5M' },
    { min: '1500000', max: '', label: 'Over Rp 1.5M' },
  ]

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/products?${params.toString()}`)
  }

  const updatePriceRange = (minPrice: string, maxPrice: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update local state immediately for better UX
    setLocalMinPrice(minPrice)
    setLocalMaxPrice(maxPrice)
    
    if (minPrice) {
      params.set('minPrice', minPrice)
    } else {
      params.delete('minPrice')
    }
    
    if (maxPrice) {
      params.set('maxPrice', maxPrice)
    } else {
      params.delete('maxPrice')
    }

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/products')
  }

  // Debounced price update function
  const debouncedPriceUpdate = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (minPrice: string, maxPrice: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          const params = new URLSearchParams(searchParams.toString())
          
          if (minPrice) {
            params.set('minPrice', minPrice)
          } else {
            params.delete('minPrice')
          }
          
          if (maxPrice) {
            params.set('maxPrice', maxPrice)
          } else {
            params.delete('maxPrice')
          }

          router.push(`/products?${params.toString()}`)
        }, 500) // 500ms delay
      }
    })(),
    [router, searchParams]
  )

  // Handle custom price input changes
  const handleMinPriceChange = (value: string) => {
    setLocalMinPrice(value)
    debouncedPriceUpdate(value, localMaxPrice)
  }

  const handleMaxPriceChange = (value: string) => {
    setLocalMaxPrice(value)
    debouncedPriceUpdate(localMinPrice, value)
  }

  const hasActiveFilters = currentCategory || currentSearch || currentMinPrice || currentMaxPrice

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </div>
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      <div className={`${isOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-6 scrollbar-thin">
        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Filters</span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        )}

        {/* Category Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => updateFilters('category', category.value)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  currentCategory === category.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {category.label}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Price Range Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Price Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {priceRanges.map((range) => (
              <button
                key={`${range.min}-${range.max}`}
                onClick={() => {
                  updatePriceRange(range.min, range.max)
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  currentMinPrice === range.min && currentMaxPrice === range.max
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {range.label}
              </button>
            ))}
            
            {/* Custom Price Range */}
            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-2">Custom Range</p>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={localMinPrice}
                  onChange={(e) => handleMinPriceChange(e.target.value)}
                  className="text-xs"
                  min="0"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={localMaxPrice}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                  className="text-xs"
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sort Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sort By</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { value: 'newest', label: 'Newest First' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'name', label: 'Name A-Z' },
            ].map((sort) => (
              <button
                key={sort.value}
                onClick={() => updateFilters('sort', sort.value)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  searchParams.get('sort') === sort.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </CardContent>
        </Card>
        </div>
      </div>
    </>
  )
}
