# FreeToGame API Seeding Guide

This guide explains how to use the FreeToGame API seeder to populate your GameSphere Console Store database with free-to-play games data.

## Overview

The FreeToGame API seeder (`scripts/freetogame-seeder.js`) fetches real game data from the [FreeToGame API](https://www.freetogame.com/api-doc) and populates your Supabase database with free-to-play games across multiple platforms.

### Key Features

- **No API Key Required**: FreeToGame API is completely free and doesn't require authentication
- **Real Game Data**: Fetches actual free-to-play games with descriptions, images, and metadata
- **Multi-Platform Support**: Games for PC, PlayStation, Xbox, Nintendo Switch, and Mobile
- **Smart Categorization**: Automatically maps games to appropriate console categories
- **Batch Processing**: Efficient database insertion with error handling
- **Data Backup**: Saves fetched data to JSON file for backup purposes

## Quick Start

### 1. Run the Seeder

```bash
# Using NPM script (recommended)
npm run seed:freetogame

# Or run directly
node scripts/freetogame-seeder.js
```

### 2. Command Line Options

```bash
# Limit number of games (default: 50)
npm run seed:freetogame -- --limit 30

# Don't clear existing data before seeding
npm run seed:freetogame -- --no-clear

# Don't save backup JSON file
npm run seed:freetogame -- --no-save

# Combine options
node scripts/freetogame-seeder.js --limit 100 --no-clear
```

## API Details

### FreeToGame API Endpoints

- **Base URL**: `https://www.freetogame.com/api`
- **All Games**: `/games` - Returns all free-to-play games
- **Rate Limiting**: No official rate limits, but we implement delays between batches
- **Documentation**: https://www.freetogame.com/api-doc

### Data Mapping

The seeder maps FreeToGame data to your database schema:

| FreeToGame Field | Database Field | Notes |
|------------------|----------------|-------|
| `title` | `name` | Game title |
| `short_description` | `description` | Game description |
| `thumbnail` | `image_url` | Game thumbnail image |
| `platform` | `category` | Mapped to console categories |
| `genre` | - | Used for smart categorization |
| `developer` | - | Stored in backup JSON |
| `publisher` | - | Stored in backup JSON |
| `release_date` | - | Stored in backup JSON |

### Platform Mapping

FreeToGame platforms are mapped to your store categories:

| FreeToGame Platform | Store Category |
|---------------------|----------------|
| PC (Windows) | PC |
| Web Browser | PC |
| PlayStation 4/5 | PS5 |
| Xbox One/Series X\|S | Xbox |
| Nintendo Switch | Nintendo |
| Android/iOS | Mobile |

### Genre-Based Categorization

Some genres override platform-based categorization:

| Genre | Preferred Category |
|-------|-------------------|
| MMORPG, Shooter, MOBA, Battle Royale, Strategy | PC |
| Fighting | PS5 |
| Racing, Sports | Xbox |
| Card Game | Nintendo |

## Sample Output

```
🚀 Starting FreeToGame API seeding process...
📊 Configuration: limit=50, clearFirst=true, saveToFile=true
🧹 Clearing existing products...
✅ Database cleared successfully
🎮 Fetching games from FreeToGame API...
📦 Found 537 games from FreeToGame API
✅ Processed 50 games for database seeding
📊 Category distribution: { PC: 32, PS5: 8, Xbox: 6, Nintendo: 4 }
💾 Games data saved to /path/to/scripts/freetogame-games.json
📝 Inserting 50 games into database...
✅ Inserted batch 1/5 (10/50 games)
✅ Inserted batch 2/5 (20/50 games)
✅ Inserted batch 3/5 (30/50 games)
✅ Inserted batch 4/5 (40/50 games)
✅ Inserted batch 5/5 (50/50 games)
🎉 Successfully inserted 50 games into database!

🎉 FreeToGame API seeding completed successfully!
📊 Summary:
   • Games fetched: 50
   • Games inserted: 50
   • Categories: PC, PS5, Xbox, Nintendo
```

## Integration with Main Seeder

You can integrate the FreeToGame seeder with your main seeding script by updating `scripts/seed-database.js`:

```javascript
// Import FreeToGame seeder
const { seedDatabaseWithFreeToGame } = require('./freetogame-seeder');

// Add FreeToGame option to command line arguments
const useFreeToGame = args.includes('--freetogame');

if (useFreeToGame) {
  await seedDatabaseWithFreeToGame({ limit: 50 });
}
```

Then run:
```bash
node scripts/seed-database.js --freetogame
```

## Backup and Recovery

### Backup File

The seeder automatically saves fetched data to `scripts/freetogame-games.json` for backup purposes. This file contains:

- Complete game metadata from FreeToGame API
- Processed data ready for database insertion
- Additional fields not stored in the database (developer, publisher, etc.)

### Manual Recovery

If you need to re-seed from the backup file:

```javascript
const fs = require('fs');
const games = JSON.parse(fs.readFileSync('scripts/freetogame-games.json', 'utf8'));
await insertGames(games);
```

## Troubleshooting

### Common Issues

1. **Network Timeout**
   ```
   Error: Request timeout
   ```
   - **Solution**: Check internet connection, try again later

2. **Invalid JSON Response**
   ```
   Error: Failed to parse JSON
   ```
   - **Solution**: FreeToGame API might be down, try again later

3. **Database Connection Error**
   ```
   Error: Missing Supabase credentials
   ```
   - **Solution**: Ensure `.env` file has correct Supabase credentials

4. **No Games Fetched**
   ```
   ⚠️ No games fetched from API. Exiting...
   ```
   - **Solution**: Check API availability, verify network connection

### Debug Mode

Add console logs for debugging:

```javascript
// In freetogame-seeder.js, add after API call:
console.log('Raw API response:', JSON.stringify(allGames.slice(0, 2), null, 2));
```

### API Status Check

Verify FreeToGame API is working:

```bash
curl "https://www.freetogame.com/api/games" | head -100
```

## Best Practices

1. **Start Small**: Use `--limit 10` for testing
2. **Backup First**: Always keep existing data backed up
3. **Monitor Categories**: Check category distribution in output
4. **Regular Updates**: Re-run seeder periodically for new games
5. **Combine Sources**: Use with Steam and IGDB seeders for variety

## API Limitations

- **Free Games Only**: Only includes free-to-play games
- **Limited Metadata**: Less detailed than paid APIs like Steam
- **No Pricing**: All games are free, so we generate random prices
- **Platform Coverage**: Primarily PC and console games
- **Update Frequency**: New games added periodically by FreeToGame

## Next Steps

After seeding with FreeToGame API:

1. **Verify Data**: Check your database for inserted games
2. **Test Frontend**: Browse games in your store interface
3. **Combine Sources**: Use multiple seeders for comprehensive data
4. **Customize Prices**: Adjust pricing logic if needed
5. **Add More Data**: Enhance with additional game metadata

## Support

For issues with the FreeToGame seeder:

1. Check this documentation
2. Verify environment variables
3. Test API connectivity
4. Review console output for specific errors
5. Check backup JSON file for data integrity

The FreeToGame API seeder provides an excellent way to populate your game store with real, diverse game data without requiring API keys or authentication!
