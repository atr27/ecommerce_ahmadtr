#!/usr/bin/env node

/**
 * GameSphere Console Store - FreeToGame API Seeder Script (Fixed Version)
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Platform mapping
const PLATFORM_MAPPING = {
  'PC (Windows)': 'PC',
  'Web Browser': 'PC',
  'PC': 'PC',
  'PlayStation 4': 'PS5',
  'PlayStation 5': 'PS5',
  'Xbox One': 'Xbox',
  'Xbox Series X|S': 'Xbox'
};

function makeApiRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: {
        'User-Agent': 'GameSphere-Console-Store/1.0'
      }
    }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function sanitizeString(str) {
  if (!str) return '';
  return str.replace(/[\x00-\x1F\x7F]/g, '').trim().substring(0, 500);
}

async function clearDatabase() {
  try {
    console.log('🗑️  Clearing existing products...');
    const { error } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (error) {
      console.error('❌ Error clearing database:', error.message);
      throw error;
    }
    
    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    throw error;
  }
}

async function fetchAndProcessGames(limit = 50) {
  try {
    console.log('🎮 Fetching games from FreeToGame API...');
    
    const allGames = await makeApiRequest('https://www.freetogame.com/api/games');
    
    if (!Array.isArray(allGames)) {
      throw new Error('Invalid response format from FreeToGame API');
    }
    
    console.log(`📦 Found ${allGames.length} total games`);
    
    // Filter for PC, PS5, Xbox platforms
    const targetPlatforms = ['PC (Windows)', 'Web Browser', 'PC', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series X|S'];
    
    const processedGames = allGames
      .filter(game => {
        return game.title && 
               game.short_description && 
               game.thumbnail && 
               game.platform &&
               targetPlatforms.includes(game.platform);
      })
      .slice(0, limit)
      .map(game => {
        const category = PLATFORM_MAPPING[game.platform] || 'PC';
        const basePrice = Math.floor(Math.random() * 300000) + 50000;
        
        return {
          name: sanitizeString(game.title),
          description: sanitizeString(game.short_description || `Experience ${game.title}, an exciting game.`),
          price: basePrice,
          category: category,
          image_url: sanitizeString(game.thumbnail) || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
          stock: Math.floor(Math.random() * 50) + 10
        };
      });
    
    console.log(`✅ Processed ${processedGames.length} games for PC, PS5, and Xbox platforms`);
    
    // Show category distribution
    const categoryCount = processedGames.reduce((acc, game) => {
      acc[game.category] = (acc[game.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 Category distribution:', categoryCount);
    
    return processedGames;
    
  } catch (error) {
    console.error('❌ Error fetching games:', error.message);
    throw error;
  }
}

async function insertGames(games) {
  try {
    console.log(`📝 Inserting ${games.length} games into database...`);
    
    const batchSize = 5; // Smaller batch size
    let insertedCount = 0;
    
    for (let i = 0; i < games.length; i += batchSize) {
      const batch = games.slice(i, i + batchSize);
      
      console.log(`🔍 Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(games.length/batchSize)} (${batch.length} games)...`);
      
      const { data, error } = await supabase
        .from('products')
        .insert(batch)
        .select();
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error.message);
        console.error('Error details:', error);
        continue;
      }
      
      insertedCount += batch.length;
      console.log(`✅ Successfully inserted batch ${Math.floor(i/batchSize) + 1} (${insertedCount}/${games.length} total)`);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`🎉 Successfully inserted ${insertedCount} games!`);
    return insertedCount;
    
  } catch (error) {
    console.error('❌ Error inserting games:', error.message);
    throw error;
  }
}

async function saveGamesToFile(games, filename = 'freetogame-games-backup.json') {
  try {
    const filePath = path.join(process.cwd(), filename);
    fs.writeFileSync(filePath, JSON.stringify(games, null, 2));
    console.log(`💾 Games data saved to ${filename}`);
  } catch (error) {
    console.error('❌ Error saving games to file:', error.message);
  }
}

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    let limit = 50;
    
    if (args.includes('--limit')) {
      const limitIndex = args.indexOf('--limit');
      const limitValue = parseInt(args[limitIndex + 1]);
      if (limitValue === 0) {
        limit = 500; // Max limit for unlimited
      } else if (limitValue > 0) {
        limit = limitValue;
      }
    }
    
    const noClear = args.includes('--no-clear');
    const noSave = args.includes('--no-save');
    
    console.log('🚀 Starting FreeToGame API seeding process...');
    console.log(`📊 Configuration: limit=${limit}, clearFirst=${!noClear}, saveToFile=${!noSave}`);
    
    // Clear database if requested
    if (!noClear) {
      await clearDatabase();
    }
    
    // Fetch and process games
    const games = await fetchAndProcessGames(limit);
    
    if (games.length === 0) {
      console.log('⚠️  No games fetched. Exiting...');
      return;
    }
    
    // Save to file if requested
    if (!noSave) {
      await saveGamesToFile(games);
    }
    
    // Insert games into database
    const insertedCount = await insertGames(games);
    
    console.log('\n🎉 FreeToGame API seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   • Games fetched: ${games.length}`);
    console.log(`   • Games inserted: ${insertedCount}`);
    console.log(`   • Platforms: PC, PS5, Xbox`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seeder
main();
