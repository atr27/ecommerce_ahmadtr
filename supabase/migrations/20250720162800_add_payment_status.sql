-- Add payment_status column to orders table
-- This column tracks the payment processing status separately from order fulfillment status

-- Create payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');

-- Add payment_status column to orders table
ALTER TABLE orders 
ADD COLUMN payment_status payment_status NOT NULL DEFAULT 'pending';

-- Add index for better query performance
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Update existing orders to have appropriate payment status based on order status
UPDATE orders 
SET payment_status = CASE 
    WHEN status = 'paid' THEN 'completed'::payment_status
    WHEN status = 'cancelled' THEN 'cancelled'::payment_status
    ELSE 'pending'::payment_status
END;

-- Add comment for documentation
COMMENT ON COLUMN orders.payment_status IS 'Payment processing status - tracks payment gateway status separately from order fulfillment';
