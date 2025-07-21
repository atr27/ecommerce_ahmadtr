# Database Migration Guide for GameSphere Console Store

This guide explains how to manage database migrations for your GameSphere Console Store project using Supabase CLI.

## Prerequisites

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Migration Methods

### Method 1: Using Supabase CLI (Recommended)

#### Initial Setup
```bash
# Link to your Supabase project
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

#### Run Migrations
```bash
# Push all migrations to your database
npm run db:migrate

# Or use the full command
npx supabase db push
```

#### Check Migration Status
```bash
# Check current status
npm run db:status

# View differences between local and remote
npm run db:diff
```

#### Reset Database (Development Only)
```bash
# Reset and re-run all migrations
npm run db:reset
```

### Method 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of migration files in order:
   - `supabase/migrations/20250718040000_initial_schema.sql`
   - `supabase/migrations/20250718040001_seed_data.sql`
4. Execute each migration

### Method 3: Using Node.js Script

Run the existing seed script (includes both schema and data):
```bash
npm run seed
```

## Migration Files Structure

```
supabase/
├── config.toml                           # Supabase CLI configuration
├── migrations/
│   ├── 20250718040000_initial_schema.sql  # Database schema
│   └── 20250718040001_seed_data.sql       # Sample data
├── schema.sql                             # Legacy schema file
└── seed.sql                               # Legacy seed file
```

## Creating New Migrations

### Generate New Migration
```bash
# Create a new migration file
npx supabase migration new add_new_feature

# Edit the generated file in supabase/migrations/
# Then push to database
npm run db:migrate
```

### Manual Migration Creation
Create a new file in `supabase/migrations/` with timestamp format:
```
YYYYMMDDHHMMSS_description.sql
```

Example: `20250718120000_add_reviews_table.sql`

## Available NPM Scripts

- `npm run db:migrate` - Push migrations to database
- `npm run db:reset` - Reset database and re-run all migrations
- `npm run db:diff` - Show differences between local and remote
- `npm run db:status` - Check Supabase services status
- `npm run seed` - Run legacy seed script

## Database Schema Overview

### Tables Created
- **products** - Game products with categories, pricing, and stock
- **cart_items** - User shopping cart items
- **favorites** - User favorite products
- **orders** - Customer orders
- **order_items** - Individual items within orders

### Features Included
- **Row Level Security (RLS)** - Secure data access
- **Indexes** - Optimized query performance
- **Triggers** - Automatic timestamp updates
- **Views** - Analytics and reporting
- **Search** - Full-text search capabilities

### Sample Data
- 50+ console games across PS5, Xbox, Nintendo, and PC platforms
- Realistic pricing in Indonesian Rupiah (IDR)
- Free-to-play games and premium titles
- Proper stock levels and descriptions

## Troubleshooting

### Common Issues

1. **Migration fails with "relation already exists"**
   ```bash
   # Reset database and try again
   npm run db:reset
   ```

2. **Permission denied errors**
   - Ensure your `SUPABASE_SERVICE_ROLE_KEY` is set correctly
   - Check that RLS policies allow the operation

3. **Connection issues**
   - Verify your Supabase URL and keys
   - Check network connectivity

### Verification Queries

After migration, verify your setup:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check product count
SELECT category, COUNT(*) FROM products GROUP BY category;

-- Test RLS policies
SELECT * FROM products LIMIT 5;
```

## Best Practices

1. **Always backup** before running migrations in production
2. **Test migrations** in development environment first
3. **Use descriptive names** for migration files
4. **Keep migrations atomic** - one logical change per file
5. **Never edit existing migrations** - create new ones instead
6. **Document breaking changes** in migration comments

## Production Deployment

For production deployments:

1. **Backup your database** first
2. **Run migrations during low-traffic periods**
3. **Monitor for errors** during and after migration
4. **Have a rollback plan** ready
5. **Test thoroughly** after deployment

## Support

If you encounter issues:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review migration logs for specific errors
3. Verify environment variables and permissions
4. Test with a fresh database instance if needed
