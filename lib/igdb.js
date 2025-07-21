/**
 * IGDB API Integration Library
 * 
 * This library provides functions to interact with the IGDB API
 * for fetching real game data in your Next.js application.
 */

/**
 * IGDB API client configuration
 */
const IGDB_BASE_URL = 'https://api.igdb.com/v4';

/**
 * Platform mappings for IGDB platform IDs to our categories
 */
export const PLATFORM_MAPPINGS = {
  167: 'PS5',      // PlayStation 5
  169: 'Xbox',     // Xbox Series X|S
  130: 'Nintendo', // Nintendo Switch
  6: 'PC',         // PC (Windows)
  48: 'PS4',       // PlayStation 4
  49: 'Xbox',      // Xbox One
};

/**
 * Make a request to IGDB API
 */
async function makeIGDBRequest(endpoint, query) {
  const clientId = process.env.IGDB_CLIENT_ID;
  const accessToken = process.env.IGDB_ACCESS_TOKEN;

  if (!clientId || !accessToken) {
    throw new Error('IGDB API credentials not configured');
  }

  try {
    const response = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: query
    });

    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('IGDB API request failed:', error);
    throw error;
  }
}

/**
 * Search for games by name
 */
export async function searchGames(searchTerm, limit = 10) {
  const query = `
    fields name,summary,cover.url,rating,platforms,first_release_date,genres.name,screenshots.url;
    where name ~ "${searchTerm}"* & rating > 50;
    sort rating desc;
    limit ${limit};
  `;

  return await makeIGDBRequest('games', query);
}

/**
 * Get game details by ID
 */
export async function getGameById(gameId) {
  const query = `
    fields name,summary,cover.url,rating,platforms,first_release_date,genres.name,screenshots.url,videos.video_id,websites.url;
    where id = ${gameId};
  `;

  const games = await makeIGDBRequest('games', query);
  return games[0] || null;
}

/**
 * Get games by platform
 */
export async function getGamesByPlatform(platformId, limit = 20) {
  const query = `
    fields name,summary,cover.url,rating,platforms,first_release_date,genres.name;
    where platforms = (${platformId}) & rating > 60 & rating_count > 10;
    sort rating desc;
    limit ${limit};
  `;

  return await makeIGDBRequest('games', query);
}

/**
 * Get trending games
 */
export async function getTrendingGames(limit = 20) {
  const query = `
    fields name,summary,cover.url,rating,platforms,first_release_date,genres.name;
    where rating > 75 & rating_count > 50 & first_release_date > 1609459200;
    sort rating desc;
    limit ${limit};
  `;

  return await makeIGDBRequest('games', query);
}

/**
 * Get upcoming games
 */
export async function getUpcomingGames(limit = 20) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const query = `
    fields name,summary,cover.url,rating,platforms,first_release_date,genres.name;
    where first_release_date > ${currentTimestamp} & hypes > 5;
    sort first_release_date asc;
    limit ${limit};
  `;

  return await makeIGDBRequest('games', query);
}

/**
 * Transform IGDB cover URL to high resolution
 */
export function getHighResCoverUrl(coverUrl) {
  if (!coverUrl) return null;
  
  return coverUrl
    .replace('t_thumb', 't_cover_big_2x')
    .replace('//', 'https://');
}

/**
 * Transform IGDB screenshot URL to high resolution
 */
export function getHighResScreenshotUrl(screenshotUrl) {
  if (!screenshotUrl) return null;
  
  return screenshotUrl
    .replace('t_thumb', 't_screenshot_big_2x')
    .replace('//', 'https://');
}

/**
 * Format IGDB game data for our application
 */
export function formatGameData(igdbGame, category = null) {
  return {
    name: igdbGame.name,
    description: igdbGame.summary || `Experience ${igdbGame.name} - an amazing gaming experience.`,
    image_url: getHighResCoverUrl(igdbGame.cover?.url) || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
    rating: igdbGame.rating ? Math.round(igdbGame.rating) : null,
    release_date: igdbGame.first_release_date 
      ? new Date(igdbGame.first_release_date * 1000).toISOString().split('T')[0] 
      : null,
    genres: igdbGame.genres ? igdbGame.genres.map(g => g.name).join(', ') : null,
    platforms: igdbGame.platforms ? igdbGame.platforms.map(p => PLATFORM_MAPPINGS[p] || 'Unknown').join(', ') : category,
    screenshots: igdbGame.screenshots ? igdbGame.screenshots.map(s => getHighResScreenshotUrl(s.url)).filter(Boolean) : []
  };
}

/**
 * Validate IGDB API credentials
 */
export async function validateIGDBCredentials() {
  try {
    const query = 'fields name; limit 1;';
    await makeIGDBRequest('games', query);
    return true;
  } catch (error) {
    return false;
  }
}
