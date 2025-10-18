import { InvokeLLM } from "@/api/integrations";

export class TheSportsDBService {
  static BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";
  
  // Get current college football teams and rosters
  static async getCollegeFootballTeams() {
    console.log("🔄 Fetching college football teams from TheSportsDB...");
    
    try {
      const prompt = `Get current college football team rosters from TheSportsDB API for major teams like Alabama, Georgia, Ohio State, Michigan, Texas, etc.
      
      For each team, get the current starting lineup including:
      - Starting QB
      - Starting RB 
      - Top 2 WRs
      - Starting TE
      
      Use the TheSportsDB API endpoints to get accurate 2024-2025 season rosters.
      Only return players who are actually on these teams right now.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            teams: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  team_name: { type: "string" },
                  league: { type: "string" },
                  players: {
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
          }
        }
      });

      return response.teams || [];
    } catch (error) {
      console.error("❌ Error fetching teams from TheSportsDB:", error);
      return [];
    }
  }

  // Get live college football games for today
  static async getLiveCollegeFootballGames() {
    console.log("🔴 Fetching live college football games...");
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const prompt = `Get today's college football games (${today}) from TheSportsDB API or other live sources.
      
      Include:
      - Game matchups (away team @ home team)
      - Actual game times (not TBD)
      - Current game status (upcoming, live, completed)
      - Live scores if games are in progress
      - TV networks
      - Rankings if available
      
      Only return games that are actually scheduled for today.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            games: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  event_id: { type: "string" },
                  sport: { type: "string" },
                  home_team: { type: "string" },
                  away_team: { type: "string" },
                  game_date: { type: "string" },
                  game_time_est: { type: "string" },
                  venue: { type: "string" },
                  status: { type: "string" },
                  tv_network: { type: "string" },
                  home_rank: { type: "number" },
                  away_rank: { type: "number" },
                  live_score: {
                    type: "object",
                    properties: {
                      home: { type: "number" },
                      away: { type: "number" },
                      quarter: { type: "string" },
                      time_remaining: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      });

      return response.games || [];
    } catch (error) {
      console.error("❌ Error fetching live games:", error);
      return [];
    }
  }

  // Get live scores for ongoing games
  static async getLiveScores(gameIds) {
    console.log("📊 Fetching live scores...");
    
    try {
      const prompt = `Get current live scores for college football games in progress.
      
      For each live game, provide:
      - Current score (home vs away)
      - Quarter/period
      - Time remaining
      - Recent scoring plays
      - Key statistics
      
      Game IDs: ${gameIds.join(', ')}`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            live_scores: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  game_id: { type: "string" },
                  home_score: { type: "number" },
                  away_score: { type: "number" },
                  quarter: { type: "string" },
                  time_remaining: { type: "string" },
                  last_play: { type: "string" },
                  home_stats: {
                    type: "object",
                    properties: {
                      total_yards: { type: "number" },
                      passing_yards: { type: "number" },
                      rushing_yards: { type: "number" }
                    }
                  },
                  away_stats: {
                    type: "object",
                    properties: {
                      total_yards: { type: "number" },
                      passing_yards: { type: "number" },
                      rushing_yards: { type: "number" }
                    }
                  }
                }
              }
            }
          }
        }
      });

      return response.live_scores || [];
    } catch (error) {
      console.error("❌ Error fetching live scores:", error);
      return [];
    }
  }

  // Get player information and stats
  static async getPlayerInfo(playerName, teamName) {
    console.log(`👤 Fetching player info for ${playerName}...`);
    
    try {
      const prompt = `Get current information for college football player ${playerName} on ${teamName}.
      
      Include:
      - Full name and position
      - Jersey number
      - Year (Freshman, Sophomore, etc.)
      - Height and weight
      - Season statistics
      - Recent performance trends
      
      Use TheSportsDB or other reliable sources for current 2024-2025 season data.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            position: { type: "string" },
            jersey_number: { type: "number" },
            year: { type: "string" },
            height: { type: "string" },
            weight: { type: "number" },
            season_stats: {
              type: "object",
              properties: {
                games_played: { type: "number" },
                passing_yards: { type: "number" },
                rushing_yards: { type: "number" },
                receiving_yards: { type: "number" },
                touchdowns: { type: "number" }
              }
            }
          }
        }
      });

      return response;
    } catch (error) {
      console.error(`❌ Error fetching player info for ${playerName}:`, error);
      return null;
    }
  }

  // Comprehensive data sync
  static async syncAllCollegeFootballData() {
    console.log("🚀 Starting comprehensive college football data sync...");
    
    try {
      const [teams, games] = await Promise.all([
        this.getCollegeFootballTeams(),
        this.getLiveCollegeFootballGames()
      ]);

      // Get live scores for any games in progress
      const liveGameIds = games.filter(g => g.status === 'live').map(g => g.event_id);
      const liveScores = liveGameIds.length > 0 ? await this.getLiveScores(liveGameIds) : [];

      return {
        teams: teams,
        games: games,
        live_scores: liveScores,
        last_updated: new Date().toISOString(),
        source: "thesportsdb_api"
      };
    } catch (error) {
      console.error("❌ Error in comprehensive data sync:", error);
      return {
        teams: [],
        games: [],
        live_scores: [],
        last_updated: new Date().toISOString(),
        source: "sync_error"
      };
    }
  }
}

export default TheSportsDBService;