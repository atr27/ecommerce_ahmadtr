import { create } from 'zustand'
import { createSupabaseClient } from '@/lib/supabase'
import { Product } from '@/types/index'

interface FavoritesState {
  favorites: Product[]
  isLoading: boolean
  addToFavorites: (productId: string) => Promise<void>
  removeFromFavorites: (productId: string) => Promise<void>
  fetchFavorites: () => Promise<void>
  isFavorited: (productId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,

  addToFavorites: async (productId: string) => {
    const supabase = createSupabaseClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Add to database
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_id: productId
        })

      if (error) throw error

      // Fetch updated favorites
      await get().fetchFavorites()
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  },

  removeFromFavorites: async (productId: string) => {
    const supabase = createSupabaseClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Remove from database
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) throw error

      // Update local state
      set(state => ({
        favorites: state.favorites.filter(product => product.id !== productId)
      }))
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  },

  fetchFavorites: async () => {
    const supabase = createSupabaseClient()
    
    try {
      set({ isLoading: true })
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ favorites: [], isLoading: false })
        return
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          products (
            id,
            name,
            description,
            price,
            category,
            image_url,
            stock,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform the data to match Product type
      const favoriteProducts: Product[] = data?.map(item => {
        const product = item.products
        if (product && typeof product === 'object' && !Array.isArray(product)) {
          return product as Product
        }
        return null
      }).filter((product): product is Product => product !== null) || []
      
      set({ 
        favorites: favoriteProducts,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching favorites:', error)
      set({ favorites: [], isLoading: false })
    }
  },

  isFavorited: (productId: string) => {
    return get().favorites.some(product => product.id === productId)
  },

  clearFavorites: () => {
    set({ favorites: [], isLoading: false })
  }
}))
