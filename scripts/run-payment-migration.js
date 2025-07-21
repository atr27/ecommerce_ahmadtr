const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('🔄 Running payment_status migration...')
  
  try {
    // Step 1: Create enum (safe)
    console.log('📝 Creating payment_status enum...')
    const { error: enumError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
            CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');
            RAISE NOTICE 'Created payment_status enum';
        EXCEPTION
            WHEN duplicate_object THEN 
                RAISE NOTICE 'Type payment_status already exists, skipping creation';
        END $$;
      `
    })
    
    if (enumError && !enumError.message.includes('already exists')) {
      console.error('❌ Error creating enum:', enumError.message)
    } else {
      console.log('✅ Payment status enum ready')
    }

    // Step 2: Add column (safe)
    console.log('📝 Adding payment_status column...')
    const { error: columnError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
            ALTER TABLE orders ADD COLUMN payment_status payment_status NOT NULL DEFAULT 'pending';
            RAISE NOTICE 'Added payment_status column to orders table';
        EXCEPTION
            WHEN duplicate_column THEN 
                RAISE NOTICE 'Column payment_status already exists, skipping creation';
        END $$;
      `
    })
    
    if (columnError && !columnError.message.includes('already exists')) {
      console.error('❌ Error adding column:', columnError.message)
    } else {
      console.log('✅ Payment status column ready')
    }

    // Step 3: Create index (safe)
    console.log('📝 Creating index...')
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
            CREATE INDEX idx_orders_payment_status ON orders(payment_status);
            RAISE NOTICE 'Created index idx_orders_payment_status';
        EXCEPTION
            WHEN duplicate_table THEN 
                RAISE NOTICE 'Index idx_orders_payment_status already exists, skipping creation';
        END $$;
      `
    })
    
    if (indexError && !indexError.message.includes('already exists')) {
      console.error('❌ Error creating index:', indexError.message)
    } else {
      console.log('✅ Index ready')
    }

    // Step 4: Update existing orders
    console.log('📝 Updating existing orders...')
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE orders 
        SET payment_status = CASE 
            WHEN status = 'paid' THEN 'completed'::payment_status
            WHEN status = 'cancelled' THEN 'cancelled'::payment_status
            ELSE 'pending'::payment_status
        END
        WHERE payment_status = 'pending';
      `
    })
    
    if (updateError) {
      console.error('❌ Error updating orders:', updateError.message)
    } else {
      console.log('✅ Updated existing orders')
    }

    // Step 5: Verify migration
    console.log('📊 Verifying migration...')
    const { data: verification, error: verifyError } = await supabase
      .from('orders')
      .select('payment_status, status')
    
    if (verifyError) {
      console.error('❌ Error verifying migration:', verifyError.message)
    } else {
      const stats = {
        total: verification.length,
        completed: verification.filter(o => o.payment_status === 'completed').length,
        pending: verification.filter(o => o.payment_status === 'pending').length,
        cancelled: verification.filter(o => o.payment_status === 'cancelled').length
      }
      
      console.log('📊 Migration Results:')
      console.log(`   Total orders: ${stats.total}`)
      console.log(`   Completed payments: ${stats.completed}`)
      console.log(`   Pending payments: ${stats.pending}`)
      console.log(`   Cancelled payments: ${stats.cancelled}`)
    }

    console.log('🎉 Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

runMigration()
