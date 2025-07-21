import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// Get the current base URL dynamically (supports both localhost and ngrok)
export function getBaseUrl(): string {
  // Always prioritize environment variable for consistency
  const envUrl = process.env.NEXT_PUBLIC_APP_URL
  if (envUrl) {
    return envUrl
  }
  
  if (typeof window !== 'undefined') {
    // Client-side: use current origin as fallback
    return window.location.origin
  }
  
  // Server-side fallback
  return 'http://localhost:3000'
}
