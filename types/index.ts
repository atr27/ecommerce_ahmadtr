export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'PS5' | 'Xbox' | 'Nintendo' | 'PC'
  image_url: string
  stock: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
}

export interface CartStore {
  items: CartItem[]
  isLoading: boolean
  addItem: (productId: string, quantity?: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  clearCartState: () => void
  fetchCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
}
