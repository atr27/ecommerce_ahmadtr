const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// PlayStation Store API configuration
const PS_STORE_BASE_URL = 'https://store.playstation.com/store/api/chihiro/00_09_000/container/ch/de/999/STORE-MSF75508-FULLGAMES';

// Helper function to convert CHF to IDR (approximate rate: 1 CHF = 17,000 IDR)
function convertChfToIdr(chfPrice) {
  const exchangeRate = 17000;
  return Math.round(chfPrice * exchangeRate);
}

// Helper function to extract price from display_price string
function extractPrice(displayPrice) {
  if (!displayPrice) return 0;
  const match = displayPrice.match(/CHF\s*([\d,]+\.?\d*)/);
  if (match) {
    return parseFloat(match[1].replace(',', ''));
  }
  return 0;
}

// Helper function to determine platform based on playable_platform
function determinePlatform(playablePlatforms) {
  if (!playablePlatforms || playablePlatforms.length === 0) return 'PlayStation';
  
  const platforms = playablePlatforms.join(', ').toLowerCase();
  
  if (platforms.includes('ps5')) return 'PS5';
  if (platforms.includes('ps4')) return 'PS4';
  if (platforms.includes('ps3')) return 'PS3';
  if (platforms.includes('ps vita') || platforms.includes('vita')) return 'PS Vita';
  if (platforms.includes('psp')) return 'PSP';
  
  return 'PlayStation';
}

// Helper function to get the best image URL
function getBestImageUrl(images) {
  if (!images || images.length === 0) return null;
  
  // Prefer type 1 (main image), then type 2, then any available
  const mainImage = images.find(img => img.type === 1);
  if (mainImage) return mainImage.url;
  
  const secondaryImage = images.find(img => img.type === 2);
  if (secondaryImage) return secondaryImage.url;
  
  return images[0]?.url || null;
}

// Helper function to clean and format game name
function cleanGameName(name) {
  if (!name) return 'Unknown Game';
  
  // Remove trademark symbols and clean up
  return name
    .replace(/™/g, '')
    .replace(/®/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper function to generate description based on game data
function generateDescription(game) {
  const platform = determinePlatform(game.playable_platform);
  const contentType = game.game_contentType || 'Game';
  const provider = game.provider_name || 'PlayStation';
  
  return `${contentType} for ${platform} by ${provider}. Experience this exciting PlayStation exclusive title with stunning graphics and immersive gameplay.`;
}

// Fetch games from PlayStation Store API
async function fetchPlayStationGames(size = 50, start = 0) {
  try {
    const url = `${PS_STORE_BASE_URL}?size=${size}&start=${start}&sort=release_date`;
    console.log(`Fetching PlayStation games from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`PlayStation Store API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.links || !Array.isArray(data.links)) {
      console.log('No games found in API response');
      return [];
    }
    
    console.log(`Found ${data.links.length} games from PlayStation Store`);
    return data.links;
    
  } catch (error) {
    console.error('Error fetching PlayStation games:', error.message);
    return [];
  }
}

// Transform PlayStation game data to our database format
function transformGameData(game) {
  // Extract platform from playable_platforms for category mapping
  // Database only supports: 'PS5', 'Xbox', 'Nintendo', 'PC'
  let category = 'PS5'; // Default to PS5 for PlayStation games
  if (game.playable_platform && Array.isArray(game.playable_platform)) {
    const platforms = game.playable_platform.map(p => p.replace(/™/g, '').trim());
    if (platforms.includes('PS5') || platforms.includes('PS4')) {
      category = 'PS5'; // Map both PS5 and PS4 to PS5 category
    } else {
      category = 'PS5'; // Map older PlayStation consoles to PS5 category as well
    }
  }

  // Convert price from CHF to IDR (approximate rate: 1 CHF = 17,000 IDR)
  const priceInIDR = game.default_sku && game.default_sku.price 
    ? Math.round(parseFloat(game.default_sku.price) * 17000)
    : Math.floor(Math.random() * 500000) + 100000;

  // Get the best image (prefer type 1)
  let imageUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500';
  if (game.images && Array.isArray(game.images)) {
    const preferredImage = game.images.find(img => img.type === 1) || game.images[0];
    if (preferredImage && preferredImage.url) {
      imageUrl = preferredImage.url;
    }
  }

  // Clean name (remove trademark symbols)
  const cleanName = game.name ? game.name.replace(/[™®©]/g, '').trim() : 'Unknown Game';

  // Generate description with platform and publisher info
  const platformInfo = game.playable_platform ? game.playable_platform.join(', ') : 'PlayStation';
  const description = `Experience ${cleanName} on ${platformInfo}. ${game.provider_name ? `Published by ${game.provider_name}.` : ''} ${game.release_date ? `Released on ${game.release_date}.` : ''} Original PlayStation Store game with authentic pricing and artwork.`;

  // Return only the columns that exist in the database schema
  return {
    name: cleanName,
    description: description,
    price: priceInIDR,
    category: category, // Use existing enum values: PS5, Xbox, Nintendo, PC
    image_url: imageUrl,
    stock: Math.floor(Math.random() * 51) + 10 // 10-60
  };
}

// Insert games into database
async function insertGames(games) {
  if (games.length === 0) {
    console.log('No games to insert');
    return { success: 0, errors: 0 };
  }
  
  console.log(`Inserting ${games.length} games into database...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  // Insert games in batches of 10
  const batchSize = 10;
  for (let i = 0; i < games.length; i += batchSize) {
    const batch = games.slice(i, i + batchSize);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(batch)
        .select('id, name');
      
      if (error) {
        console.error(`Batch ${Math.floor(i/batchSize) + 1} error:`, error.message);
        errorCount += batch.length;
      } else {
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: Inserted ${data.length} games`);
        successCount += data.length;
      }
      
      // Small delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Batch ${Math.floor(i/batchSize) + 1} exception:`, error.message);
      errorCount += batch.length;
    }
  }
  
  return { success: successCount, errors: errorCount };
}

// Main seeding function
async function seedPlayStationGames() {
  console.log('🎮 Starting PlayStation Store seeder...\n');
  
  try {
    // Check Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (testError) {
      throw new Error(`Supabase connection failed: ${testError.message}`);
    }
    
    console.log('✅ Supabase connection successful');
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const sizeArg = args.find(arg => arg.startsWith('--size='));
    const startArg = args.find(arg => arg.startsWith('--start='));
    const noClearArg = args.includes('--no-clear');
    
    const size = sizeArg ? parseInt(sizeArg.split('=')[1]) : 50;
    const start = startArg ? parseInt(startArg.split('=')[1]) : 0;
    
    console.log(`📊 Fetching ${size} games starting from position ${start}`);
    
    // Optionally clear existing PlayStation games
    if (!noClearArg) {
      console.log('🗑️  Clearing existing PlayStation games...');
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('category', 'PlayStation');
      
      if (deleteError) {
        console.warn('Warning: Could not clear existing PlayStation games:', deleteError.message);
      } else {
        console.log('✅ Existing PlayStation games cleared');
      }
    }
    
    // Fetch games from PlayStation Store
    const rawGames = await fetchPlayStationGames(size, start);
    
    if (rawGames.length === 0) {
      console.log('❌ No games fetched from PlayStation Store');
      return;
    }
    
    // Transform games data
    console.log('🔄 Transforming game data...');
    const transformedGames = rawGames
      .filter(game => game.name && game.name.trim()) // Filter out games without names
      .map(transformGameData);
    
    console.log(`✅ Transformed ${transformedGames.length} games`);
    
    // Insert games into database
    const result = await insertGames(transformedGames);
    
    // Summary
    console.log('\n📊 SEEDING SUMMARY:');
    console.log(`✅ Successfully inserted: ${result.success} games`);
    console.log(`❌ Errors: ${result.errors} games`);
    console.log(`📱 Platform: PlayStation Store`);
    console.log(`🎯 Category: PlayStation`);
    
    if (result.success > 0) {
      console.log('\n🎉 PlayStation games successfully added to your GameSphere database!');
      console.log('💡 Tip: Run with --size=100 to fetch more games, or --start=50 to fetch different games');
    }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Handle command line execution
if (require.main === module) {
  seedPlayStationGames();
}

module.exports = { seedPlayStationGames };
