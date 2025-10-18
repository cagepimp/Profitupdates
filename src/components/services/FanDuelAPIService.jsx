import { InvokeLLM } from "@/api/integrations";

// FanDuel API Integration Service
export class FanDuelAPIService {
  
  // Research and fetch FanDuel API documentation and endpoints
  static async researchFanDuelAPIs() {
    console.log("🔍 Researching FanDuel API resources...");
    
    try {
      const prompt = `Provide basic information about FanDuel API integration options. Include simple details about available endpoints, authentication methods, and basic implementation approaches. Keep responses simple and concise.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            fanduel_api_status: { type: "string" },
            basic_endpoints: { type: "string" },
            auth_method: { type: "string" },
            notes: { type: "string" }
          }
        }
      });

      return response;
      
    } catch (error) {
      console.error("❌ Error researching FanDuel APIs:", error);
      return {
        fanduel_api_status: "Research failed",
        basic_endpoints: "Unable to fetch endpoint information",
        auth_method: "Unknown",
        notes: "API research failed due to integration error"
      };
    }
  }

  // Fetch live FanDuel odds and lines with simplified schema
  static async fetchFanDuelOdds(sport) {
    console.log(`🎯 Fetching FanDuel odds for ${sport}...`);
    
    try {
      const prompt = `Get current FanDuel sportsbook odds for ${sport}. Include basic game information, moneylines, spreads, and totals. Keep data simple.`;

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
                  game_time: { type: "string" },
                  status: { type: "string" },
                  moneyline_home: { type: "number" },
                  moneyline_away: { type: "number" },
                  spread_line: { type: "number" },
                  spread_odds: { type: "number" },
                  total_line: { type: "number" },
                  total_over_odds: { type: "number" },
                  total_under_odds: { type: "number" }
                }
              }
            },
            player_props: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  player_name: { type: "string" },
                  team: { type: "string" },
                  prop_type: { type: "string" },
                  line: { type: "number" },
                  over_odds: { type: "number" },
                  under_odds: { type: "number" }
                }
              }
            }
          }
        }
      });

      return response;
      
    } catch (error) {
      console.error("❌ Error fetching FanDuel odds:", error);
      return { games: [], player_props: [] };
    }
  }

  // Fetch FanDuel contest data with simplified schema
  static async fetchFanDuelContests(sport) {
    console.log(`🏆 Fetching FanDuel contests for ${sport}...`);
    
    try {
      const prompt = `Get current FanDuel daily fantasy contests for ${sport}. Include basic contest information and player data.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            contests: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  contest_id: { type: "string" },
                  name: { type: "string" },
                  entry_fee: { type: "number" },
                  total_prizes: { type: "number" },
                  entries: { type: "number" },
                  start_time: { type: "string" }
                }
              }
            },
            players: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  player_id: { type: "string" },
                  name: { type: "string" },
                  team: { type: "string" },
                  position: { type: "string" },
                  salary: { type: "number" },
                  projected_points: { type: "number" }
                }
              }
            }
          }
        }
      });

      return response;
      
    } catch (error) {
      console.error("❌ Error fetching FanDuel contests:", error);
      return { contests: [], players: [] };
    }
  }

  // Sync all FanDuel data
  static async syncAllFanDuelData(sport) {
    console.log(`🔄 Syncing all FanDuel data for ${sport}...`);
    
    try {
      const [apiDocs, oddsData, contestData] = await Promise.all([
        this.researchFanDuelAPIs(),
        this.fetchFanDuelOdds(sport),
        this.fetchFanDuelContests(sport)
      ]);

      return {
        api_documentation: apiDocs,
        sportsbook_data: oddsData,
        fantasy_data: contestData,
        timestamp: new Date().toISOString(),
        source: "fanduel_api_research"
      };
      
    } catch (error) {
      console.error("❌ Error syncing FanDuel data:", error);
      return null;
    }
  }
}

export default FanDuelAPIService;