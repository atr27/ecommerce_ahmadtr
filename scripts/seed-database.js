#!/usr/bin/env node

/**
 * GameSphere Console Store - Database Seeder Script
 * 
 * This script seeds the Supabase database with console game data.
 * By default, it uses Steam API for real game data with fallback to static data.
 * 
 * Usage:
 * - node scripts/seed-database.js (uses Steam API)
 * - node scripts/seed-database.js --static (uses static data only)
 * - node scripts/seed-database.js --steam (uses Steam API only)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

// Sample products data
const sampleProducts = [
  // PS5 Games
  {
    name: 'Spider-Man 2',
    description: 'Be Greater. Together. The incredible power of the symbiote forces Peter Parker and Miles Morales into a desperate fight.',
    price: 899000,
    category: 'PS5',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
    stock: 25
  },
  {
    name: 'God of War Ragnarök',
    description: 'Embark on an epic and heartfelt journey as Kratos and Atreus struggle with holding on and letting go.',
    price: 899000,
    category: 'PS5',
    image_url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500',
    stock: 30
  },
  {
    name: 'Horizon Forbidden West',
    description: 'Join Aloy as she braves the Forbidden West - a majestic but dangerous frontier that conceals mysterious new threats.',
    price: 799000,
    category: 'PS5',
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
    stock: 20
  },
  {
    name: 'The Last of Us Part I',
    description: 'Experience the emotional storytelling and unforgettable characters in Joel and Ellie\'s critically acclaimed adventure.',
    price: 799000,
    category: 'PS5',
    image_url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500',
    stock: 15
  },
  {
    name: 'Gran Turismo 7',
    description: 'Whether you\'re a competitive racer, collector, tuner, livery designer or photographer – find your line.',
    price: 699000,
    category: 'PS5',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    stock: 35
  },

  // Xbox Games
  {
    name: 'Halo Infinite',
    description: 'When all hope is lost and humanity\'s fate hangs in the balance, Master Chief is ready to confront the most ruthless foe he\'s ever faced.',
    price: 699000,
    category: 'Xbox',
    image_url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500',
    stock: 40
  },
  {
    name: 'Forza Horizon 5',
    description: 'Your greatest Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico.',
    price: 699000,
    category: 'Xbox',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    stock: 32
  },
  {
    name: 'Gears 5',
    description: 'From one of gaming\'s most acclaimed sagas, Gears is bigger than ever, with five thrilling modes and the deepest campaign yet.',
    price: 599000,
    category: 'Xbox',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500',
    stock: 25
  },
  {
    name: 'Microsoft Flight Simulator',
    description: 'Take to the skies and experience the joy of flight in the next generation of Microsoft Flight Simulator.',
    price: 799000,
    category: 'Xbox',
    image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500',
    stock: 20
  },
  {
    name: 'Starfield',
    description: 'In this next generation role-playing game set amongst the stars, create any character you want and explore with unparalleled freedom.',
    price: 899000,
    category: 'Xbox',
    image_url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500',
    stock: 35
  },

  // Nintendo Games
  {
    name: 'The Legend of Zelda: Tears of the Kingdom',
    description: 'An epic adventure across the land and skies of Hyrule awaits in this sequel to Breath of the Wild.',
    price: 899000,
    category: 'Nintendo',
    image_url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500',
    stock: 50
  },
  {
    name: 'Super Mario Odyssey',
    description: 'Join Mario on a massive, globe-trotting 3D adventure and use his incredible new abilities to collect Moons.',
    price: 699000,
    category: 'Nintendo',
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
    stock: 45
  },
  {
    name: 'Mario Kart 8 Deluxe',
    description: 'Hit the road with the definitive version of Mario Kart 8 and play anytime, anywhere!',
    price: 699000,
    category: 'Nintendo',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    stock: 60
  },
  {
    name: 'Super Smash Bros. Ultimate',
    description: 'The biggest crossover in gaming history! Fighters from across the Nintendo universe come together.',
    price: 699000,
    category: 'Nintendo',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500',
    stock: 40
  },
  {
    name: 'Animal Crossing: New Horizons',
    description: 'Escape to a deserted island and create your own paradise as you explore, create, and customize.',
    price: 699000,
    category: 'Nintendo',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
    stock: 35
  },

  // PC Games
  {
    name: 'Cyberpunk 2077',
    description: 'An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.',
    price: 699000,
    category: 'PC',
    image_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500',
    stock: 25
  },
  {
    name: 'Elden Ring',
    description: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
    price: 699000,
    category: 'PC',
    image_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500',
    stock: 18
  },
  {
    name: 'Red Dead Redemption 2',
    description: 'Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is an epic tale of honor and loyalty.',
    price: 599000,
    category: 'PC',
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
    stock: 15
  },
  {
    name: 'The Witcher 3: Wild Hunt',
    description: 'You are Geralt of Rivia, mercenary monster slayer. At your disposal is every tool of the trade.',
    price: 299000,
    category: 'PC',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
    stock: 30
  },
  {
    name: 'Baldur\'s Gate 3',
    description: 'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival.',
    price: 799000,
    category: 'PC',
    image_url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500',
    stock: 22
  },
  {
    name: 'Counter-Strike 2',
    description: 'For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players worldwide.',
    price: 0,
    category: 'PC',
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
    stock: 999
  },
  {
    name: 'Minecraft',
    description: 'Explore randomly generated worlds and build amazing things from the simplest of homes to the grandest of castles.',
    price: 399000,
    category: 'PC',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
    stock: 100
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log('⚠️  Products already exist in database');
      console.log('Do you want to clear existing data and reseed? (This will delete all products, cart items, favorites, and orders)');
      
      // For now, we'll skip if data exists. You can modify this behavior as needed.
      console.log('Skipping seeding. To force reseed, manually clear the products table first.');
      return;
    }

    // Insert products in batches
    console.log('📦 Inserting products...');
    const batchSize = 10;
    let insertedCount = 0;

    for (let i = 0; i < sampleProducts.length; i += batchSize) {
      const batch = sampleProducts.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('products')
        .insert(batch)
        .select();

      if (error) {
        throw error;
      }

      insertedCount += data.length;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${data.length} products`);
    }

    console.log(`\n🎉 Database seeding completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   • Total products inserted: ${insertedCount}`);
    
    // Get category breakdown
    const { data: categoryStats } = await supabase
      .from('products')
      .select('category')
      .then(({ data }) => {
        const stats = data.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});
        return { data: stats };
      });

    if (categoryStats) {
      console.log(`   • Products by category:`);
      Object.entries(categoryStats).forEach(([category, count]) => {
        console.log(`     - ${category}: ${count} games`);
      });
    }

    console.log(`\n🚀 Your GameSphere Console Store is ready to go!`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Import Steam seeder
const { seedDatabaseWithSteam, fetchGamesFromSteam } = require('./steam-seeder');

// Parse command line arguments
const args = process.argv.slice(2);
const useStaticOnly = args.includes('--static');
const useSteamOnly = args.includes('--steam');
const useSteamDefault = !useStaticOnly && !useSteamOnly;

/**
 * Main seeding function with Steam API integration
 */
async function seedDatabaseWithOptions() {
  try {
    if (useSteamOnly || useSteamDefault) {
      console.log('🎮 Using Steam API for game data...');
      try {
        await seedDatabaseWithSteam();
        return;
      } catch (error) {
        if (useSteamOnly) {
          console.error('❌ Steam API seeding failed:', error.message);
          process.exit(1);
        }
        console.log('⚠️  Steam API failed, falling back to static data...');
      }
    }
    
    if (useStaticOnly || useSteamDefault) {
      console.log('📦 Using static game data...');
      await seedDatabase();
    }
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabaseWithOptions();
}

module.exports = { seedDatabase, sampleProducts };
