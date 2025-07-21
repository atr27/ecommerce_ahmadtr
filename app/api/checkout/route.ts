import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import xendit from '@/lib/xendit'

// Helper function to get base URL from request headers
function getBaseUrlFromRequest(request: NextRequest): string {
  const host = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  return `${protocol}://${host}`
}

export async function POST(request: NextRequest) {
  try {
    const { orderData, customerDetails, shippingAddress } = await request.json()
    
    const supabase = createSupabaseServerClient()
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: orderData.total_amount,
        shipping_address: orderData.shipping_address,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items
    const orderItems = orderData.order_items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items creation error:', itemsError)
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 })
    }

    // Create Xendit Invoice using direct API call
    const invoiceData = {
      external_id: `order-${order.id}-${Date.now()}`,
      amount: Math.round(orderData.total_amount), // Ensure integer
      description: `GameSphere Console Store - Order #${order.id}`,
      invoice_duration: 86400, // 24 hours
      currency: 'IDR',
      customer: {
        given_names: customerDetails.first_name || 'Customer',
        surname: customerDetails.last_name || '',
        email: customerDetails.email,
        mobile_number: customerDetails.phone?.replace(/[^0-9+]/g, '') || '+628123456789',
        addresses: [{
          city: shippingAddress.city || 'Jakarta',
          country: 'Indonesia',
          postal_code: shippingAddress.postal_code || '12345',
          street_line1: shippingAddress.address || 'Default Address',
        }]
      },
      customer_notification_preference: {
        invoice_created: ['email'],
        invoice_reminder: ['email'],
        invoice_paid: ['email']
      },
      success_redirect_url: `${getBaseUrlFromRequest(request)}/payment/success?order_id=${order.id}`,
      failure_redirect_url: `${getBaseUrlFromRequest(request)}/payment/failed?order_id=${order.id}`,
      items: orderData.order_items.map((item: any) => ({
        name: item.product_name || item.name || 'Game Product',
        quantity: item.quantity || 1,
        price: Math.round(item.price || 0), // Ensure integer
        category: 'Gaming'
      }))
    }

    console.log('Creating Xendit invoice with data:', JSON.stringify(invoiceData, null, 2))

    const response = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.XENDIT_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData)
    })

    const invoice = await response.json()
    
    if (!response.ok) {
      console.error('Xendit invoice creation error:', invoice)
      return NextResponse.json({ error: 'Failed to create payment invoice' }, { status: 500 })
    }

    // Update order with invoice ID
    await supabase
      .from('orders')
      .update({ 
        payment_token: invoice.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id)

    return NextResponse.json({
      success: true,
      order_id: order.id,
      invoice_id: invoice.id,
      invoice_url: invoice.invoice_url,
      payment_url: invoice.invoice_url
    })

  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

