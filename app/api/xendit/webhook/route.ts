import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-callback-token')
    
    // Verify webhook signature
    if (signature !== process.env.XENDIT_WEBHOOK_TOKEN) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)
    console.log('Xendit webhook received:', event.event_type)
    console.log('Full webhook payload:', JSON.stringify(event, null, 2))

    const supabase = createSupabaseServerClient()

    // Handle different event types
    switch (event.event_type) {
      case 'invoice.paid':
        await handleInvoicePaid(event, supabase)
        break
      case 'invoice.expired':
        await handleInvoiceExpired(event, supabase)
        break
      case 'invoice.failed':
        await handleInvoiceFailed(event, supabase)
        break
      default:
        console.log('Unhandled event type:', event.event_type)
        console.log('Available event properties:', Object.keys(event))
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Xendit webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleInvoicePaid(event: any, supabase: any) {
  const invoiceId = event.data.id
  
  // Find the order by payment token (invoice ID)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_token', invoiceId)
    .single()

  if (orderError || !order) {
    console.error('Order not found for invoice:', invoiceId)
    return
  }

  // Update order status to paid
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      payment_status: 'completed',
      updated_at: new Date().toISOString()
    })
    .eq('id', order.id)

  if (updateError) {
    console.error('Failed to update order status:', updateError)
    return
  }

  // Clear user's cart after successful payment
  const { error: cartError } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', order.user_id)

  if (cartError) {
    console.error('Failed to clear cart:', cartError)
  }

  console.log(`Order ${order.id} marked as paid`)
}

async function handleInvoiceExpired(event: any, supabase: any) {
  const invoiceId = event.data.id
  
  // Find the order by payment token (invoice ID)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_token', invoiceId)
    .single()

  if (orderError || !order) {
    console.error('Order not found for invoice:', invoiceId)
    return
  }

  // Update order status to expired
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'expired',
      payment_status: 'failed',
      updated_at: new Date().toISOString()
    })
    .eq('id', order.id)

  if (updateError) {
    console.error('Failed to update order status:', updateError)
    return
  }

  console.log(`Order ${order.id} marked as expired`)
}

async function handleInvoiceFailed(event: any, supabase: any) {
  const invoiceId = event.data.id
  
  // Find the order by payment token (invoice ID)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_token', invoiceId)
    .single()

  if (orderError || !order) {
    console.error('Order not found for invoice:', invoiceId)
    return
  }

  // Update order status to failed
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'failed',
      payment_status: 'failed',
      updated_at: new Date().toISOString()
    })
    .eq('id', order.id)

  if (updateError) {
    console.error('Failed to update order status:', updateError)
    return
  }

  console.log(`Order ${order.id} marked as failed`)
}
