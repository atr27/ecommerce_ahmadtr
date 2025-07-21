const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAndMigrate() {
  console.log('🔄 Checking payment_status column...')
  
  try {
    // Test if payment_status column exists by trying to select it
    const { data, error } = await supabase
      .from('orders')
      .select('payment_status')
      .limit(1)
    
    if (error) {
      if (error.message.includes('payment_status')) {
        console.log('❌ payment_status column does not exist')
        console.log('📋 Please run this SQL in Supabase Dashboard:')
        console.log('')
        console.log('-- Copy and paste this into Supabase Dashboard > SQL Editor:')
        console.log('')
        console.log('DO $$ BEGIN')
        console.log('    CREATE TYPE payment_status AS ENUM (\'pending\', \'processing\', \'completed\', \'failed\', \'cancelled\', \'refunded\');')
        console.log('EXCEPTION')
        console.log('    WHEN duplicate_object THEN null;')
        console.log('END $$;')
        console.log('')
        console.log('ALTER TABLE orders ADD COLUMN payment_status payment_status NOT NULL DEFAULT \'pending\';')
        console.log('')
        console.log('CREATE INDEX idx_orders_payment_status ON orders(payment_status);')
        console.log('')
        console.log('UPDATE orders SET payment_status = CASE')
        console.log('    WHEN status = \'paid\' THEN \'completed\'::payment_status')
        console.log('    WHEN status = \'cancelled\' THEN \'cancelled\'::payment_status')
        console.log('    ELSE \'pending\'::payment_status')
        console.log('END;')
        console.log('')
        console.log('🔗 Go to: https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0] + '/sql')
        return
      } else {
        console.error('❌ Unexpected error:', error.message)
        return
      }
    }
    
    console.log('✅ payment_status column exists!')
    
    // Check current status distribution
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('status, payment_status')
    
    if (fetchError) {
      console.error('❌ Error fetching orders:', fetchError.message)
      return
    }
    
    const stats = {
      total: orders.length,
      completed: orders.filter(o => o.payment_status === 'completed').length,
      pending: orders.filter(o => o.payment_status === 'pending').length,
      cancelled: orders.filter(o => o.payment_status === 'cancelled').length,
      failed: orders.filter(o => o.payment_status === 'failed').length
    }
    
    console.log('📊 Current Payment Status Distribution:')
    console.log(`   Total orders: ${stats.total}`)
    console.log(`   Completed: ${stats.completed}`)
    console.log(`   Pending: ${stats.pending}`)
    console.log(`   Cancelled: ${stats.cancelled}`)
    console.log(`   Failed: ${stats.failed}`)
    
    // Update any orders that might need status sync
    const needsUpdate = orders.filter(o => 
      (o.status === 'paid' && o.payment_status !== 'completed') ||
      (o.status === 'cancelled' && o.payment_status !== 'cancelled')
    )
    
    if (needsUpdate.length > 0) {
      console.log(`🔄 Found ${needsUpdate.length} orders that need payment status updates`)
      
      for (const order of needsUpdate) {
        const newPaymentStatus = order.status === 'paid' ? 'completed' : 'cancelled'
        const { error: updateError } = await supabase
          .from('orders')
          .update({ payment_status: newPaymentStatus })
          .eq('id', order.id)
        
        if (updateError) {
          console.error(`❌ Failed to update order ${order.id}:`, updateError.message)
        } else {
          console.log(`✅ Updated order ${order.id}: ${order.payment_status} → ${newPaymentStatus}`)
        }
      }
    }
    
    console.log('🎉 Migration check completed!')
    
  } catch (error) {
    console.error('❌ Migration check failed:', error.message)
  }
}

checkAndMigrate()
