import { Xendit } from 'xendit-node'

// Initialize Xendit client
const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
})

export default xendit

// Export specific services for easier access
export const { Invoice, PaymentRequest, Customer, PaymentMethod } = xendit
