import { InvokeLLM } from "@/api/integrations";

export class OurLadsRosterService {
  static BASE_URL = "https://www.ourlads.com/ncaa-football-depth-charts/";
  
  // Get current 2025 college football rosters from OurLads
  static async getCurrentCollegeFootballRosters(teams) {
    console.log("🔄 Fetching 2025 CFB rosters from OurLads...");
    
    try {
      const teamList = teams.join(', ');
      
      const prompt = `Get the current 2025 college football starting lineups from OurLads.com depth charts (${this.BASE_URL}) for these teams: ${teamList}.
      
      For each team, provide the current starting players:
      - Starting QB (Quarterback)
      - Starting RB (Running Back) 
      - WR1 and WR2 (Wide Receivers)
      - Starting TE (Tight End)
      
      Use the OurLads depth charts which are the most accurate source for current college football rosters.
      Only return players who are listed as starters on the current 2025 depth charts.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            rosters: {
              type: "object",
              additionalProperties: {
                type: "object",
                properties: {
                  QB: { type: "string" },
                  RB: { type: "string" },
                  WR1: { type: "string" },
                  WR2: { type: "string" },
                  TE: { type: "string" }
                }
              }
            }
          }
        }
      });

      return response.rosters || {};
    } catch (error) {
      console.error("❌ Error fetching rosters from OurLads:", error);
      return {};
    }
  }

  // Get NFL rosters for 2025 season
  static async getCurrentNFLRosters(teams) {
    console.log("🔄 Fetching 2025 NFL rosters from OurLads...");
    
    try {
      const teamList = teams.join(', ');
      
      const prompt = `Get the current 2025 NFL starting lineups from OurLads.com depth charts for these teams: ${teamList}.
      
      For each team, provide the current starting players:
      - Starting QB
      - Starting RB
      - WR1 and WR2 
      - Starting TE
      
      Use OurLads NFL depth charts for the most accurate current roster information.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            rosters: {
              type: "object",
              additionalProperties: {
                type: "object",
                properties: {
                  QB: { type: "string" },
                  RB: { type: "string" },
                  WR1: { type: "string" },
                  WR2: { type: "string" },
                  TE: { type: "string" }
                }
              }
            }
          }
        }
      });

      return response.rosters || {};
    } catch (error) {
      console.error("❌ Error fetching NFL rosters from OurLads:", error);
      return {};
    }
  }

  // Get specific player information with stats
  static async getPlayerDetails(playerName, teamName, sport) {
    console.log(`👤 Fetching detailed info for ${playerName} (${teamName})...`);
    
    try {
      const prompt = `Get detailed information for ${sport} player ${playerName} on ${teamName} from OurLads depth charts and current season data.
      
      Include:
      - Full name and position
      - Jersey number
      - Height, weight, year/experience
      - Current season statistics
      - Recent performance trends
      - Depth chart position (starter, backup, etc.)
      
      Use OurLads.com and current 2025 season data sources.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            position: { type: "string" },
            jersey_number: { type: "number" },
            height: { type: "string" },
            weight: { type: "number" },
            year: { type: "string" },
            depth_chart_position: { type: "string" },
            season_stats: {
              type: "object",
              properties: {
                games_played: { type: "number" },
                passing_yards: { type: "number" },
                rushing_yards: { type: "number" },
                receiving_yards: { type: "number" },
                touchdowns: { type: "number" },
                completions: { type: "number" },
                attempts: { type: "number" }
              }
            }
          }
        }
      });

      return response;
    } catch (error) {
      console.error(`❌ Error fetching player details for ${playerName}:`, error);
      return null;
    }
  }

  // Comprehensive roster sync for all major teams
  static async syncAllRosters() {
    console.log("🚀 Starting comprehensive roster sync from OurLads...");
    
    const cfbTeams = [
      'Alabama', 'Georgia', 'Michigan', 'Ohio State', 'Texas', 'Oklahoma', 
      'Oregon', 'Washington', 'Notre Dame', 'Penn State', 'USC', 'Tennessee',
      'LSU', 'Clemson', 'Florida State', 'Miami', 'Colorado', 'Arizona State',
      'Iowa State', 'Boise State', 'Mississippi State', 'Auburn', 'Florida',
      'Wisconsin', 'Iowa', 'Ole Miss', 'Kentucky', 'South Carolina'
    ];

    const nflTeams = [
      'Kansas City Chiefs', 'Buffalo Bills', 'Cincinnati Bengals', 'Baltimore Ravens',
      'Miami Dolphins', 'New York Jets', 'Cleveland Browns', 'Pittsburgh Steelers',
      'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars', 'Tennessee Titans',
      'Denver Broncos', 'Las Vegas Raiders', 'Los Angeles Chargers', 'Seattle Seahawks',
      'Philadelphia Eagles', 'Dallas Cowboys', 'Washington Commanders', 'New York Giants',
      'Green Bay Packers', 'Minnesota Vikings', 'Chicago Bears', 'Detroit Lions',
      'Tampa Bay Buccaneers', 'Atlanta Falcons', 'New Orleans Saints', 'Carolina Panthers',
      'San Francisco 49ers', 'Los Angeles Rams', 'Arizona Cardinals'
    ];
    
    try {
      const [cfbRosters, nflRosters] = await Promise.all([
        this.getCurrentCollegeFootballRosters(cfbTeams),
        this.getCurrentNFLRosters(nflTeams)
      ]);

      return {
        cfb_rosters: cfbRosters,
        nfl_rosters: nflRosters,
        last_updated: new Date().toISOString(),
        source: "ourlads_depth_charts"
      };
    } catch (error) {
      console.error("❌ Error in comprehensive roster sync:", error);
      return {
        cfb_rosters: {},
        nfl_rosters: {},
        last_updated: new Date().toISOString(),
        source: "sync_error"
      };
    }
  }
}

export default OurLadsRosterService;