const LOGO_MAP = {
  // NFL
  "ARI": "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png", "ATL": "https://a.espncdn.com/i/teamlogos/nfl/500/atl.png",
  "BAL": "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png", "BUF": "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png",
  "CAR": "https://a.espncdn.com/i/teamlogos/nfl/500/car.png", "CHI": "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png",
  "CIN": "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png", "CLE": "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png",
  "DAL": "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png", "DEN": "https://a.espncdn.com/i/teamlogos/nfl/500/den.png",
  "DET": "https://a.espncdn.com/i/teamlogos/nfl/500/det.png", "GB": "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png",
  "HOU": "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png", "IND": "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png",
  "JAX": "https://a.espncdn.com/i/teamlogos/nfl/500/jax.png", "KC": "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
  "LV": "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png", "LAC": "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png",
  "LAR": "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png", "MIA": "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png",
  "MIN": "https://a.espncdn.com/i/teamlogos/nfl/500/min.png", "NE": "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png",
  "NO": "https://a.espncdn.com/i/teamlogos/nfl/500/no.png", "NYG": "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png",
  "NYJ": "https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png", "PHI": "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png",
  "PIT": "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png", "SF": "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png",
  "SEA": "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", "TB": "https://a.espncdn.com/i/teamlogos/nfl/500/tb.png",
  "TEN": "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png", "WSH": "https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png",
  "Arizona Cardinals": "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png", "Atlanta Falcons": "https://a.espncdn.com/i/teamlogos/nfl/500/atl.png",
  "Baltimore Ravens": "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png", "Buffalo Bills": "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png",
  "Carolina Panthers": "https://a.espncdn.com/i/teamlogos/nfl/500/car.png", "Chicago Bears": "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png",
  "Cincinnati Bengals": "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png", "Cleveland Browns": "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png",
  "Dallas Cowboys": "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png", "Denver Broncos": "https://a.espncdn.com/i/teamlogos/nfl/500/den.png",
  "Detroit Lions": "https://a.espncdn.com/i/teamlogos/nfl/500/det.png", "Green Bay Packers": "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png",
  "Houston Texans": "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png", "Indianapolis Colts": "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png",
  "Jacksonville Jaguars": "https://a.espncdn.com/i/teamlogos/nfl/500/jax.png", "Kansas City Chiefs": "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
  "Las Vegas Raiders": "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png", "Los Angeles Chargers": "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png",
  "Los Angeles Rams": "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png", "Miami Dolphins": "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png",
  "Minnesota Vikings": "https://a.espncdn.com/i/teamlogos/nfl/500/min.png", "New England Patriots": "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png",
  "New Orleans Saints": "https://a.espncdn.com/i/teamlogos/nfl/500/no.png", "New York Giants": "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png",
  "New York Jets": "https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png", "Philadelphia Eagles": "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png",
  "Pittsburgh Steelers": "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png", "San Francisco 49ers": "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png",
  "Seattle Seahawks": "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png", "Tampa Bay Buccaneers": "https://a.espncdn.com/i/teamlogos/nfl/500/tb.png",
  "Tennessee Titans": "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png", "Washington Commanders": "https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png",
};

const ABBR_MAP = {
    "Arizona Cardinals": "ARI", "Atlanta Falcons": "ATL", "Baltimore Ravens": "BAL", "Buffalo Bills": "BUF",
    "Carolina Panthers": "CAR", "Chicago Bears": "CHI", "Cincinnati Bengals": "CIN", "Cleveland Browns": "CLE",
    "Dallas Cowboys": "DAL", "Denver Broncos": "DEN", "Detroit Lions": "DET", "Green Bay Packers": "GB",
    "Houston Texans": "HOU", "Indianapolis Colts": "IND", "Jacksonville Jaguars": "JAX", "Kansas City Chiefs": "KC",
    "Las Vegas Raiders": "LV", "Los Angeles Chargers": "LAC", "Los Angeles Rams": "LAR", "Miami Dolphins": "MIA",
    "Minnesota Vikings": "MIN", "New England Patriots": "NE", "New Orleans Saints": "NO", "New York Giants": "NYG",
    "New York Jets": "NYJ", "Philadelphia Eagles": "PHI", "Pittsburgh Steelers": "PIT", "San Francisco 49ers": "SF",
    "Seattle Seahawks": "SEA", "Tampa Bay Buccaneers": "TB", "Tennessee Titans": "TEN", "Washington Commanders": "WSH",
};

export function getTeamLogo(sport, teamName) {
  if (!teamName) return null;
  const abbr = ABBR_MAP[teamName] || teamName;
  return LOGO_MAP[abbr] || LOGO_MAP[teamName] || null;
}

export function getTeamAbbr(teamName) {
    if (!teamName) return "N/A";
    return ABBR_MAP[teamName] || teamName.split(' ').pop().substring(0, 3).toUpperCase();
}