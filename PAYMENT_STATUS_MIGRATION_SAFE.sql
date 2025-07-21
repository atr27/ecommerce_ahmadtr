-- Safe migration script that handles existing types and columns
-- Run this in Supabase Dashboard SQL Editor

-- Create payment status enum (only if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE 'Type payment_status already exists, skipping creation';
END $$;

-- Add payment_status column (only if it doesn't exist)
DO $$ BEGIN
    ALTER TABLE orders ADD COLUMN payment_status payment_status NOT NULL DEFAULT 'pending';
    RAISE NOTICE 'Added payment_status column to orders table';
EXCEPTION
    WHEN duplicate_column THEN 
        RAISE NOTICE 'Column payment_status already exists, skipping creation';
END $$;

-- Create index (only if it doesn't exist)
DO $$ BEGIN
    CREATE INDEX idx_orders_payment_status ON orders(payment_status);
    RAISE NOTICE 'Created index idx_orders_payment_status';
EXCEPTION
    WHEN duplicate_table THEN 
        RAISE NOTICE 'Index idx_orders_payment_status already exists, skipping creation';
END $$;

-- Update existing orders to have appropriate payment status
UPDATE orders 
SET payment_status = CASE 
    WHEN status = 'paid' THEN 'completed'::payment_status
    WHEN status = 'cancelled' THEN 'cancelled'::payment_status
    ELSE 'pending'::payment_status
END
WHERE payment_status = 'pending'; -- Only update records that haven't been set yet

-- Verify the migration
SELECT 
    'Migration completed successfully!' as message,
    COUNT(*) as total_orders,
    COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as completed_payments,
    COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_payments
FROM orders;
