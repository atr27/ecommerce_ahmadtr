# Database Management Guide

This guide covers how to manage your Supabase database data, including clearing/dropping data from tables.

## 🗑️ Clearing Database Data

### Method 1: Using NPM Scripts (Recommended)

```bash
# Clear all data from all tables
npm run db:clear

# Clear specific table (interactive)
npm run db:clear-table products --confirm
npm run db:clear-table cart_items --confirm
npm run db:clear-table favorites --confirm
```

### Method 2: Using Node.js Scripts

```bash
# Clear all tables (with confirmation prompt)
node scripts/clear-database.js

# Clear all tables (skip confirmation)
node scripts/clear-database.js --confirm

# Clear specific table
node scripts/clear-database.js products --confirm
node scripts/clear-database.js cart_items --confirm
```

### Method 3: Using SQL Commands

Copy and paste this SQL in your Supabase Dashboard → SQL Editor:

```sql
-- Clear all data (preserves table structure)
TRUNCATE TABLE cart_items CASCADE;
TRUNCATE TABLE favorites CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- Reset auto-increment sequences
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE cart_items_id_seq RESTART WITH 1;
ALTER SEQUENCE favorites_id_seq RESTART WITH 1;
```

### Method 4: Using Supabase Dashboard

1. Go to **Supabase Dashboard**
2. Navigate to **Table Editor**
3. For each table:
   - Click table name
   - Click **Settings** (gear icon)
   - Click **Delete all rows**
   - Confirm deletion

## 🔄 Database Reset Options

### Complete Database Reset
```bash
# Reset entire database (drops and recreates all tables)
npm run db:reset

# This will:
# - Drop all tables
# - Run all migrations from scratch
# - Restore original schema
```

### Soft Reset (Clear Data Only)
```bash
# Clear data but keep table structure
npm run db:clear
```

## 📊 Database Status and Verification

### Check Database Status
```bash
# Check Supabase connection and status
npm run db:status

# Check table row counts
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTables() {
  const tables = ['products', 'cart_items', 'favorites', 'profiles'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    console.log(\`\${table}: \${data?.length || 0} rows\`);
  }
}
checkTables();
"
```

## 🛡️ Safety Measures

### Before Clearing Data

1. **Backup Important Data**
   ```bash
   # Export data before clearing
   node -e "
   const { createClient } = require('@supabase/supabase-js');
   require('dotenv').config();
   const fs = require('fs');
   const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
   
   async function backup() {
     const { data } = await supabase.from('products').select('*');
     fs.writeFileSync('backup-products.json', JSON.stringify(data, null, 2));
     console.log('Backup saved to backup-products.json');
   }
   backup();
   "
   ```

2. **Confirm Environment**
   - Make sure you're working with the correct database
   - Double-check your `.env.local` file
   - Verify Supabase project URL

### Recovery Options

If you accidentally clear data:

1. **From Backup**
   ```bash
   # Restore from backup file
   node -e "
   const { createClient } = require('@supabase/supabase-js');
   require('dotenv').config();
   const fs = require('fs');
   const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
   
   async function restore() {
     const data = JSON.parse(fs.readFileSync('backup-products.json'));
     const { error } = await supabase.from('products').insert(data);
     console.log(error ? 'Restore failed' : 'Restore successful');
   }
   restore();
   "
   ```

2. **Re-seed Database**
   ```bash
   # Re-populate with fresh data
   npm run seed:steam
   # or
   npm run seed
   ```

## 🎯 Specific Use Cases

### Clear Products Only
```bash
node scripts/clear-database.js products --confirm
```

### Clear User Data Only
```bash
node scripts/clear-database.js cart_items --confirm
node scripts/clear-database.js favorites --confirm
node scripts/clear-database.js profiles --confirm
```

### Prepare for New Seeding
```bash
# Clear products and re-seed
npm run db:clear
npm run seed:steam
```

### Development Reset
```bash
# Complete reset for development
npm run db:reset
npm run db:migrate
npm run seed:steam
```

## 🔍 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```
   ❌ Error: insufficient_privilege
   ```
   - Check your `SUPABASE_SERVICE_ROLE_KEY`
   - Ensure you're using the service role key, not anon key

2. **Foreign Key Constraints**
   ```
   ❌ Error: violates foreign key constraint
   ```
   - Clear tables in correct order (cart_items → favorites → products → profiles)
   - Use `CASCADE` option in SQL

3. **Connection Failed**
   ```
   ❌ Supabase connection failed
   ```
   - Verify `NEXT_PUBLIC_SUPABASE_URL`
   - Check internet connection
   - Confirm Supabase project is active

### Debug Mode

Enable debug logging:
```bash
DEBUG=true node scripts/clear-database.js --confirm
```

## 📋 Quick Reference

| Command | Description |
|---------|-------------|
| `npm run db:clear` | Clear all data from all tables |
| `npm run db:reset` | Reset entire database schema |
| `npm run db:status` | Check database status |
| `npm run seed:steam` | Re-populate with Steam data |
| `npm run seed` | Re-populate with default data |

## ⚠️ Important Notes

1. **Data Loss Warning**: Clearing data is irreversible without backups
2. **User Data**: Be careful with `profiles` table (contains user accounts)
3. **Production**: Never run clear commands on production database
4. **Testing**: Always test on development database first
5. **Backups**: Create backups before major operations

## 🔗 Related Commands

After clearing data, you might want to:
```bash
# Re-seed with Steam data
npm run seed:steam

# Start development server
npm run dev

# Check migration status
npm run db:status
```
