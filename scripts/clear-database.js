#!/usr/bin/env node

/**
 * GameSphere Console Store - Database Clear Script
 * 
 * This script clears all data from all tables in the Supabase database.
 * Use with caution - this will delete ALL data!
 * 
 * Run with: node scripts/clear-database.js
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Clear all data from database tables
 */
async function clearDatabase() {
  try {
    console.log('🗑️  Starting database cleanup...');
    console.log('⚠️  WARNING: This will delete ALL data from ALL tables!');
    
    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError.message);
      return;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Check which tables exist first
    console.log('\n🔍 Checking existing tables...');
    const { data: existingTables, error: tablesError } = await supabase
      .rpc('get_table_names');
    
    // Fallback: try to access each table to see if it exists
    const allTables = ['products', 'cart_items', 'favorites', 'profiles'];
    const existingTablesList = [];
    const beforeCounts = {};
    
    console.log('\n📊 Current table statistics:');
    
    for (const table of allTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          existingTablesList.push(table);
          beforeCounts[table] = data?.length || 0;
          console.log(`   • ${table}: ${beforeCounts[table]} rows ✅`);
        } else if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.log(`   • ${table}: Table does not exist ❌`);
        } else {
          console.log(`   • ${table}: Error checking table (${error.message})`);
        }
      } catch (err) {
        console.log(`   • ${table}: Unable to access (table may not exist)`);
      }
    }
    
    if (existingTablesList.length === 0) {
      console.log('\n⚠️  No tables found to clear!');
      return;
    }
    
    console.log(`\n📋 Found ${existingTablesList.length} tables to clear: ${existingTablesList.join(', ')}`);
    const tables = existingTablesList;
    
    // Clear tables in order (respecting foreign key constraints)
    console.log('\n🧹 Clearing tables...');
    
    // 1. Clear cart_items (references products and profiles)
    console.log('   Clearing cart_items...');
    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .neq('id', 0); // Delete all rows
    
    if (cartError) {
      console.error('❌ Error clearing cart_items:', cartError.message);
    } else {
      console.log('   ✅ cart_items cleared');
    }
    
    // 2. Clear favorites (references products and profiles)
    console.log('   Clearing favorites...');
    const { error: favError } = await supabase
      .from('favorites')
      .delete()
      .neq('id', 0); // Delete all rows
    
    if (favError) {
      console.error('❌ Error clearing favorites:', favError.message);
    } else {
      console.log('   ✅ favorites cleared');
    }
    
    // 3. Clear products
    console.log('   Clearing products...');
    const { error: prodError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Delete all rows
    
    if (prodError) {
      console.error('❌ Error clearing products:', prodError.message);
    } else {
      console.log('   ✅ products cleared');
    }
    
    // 4. Clear profiles (user profiles, be careful!)
    console.log('   Clearing profiles...');
    const { error: profError } = await supabase
      .from('profiles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
    if (profError) {
      console.error('❌ Error clearing profiles:', profError.message);
    } else {
      console.log('   ✅ profiles cleared');
    }
    
    // Verify all tables are empty
    console.log('\n📊 Final table statistics:');
    
    let totalCleared = 0;
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          const currentCount = data?.length || 0;
          const clearedCount = (beforeCounts[table] || 0) - currentCount;
          totalCleared += clearedCount;
          
          console.log(`   • ${table}: ${currentCount} rows (cleared ${clearedCount})`);
        }
      } catch (err) {
        console.log(`   • ${table}: Unable to verify`);
      }
    }
    
    console.log(`\n🎉 Database cleanup completed!`);
    console.log(`📊 Total rows cleared: ${totalCleared}`);
    console.log(`🚀 Database is now ready for fresh data`);
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error.message);
    process.exit(1);
  }
}

/**
 * Clear specific table
 */
async function clearTable(tableName) {
  try {
    console.log(`🗑️  Clearing table: ${tableName}`);
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .neq('id', 0); // Delete all rows
    
    if (error) {
      console.error(`❌ Error clearing ${tableName}:`, error.message);
      return false;
    }
    
    console.log(`✅ ${tableName} cleared successfully`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error clearing ${tableName}:`, error.message);
    return false;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const tableName = args.find(arg => !arg.startsWith('--'));
const confirmFlag = args.includes('--confirm');

// Export functions
module.exports = {
  clearDatabase,
  clearTable
};

// Run if called directly
if (require.main === module) {
  if (tableName) {
    // Clear specific table
    if (confirmFlag) {
      clearTable(tableName);
    } else {
      console.log(`⚠️  To clear table '${tableName}', run:`);
      console.log(`node scripts/clear-database.js ${tableName} --confirm`);
    }
  } else {
    // Clear all tables
    if (confirmFlag) {
      clearDatabase();
    } else {
      console.log('⚠️  This will delete ALL data from ALL tables!');
      console.log('To confirm, run:');
      console.log('node scripts/clear-database.js --confirm');
      console.log('');
      console.log('Or to clear a specific table:');
      console.log('node scripts/clear-database.js <table_name> --confirm');
    }
  }
}
