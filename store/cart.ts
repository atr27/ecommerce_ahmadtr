import { create } from 'zustand'
import { CartItem, CartStore } from '@/types/index'
import { createSupabaseClient } from '@/lib/supabase'

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,

  addItem: async (productId: string, quantity = 1) => {
    set({ isLoading: true })
    const supabase = createSupabaseClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
        
        if (error) throw error
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          })
        
        if (error) throw error
      }

      await get().fetchCart()
    } catch (error) {
      console.error('Error adding item to cart:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  removeItem: async (itemId: string) => {
    set({ isLoading: true })
    const supabase = createSupabaseClient()
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
      
      if (error) throw error
      await get().fetchCart()
    } catch (error) {
      console.error('Error removing item from cart:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeItem(itemId)
      return
    }

    set({ isLoading: true })
    const supabase = createSupabaseClient()
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
      
      if (error) throw error
      await get().fetchCart()
    } catch (error) {
      console.error('Error updating cart item quantity:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  clearCart: async () => {
    set({ isLoading: true })
    const supabase = createSupabaseClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // If no user, just clear the UI state
        set({ items: [], isLoading: false })
        return
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
      
      if (error) throw error
      set({ items: [] })
    } catch (error) {
      console.error('Error clearing cart:', error)
      // Always clear UI state even if database operation fails
      set({ items: [] })
    } finally {
      set({ isLoading: false })
    }
  },

  // Clear cart state immediately (for logout scenarios)
  clearCartState: () => {
    set({ items: [], isLoading: false })
  },

  fetchCart: async () => {
    set({ isLoading: true })
    const supabase = createSupabaseClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ items: [] })
        return
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)
      
      if (error) throw error
      set({ items: data || [] })
    } catch (error) {
      console.error('Error fetching cart:', error)
      set({ items: [] })
    } finally {
      set({ isLoading: false })
    }
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity
    }, 0)
  }
}))
