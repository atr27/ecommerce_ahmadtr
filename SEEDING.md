# Database Seeding Guide

This guide explains how to seed your GameSphere Console Store database with sample data.

## Overview

The seeding process will populate your Supabase database with:
- **50+ Console Games** across 4 categories (PS5, Xbox, Nintendo, PC)
- **Realistic pricing** in Indonesian Rupiah (IDR)
- **Stock quantities** for inventory management
- **High-quality placeholder images** from Unsplash
- **Database indexes** for better search performance
- **Helpful views** for analytics

## Prerequisites

Before seeding, ensure you have:

1. **Supabase Project** set up and running
2. **Environment Variables** configured in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   # Optional: For better permissions
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
3. **Database Schema** applied (run the schema.sql first if not done)

## Seeding Methods

### Method 1: Using npm script (Recommended)

```bash
npm run seed
```

This runs the JavaScript seeder which:
- ✅ Checks for existing data
- ✅ Provides detailed progress feedback
- ✅ Handles errors gracefully
- ✅ Shows category breakdown after completion

### Method 2: Direct SQL execution

If you prefer to run the SQL directly in Supabase:

1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase/seed.sql`
4. Execute the query

### Method 3: Using Supabase CLI

```bash
supabase db reset --db-url "your_database_url"
```

Then apply the seed file:
```bash
psql "your_database_url" -f supabase/seed.sql
```

## Sample Data Included

### Products by Category

| Category | Games | Price Range | Examples |
|----------|-------|-------------|----------|
| **PS5** | 10 games | 599K - 899K IDR | Spider-Man 2, God of War Ragnarök, Horizon Forbidden West |
| **Xbox** | 10 games | 499K - 899K IDR | Halo Infinite, Forza Horizon 5, Starfield |
| **Nintendo** | 10 games | 599K - 899K IDR | Zelda: Tears of the Kingdom, Mario Kart 8, Super Smash Bros |
| **PC** | 15 games | Free - 799K IDR | Cyberpunk 2077, Elden Ring, Counter-Strike 2 |

### Special Features

- **Free-to-Play Games**: Counter-Strike 2, Valorant, Fortnite, etc. (Price: 0, Stock: 999)
- **Premium Titles**: Latest AAA games with realistic pricing
- **Indie Games**: Smaller titles with appropriate pricing
- **Stock Management**: Varied stock levels for realistic inventory

## Database Views Created

The seeder also creates helpful views:

### `popular_products`
Shows products ranked by total sales (useful for homepage recommendations)

```sql
SELECT * FROM popular_products LIMIT 10;
```

### `category_stats`
Provides statistics for each game category

```sql
SELECT * FROM category_stats;
```

## Verification

After seeding, verify the data:

```sql
-- Check total products
SELECT COUNT(*) as total_products FROM products;

-- Check products by category
SELECT category, COUNT(*) as count 
FROM products 
GROUP BY category 
ORDER BY category;

-- Check price ranges
SELECT 
  category,
  MIN(price) as min_price,
  MAX(price) as max_price,
  AVG(price) as avg_price
FROM products 
GROUP BY category;
```

## Troubleshooting

### Common Issues

1. **"Missing Supabase credentials"**
   - Ensure your `.env.local` file has the correct Supabase URL and keys
   - Check that the environment variables are loaded properly

2. **"Products already exist"**
   - The seeder skips insertion if products already exist
   - To force re-seed, clear the products table first:
     ```sql
     TRUNCATE TABLE products RESTART IDENTITY CASCADE;
     ```

3. **"Permission denied"**
   - Make sure you're using the service role key for seeding
   - Check that RLS policies allow the operation

4. **"Connection timeout"**
   - Verify your Supabase project is active
   - Check your internet connection
   - Try seeding in smaller batches

### Reset Database

To completely reset and re-seed:

```sql
-- Clear all data (be careful!)
TRUNCATE TABLE order_items, orders, favorites, cart_items, products RESTART IDENTITY CASCADE;
```

Then run the seeder again.

## Next Steps

After seeding:

1. **Test the Application**: Browse products, add to cart, test search
2. **Customize Data**: Add your own games or modify existing ones
3. **Set up Analytics**: Use the created views for insights
4. **Configure Images**: Replace placeholder images with actual game covers
5. **Add More Categories**: Extend the enum if needed

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify your database schema matches the expected structure
3. Ensure all environment variables are correctly set
4. Check network connectivity to Supabase

Happy gaming! 🎮
