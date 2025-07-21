const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testPaymentUpdate() {
  console.log('🔍 Testing payment status update functionality...')
  
  try {
    // First, let's check if we have any pending orders
    const { data: pendingOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, payment_status, user_id, total_amount')
      .eq('status', 'pending')
      .limit(5)
    
    if (fetchError) {
      console.error('❌ Error fetching orders:', fetchError)
      return
    }
    
    console.log(`📊 Found ${pendingOrders?.length || 0} pending orders`)
    
    if (pendingOrders && pendingOrders.length > 0) {
      console.log('📋 Pending orders:')
      pendingOrders.forEach(order => {
        console.log(`  - Order ${order.id}: status=${order.status}, payment_status=${order.payment_status}, amount=${order.total_amount}`)
      })
      
      // Test updating the first pending order
      const testOrder = pendingOrders[0]
      console.log(`\n🧪 Testing update on order ${testOrder.id}...`)
      
      const { data: updateResult, error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', testOrder.id)
        .select()
      
      if (updateError) {
        console.error('❌ Update failed:', updateError)
      } else {
        console.log('✅ Update successful:', updateResult)
        
        // Revert the change for testing purposes
        console.log('🔄 Reverting test change...')
        const { error: revertError } = await supabase
          .from('orders')
          .update({
            status: 'pending',
            payment_status: 'pending',
            updated_at: new Date().toISOString()
          })
          .eq('id', testOrder.id)
        
        if (revertError) {
          console.error('⚠️  Failed to revert test change:', revertError)
        } else {
          console.log('✅ Test change reverted successfully')
        }
      }
    } else {
      console.log('ℹ️  No pending orders found to test with')
      
      // Let's check the database schema to make sure payment_status column exists
      console.log('\n🔍 Checking database schema...')
      const { data: schemaCheck, error: schemaError } = await supabase
        .from('orders')
        .select('id, status, payment_status')
        .limit(1)
      
      if (schemaError) {
        if (schemaError.message.includes('payment_status')) {
          console.error('❌ payment_status column does not exist in database')
          console.log('💡 Please run the migration: node scripts/apply-payment-status-migration.js')
        } else {
          console.error('❌ Schema check failed:', schemaError)
        }
      } else {
        console.log('✅ Database schema looks good - payment_status column exists')
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testPaymentUpdate()
