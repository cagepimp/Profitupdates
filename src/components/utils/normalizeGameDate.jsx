/**
 * Normalize game dates from various sources (ESPN, The Odds API, etc.)
 * Handles inconsistent date field names and formats
 */

/**
 * Extract date from a game object, checking multiple possible field names
 * @param {Object} game - Game object from any source
 * @returns {Date|null} - JavaScript Date object or null if no valid date found
 */
export function extractGameDate(game) {
  if (!game) return null;
  
  // Check all possible date field names
  const dateValue = 
    game.game_date || 
    game.commence_time || 
    game.startTime || 
    game.date || 
    game.event_date ||
    game.scheduled;
  
  if (!dateValue) return null;
  
  try {
    const date = new Date(dateValue);
    // Check if date is valid
    if (isNaN(date.getTime())) return null;
    return date;
  } catch (error) {
    console.warn('Failed to parse game date:', dateValue, error);
    return null;
  }
}

/**
 * Format game date for display
 * @param {Object|string} gameOrDate - Game object or date string
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export function formatGameDate(gameOrDate, options = {}) {
  const {
    includeTime = true,
    includeWeekday = true,
    includeYear = false,
    timezone = 'America/New_York'
  } = options;
  
  let date;
  
  if (typeof gameOrDate === 'string') {
    date = new Date(gameOrDate);
  } else if (gameOrDate instanceof Date) {
    date = gameOrDate;
  } else {
    date = extractGameDate(gameOrDate);
  }
  
  if (!date) return 'TBD';
  
  const formatOptions = {
    month: 'short',
    day: 'numeric',
    timeZone: timezone
  };
  
  if (includeWeekday) {
    formatOptions.weekday = 'short';
  }
  
  if (includeYear) {
    formatOptions.year = 'numeric';
  }
  
  if (includeTime) {
    formatOptions.hour = 'numeric';
    formatOptions.minute = '2-digit';
  }
  
  try {
    return date.toLocaleString('en-US', formatOptions);
  } catch (error) {
    console.warn('Failed to format date:', date, error);
    return date.toLocaleDateString();
  }
}

/**
 * Get ISO date string (YYYY-MM-DD) from game
 * @param {Object|string} gameOrDate - Game object or date string
 * @returns {string} - ISO date string (YYYY-MM-DD)
 */
export function getISODate(gameOrDate) {
  let date;
  
  if (typeof gameOrDate === 'string') {
    date = new Date(gameOrDate);
  } else if (gameOrDate instanceof Date) {
    date = gameOrDate;
  } else {
    date = extractGameDate(gameOrDate);
  }
  
  if (!date) return null;
  
  try {
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.warn('Failed to get ISO date:', date, error);
    return null;
  }
}

/**
 * Get full ISO timestamp from game
 * @param {Object|string} gameOrDate - Game object or date string
 * @returns {string} - Full ISO timestamp
 */
export function getISOTimestamp(gameOrDate) {
  let date;
  
  if (typeof gameOrDate === 'string') {
    date = new Date(gameOrDate);
  } else if (gameOrDate instanceof Date) {
    date = gameOrDate;
  } else {
    date = extractGameDate(gameOrDate);
  }
  
  if (!date) return null;
  
  try {
    return date.toISOString();
  } catch (error) {
    console.warn('Failed to get ISO timestamp:', date, error);
    return null;
  }
}

/**
 * Check if game is today
 * @param {Object|string} gameOrDate - Game object or date string
 * @returns {boolean}
 */
export function isToday(gameOrDate) {
  const gameDate = extractGameDate(gameOrDate);
  if (!gameDate) return false;
  
  const today = new Date();
  return (
    gameDate.getDate() === today.getDate() &&
    gameDate.getMonth() === today.getMonth() &&
    gameDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if game is in the past
 * @param {Object|string} gameOrDate - Game object or date string
 * @returns {boolean}
 */
export function isPast(gameOrDate) {
  const gameDate = extractGameDate(gameOrDate);
  if (!gameDate) return false;
  
  return gameDate < new Date();
}

/**
 * Check if game is within date range
 * @param {Object|string} gameOrDate - Game object or date string
 * @param {string|Date} startDate - Start of range
 * @param {string|Date} endDate - End of range
 * @returns {boolean}
 */
export function isInDateRange(gameOrDate, startDate, endDate) {
  const gameDate = extractGameDate(gameOrDate);
  if (!gameDate) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return gameDate >= start && gameDate <= end;
}

/**
 * Sort games by date (ascending)
 * @param {Array} games - Array of game objects
 * @returns {Array} - Sorted array
 */
export function sortGamesByDate(games) {
  return [...games].sort((a, b) => {
    const dateA = extractGameDate(a);
    const dateB = extractGameDate(b);
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    return dateA - dateB;
  });
}

/**
 * Group games by date
 * @param {Array} games - Array of game objects
 * @returns {Object} - Games grouped by ISO date string
 */
export function groupGamesByDate(games) {
  const grouped = {};
  
  games.forEach(game => {
    const isoDate = getISODate(game);
    if (!isoDate) return;
    
    if (!grouped[isoDate]) {
      grouped[isoDate] = [];
    }
    grouped[isoDate].push(game);
  });
  
  return grouped;
}

/**
 * Get time until game starts
 * @param {Object|string} gameOrDate - Game object or date string
 * @returns {Object} - Object with days, hours, minutes until game
 */
export function getTimeUntilGame(gameOrDate) {
  const gameDate = extractGameDate(gameOrDate);
  if (!gameDate) return null;
  
  const now = new Date();
  const diff = gameDate - now;
  
  if (diff < 0) {
    return { days: 0, hours: 0, minutes: 0, inPast: true };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, inPast: false };
}

/**
 * Get relative time string (e.g., "in 2 hours", "tomorrow")
 * @param {Object|string} gameOrDate - Game object or date string
 * @returns {string}
 */
export function getRelativeTimeString(gameOrDate) {
  const timeUntil = getTimeUntilGame(gameOrDate);
  
  if (!timeUntil) return 'TBD';
  if (timeUntil.inPast) return 'Past';
  
  const { days, hours, minutes } = timeUntil;
  
  if (days > 1) return `in ${days} days`;
  if (days === 1) return 'tomorrow';
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  if (minutes > 0) return `in ${minutes}m`;
  return 'starting soon';
}

export default {
  extractGameDate,
  formatGameDate,
  getISODate,
  getISOTimestamp,
  isToday,
  isPast,
  isInDateRange,
  sortGamesByDate,
  groupGamesByDate,
  getTimeUntilGame,
  getRelativeTimeString
};