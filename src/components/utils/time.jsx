/**
 * Format ISO timestamp to Eastern Time display
 * @param {string} isoOrString - ISO-8601 timestamp or time string
 * @returns {string} - Formatted time in EST/EDT (e.g. "Jan 15, 8:15 PM")
 */
export function formatTimeEastern(isoOrString) {
  if (!isoOrString) return "Time TBD";
  
  // Handle explicit TBD values
  const str = String(isoOrString).toLowerCase();
  if (str.includes("tbd") || str === "null" || str === "undefined") {
    return "Time TBD";
  }

  try {
    // Parse as Date (should be ISO)
    const d = new Date(isoOrString);
    
    // Check if valid date
    if (isNaN(d.getTime())) {
      return "Time TBD";
    }

    // Format in America/New_York timezone
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(d) + " EST";
    
  } catch (err) {
    console.error("Error formatting time:", isoOrString, err);
    return "Time TBD";
  }
}

/**
 * Format odds value - handles different structures
 * @param {any} val - Odds value (could be string, number, or object)
 * @returns {string} - Formatted odds string
 */
export function formatOdds(val) {
  if (!val || val === "-") return "-";
  
  // If it's an object with home/away, format as string
  if (typeof val === "object" && !Array.isArray(val)) {
    if (val.home || val.away) {
      return `${val.home || '-'} / ${val.away || '-'}`;
    }
    return JSON.stringify(val);
  }
  
  // Return as string
  return String(val);
}

/**
 * Generate team abbreviation from team name
 * @param {string} teamName - Full team name
 * @returns {string} - 3-4 letter abbreviation
 */
export function getTeamAbbr(teamName) {
  if (!teamName || teamName === "TBD") return "TBD";
  
  // Common NFL abbreviations
  const nflAbbr = {
    "Arizona Cardinals": "ARI",
    "Atlanta Falcons": "ATL",
    "Baltimore Ravens": "BAL",
    "Buffalo Bills": "BUF",
    "Carolina Panthers": "CAR",
    "Chicago Bears": "CHI",
    "Cincinnati Bengals": "CIN",
    "Cleveland Browns": "CLE",
    "Dallas Cowboys": "DAL",
    "Denver Broncos": "DEN",
    "Detroit Lions": "DET",
    "Green Bay Packers": "GB",
    "Houston Texans": "HOU",
    "Indianapolis Colts": "IND",
    "Jacksonville Jaguars": "JAX",
    "Kansas City Chiefs": "KC",
    "Las Vegas Raiders": "LV",
    "Los Angeles Chargers": "LAC",
    "Los Angeles Rams": "LAR",
    "Miami Dolphins": "MIA",
    "Minnesota Vikings": "MIN",
    "New England Patriots": "NE",
    "New Orleans Saints": "NO",
    "New York Giants": "NYG",
    "New York Jets": "NYJ",
    "Philadelphia Eagles": "PHI",
    "Pittsburgh Steelers": "PIT",
    "San Francisco 49ers": "SF",
    "Seattle Seahawks": "SEA",
    "Tampa Bay Buccaneers": "TB",
    "Tennessee Titans": "TEN",
    "Washington Commanders": "WAS"
  };

  // Check if exact match exists
  if (nflAbbr[teamName]) return nflAbbr[teamName];

  // For other sports or unrecognized teams, generate abbreviation
  // Remove common words
  const cleaned = teamName
    .replace(/\b(University|College|State|Tech|A&M)\b/gi, '')
    .trim();
  
  const words = cleaned.split(/\s+/);
  
  // If single word, take first 3-4 letters
  if (words.length === 1) {
    return words[0].substring(0, 4).toUpperCase();
  }
  
  // If two words, take first 2 letters of each
  if (words.length === 2) {
    return (words[0].substring(0, 2) + words[1].substring(0, 2)).toUpperCase();
  }
  
  // If multiple words, take first letter of each significant word
  return words
    .filter(w => w.length > 2)
    .map(w => w[0])
    .join('')
    .substring(0, 4)
    .toUpperCase();
}