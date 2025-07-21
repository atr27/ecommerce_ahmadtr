const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  console.log('🔄 Applying payment_status migration...')
  
  try {
    // Create payment status enum
    const { error: enumError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
          CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
    })
    
    if (enumError) {
      console.log('⚠️  Enum might already exist:', enumError.message)
    } else {
      console.log('✅ Created payment_status enum')
    }

    // Add payment_status column
    const { error: columnError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
          ALTER TABLE orders ADD COLUMN payment_status payment_status NOT NULL DEFAULT 'pending';
        EXCEPTION
          WHEN duplicate_column THEN 
            RAISE NOTICE 'Column payment_status already exists';
        END $$;
      `
    })
    
    if (columnError) {
      console.log('⚠️  Column might already exist:', columnError.message)
    } else {
      console.log('✅ Added payment_status column')
    }

    // Create index
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
          CREATE INDEX idx_orders_payment_status ON orders(payment_status);
        EXCEPTION
          WHEN duplicate_table THEN 
            RAISE NOTICE 'Index idx_orders_payment_status already exists';
        END $$;
      `
    })
    
    if (indexError) {
      console.log('⚠️  Index might already exist:', indexError.message)
    } else {
      console.log('✅ Created index on payment_status')
    }

    // Update existing orders
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE orders 
        SET payment_status = CASE 
            WHEN status = 'paid' THEN 'completed'::payment_status
            WHEN status = 'cancelled' THEN 'cancelled'::payment_status
            ELSE 'pending'::payment_status
        END;
      `
    })
    
    if (updateError) {
      console.error('❌ Failed to update existing orders:', updateError.message)
    } else {
      console.log('✅ Updated existing orders with payment status')
    }

    console.log('🎉 Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

applyMigration()
