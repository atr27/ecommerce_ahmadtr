-- Check current orders table schema
-- Run this in Supabase Dashboard SQL Editor to see what columns exist

SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Also check if payment_status enum exists and its values
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'payment_status'
ORDER BY e.enumsortorder;
