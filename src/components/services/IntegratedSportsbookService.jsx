import { InvokeLLM } from "@/api/integrations";
import FanDuelAPIService from "./FanDuelAPIService";
import DraftKingsService from "./DraftKingsService";

// Integrated service combining FanDuel and DraftKings data
export class IntegratedSportsbookService {
  
  // Fetch comprehensive odds comparison data with specific dates
  static async fetchComprehensiveOdds(sport, targetDate = "2025-09-27") {
    console.log(`🔄 Fetching comprehensive ${sport} odds for ${targetDate}...`);
    
    try {
      let datePrompt = "";
      
      // Set specific date prompts based on sport
      if (sport === "CFB") {
        datePrompt = "September 27, 2025 (Saturday) - Get the TOP 25 ranked college football games happening today. Include major conferences like SEC, Big Ten, ACC, Big 12, Pac-12.";
      } else if (sport === "NFL") {
        datePrompt = "September 28, 2025 (Sunday) - Get NFL games scheduled for this Sunday.";
      } else {
        datePrompt = `${targetDate} - Get current ${sport} games for this date.`;
      }

      const prompt = `Get current ${sport} games and betting odds for ${datePrompt}

Include:
- Game matchups (home vs away teams)  
- Exact game dates and times
- Stadium/venue information
- Betting lines: moneyline odds, point spreads, over/under totals
- Popular player props for key players
- Set status to "upcoming" for future games

For College Football: Focus on TOP 25 ranked teams and major conference matchups happening on Saturday September 27, 2025.
For NFL: Focus on Sunday September 28, 2025 games, plus Monday Night Football on September 29, 2025.

Keep data structured and realistic.`;

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
                  game_id: { type: "string" },
                  sport: { type: "string" },
                  home_team: { type: "string" },
                  away_team: { type: "string" },
                  game_date: { type: "string" },
                  game_time: { type: "string" },
                  venue: { type: "string" },
                  fd_moneyline_home: { type: "number" },
                  fd_moneyline_away: { type: "number" },
                  dk_moneyline_home: { type: "number" },
                  dk_moneyline_away: { type: "number" },
                  fd_spread: { type: "number" },
                  dk_spread: { type: "number" },
                  fd_total: { type: "number" },
                  dk_total: { type: "number" },
                  status: { type: "string" }
                },
                required: ["game_id", "sport", "home_team", "away_team", "game_date", "status"]
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
                  prop_line: { type: "number" },
                  fd_over_odds: { type: "number" },
                  fd_under_odds: { type: "number" },
                  dk_over_odds: { type: "number" },
                  dk_under_odds: { type: "number" }
                },
                required: ["player_name", "team", "prop_type", "prop_line"]
              }
            }
          },
          required: ["games", "player_props"]
        }
      });

      return response;
      
    } catch (error) {
      console.error("❌ Error fetching comprehensive odds:", error);
      return { games: [], player_props: [] };
    }
  }

  // Simplified API research
  static async researchAPIImplementations() {
    console.log("🔬 Researching sportsbook API implementations...");
    
    try {
      const prompt = `Provide basic information about sportsbook API integration. Keep response simple and concise.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            fanduel_status: { type: "string" },
            draftkings_status: { type: "string" },
            notes: { type: "string" }
          }
        }
      });

      return response;
      
    } catch (error) {
      console.error("❌ Error researching API implementations:", error);
      return {
        fanduel_status: "Research failed",
        draftkings_status: "Research failed", 
        notes: "Unable to fetch API information due to integration error"
      };
    }
  }

  // Complete integration sync with date-specific logic
  static async syncAllData(sport) {
    console.log(`🚀 Starting complete sportsbook data sync for ${sport}...`);
    
    try {
      let targetDate;
      
      // Set target dates based on sport
      if (sport === "CFB") {
        targetDate = "2025-09-27"; // Saturday college football
      } else if (sport === "NFL") {
        targetDate = "2025-09-28"; // Sunday NFL + Monday night
      } else {
        targetDate = "2025-09-27"; // Default to a general date if sport is not CFB or NFL
      }

      const [comprehensiveOdds, apiResearch, fanDuelData] = await Promise.all([
        this.fetchComprehensiveOdds(sport, targetDate),
        this.researchAPIImplementations(),
        FanDuelAPIService.syncAllFanDuelData(sport)
      ]);

      return {
        comprehensive_odds: comprehensiveOdds,
        api_research: apiResearch,
        fanduel_data: fanDuelData,
        timestamp: new Date().toISOString(),
        source: "integrated_sportsbook_sync"
      };
      
    } catch (error) {
      console.error("❌ Error in complete sync:", error);
      return null;
    }
  }
}

export default IntegratedSportsbookService;