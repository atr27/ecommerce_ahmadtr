-- Clear all data from GameSphere Console Store database
-- Run this in Supabase SQL Editor or via CLI

-- First, check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Disable foreign key checks temporarily (if needed)
SET session_replication_role = replica;

-- Clear existing tables (order matters due to foreign keys)
-- Only clear tables that exist

-- Clear cart_items if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart_items') THEN
        TRUNCATE TABLE cart_items CASCADE;
        RAISE NOTICE 'cart_items table cleared';
    ELSE
        RAISE NOTICE 'cart_items table does not exist';
    END IF;
END $$;

-- Clear favorites if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'favorites') THEN
        TRUNCATE TABLE favorites CASCADE;
        RAISE NOTICE 'favorites table cleared';
    ELSE
        RAISE NOTICE 'favorites table does not exist';
    END IF;
END $$;

-- Clear products if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
        TRUNCATE TABLE products CASCADE;
        RAISE NOTICE 'products table cleared';
    ELSE
        RAISE NOTICE 'products table does not exist';
    END IF;
END $$;

-- Clear profiles if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        TRUNCATE TABLE profiles CASCADE;
        RAISE NOTICE 'profiles table cleared';
    ELSE
        RAISE NOTICE 'profiles table does not exist';
    END IF;
END $$;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Reset auto-increment sequences (only if tables exist)
DO $$
BEGIN
    -- Reset products sequence
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
        IF EXISTS (SELECT FROM information_schema.sequences WHERE sequence_name = 'products_id_seq') THEN
            ALTER SEQUENCE products_id_seq RESTART WITH 1;
            RAISE NOTICE 'products_id_seq reset';
        END IF;
    END IF;
    
    -- Reset cart_items sequence
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart_items') THEN
        IF EXISTS (SELECT FROM information_schema.sequences WHERE sequence_name = 'cart_items_id_seq') THEN
            ALTER SEQUENCE cart_items_id_seq RESTART WITH 1;
            RAISE NOTICE 'cart_items_id_seq reset';
        END IF;
    END IF;
    
    -- Reset favorites sequence
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'favorites') THEN
        IF EXISTS (SELECT FROM information_schema.sequences WHERE sequence_name = 'favorites_id_seq') THEN
            ALTER SEQUENCE favorites_id_seq RESTART WITH 1;
            RAISE NOTICE 'favorites_id_seq reset';
        END IF;
    END IF;
END $$;

-- Verify tables are empty (only check existing tables)
DO $$
DECLARE
    result_text TEXT := '';
    row_count INTEGER;
BEGIN
    RAISE NOTICE 'Final table statistics:';
    
    -- Check products
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
        SELECT COUNT(*) INTO row_count FROM products;
        RAISE NOTICE 'products: % rows', row_count;
    END IF;
    
    -- Check cart_items
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart_items') THEN
        SELECT COUNT(*) INTO row_count FROM cart_items;
        RAISE NOTICE 'cart_items: % rows', row_count;
    END IF;
    
    -- Check favorites
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'favorites') THEN
        SELECT COUNT(*) INTO row_count FROM favorites;
        RAISE NOTICE 'favorites: % rows', row_count;
    END IF;
    
    -- Check profiles
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        SELECT COUNT(*) INTO row_count FROM profiles;
        RAISE NOTICE 'profiles: % rows', row_count;
    END IF;
END $$;
