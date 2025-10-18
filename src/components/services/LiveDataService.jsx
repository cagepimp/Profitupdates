import TheSportsDBService from "./TheSportsDBService";
import OurLadsRosterService from "./OurLadsRosterService";
import { Game } from "@/api/entities";

export class LiveDataService {
  static async refreshLiveData() {
    console.log("🔄 Refreshing live sports data with OurLads rosters...");
    
    try {
      // Get comprehensive data from multiple sources
      const [sportsData, rosterData] = await Promise.all([
        TheSportsDBService.syncAllCollegeFootballData(),
        OurLadsRosterService.syncAllRosters()
      ]);
      
      // Update games in database with live scores and roster data
      for (const game of sportsData.games) {
        try {
          // Check if game exists
          const existingGames = await Game.filter({ 
            home_team: game.home_team, 
            away_team: game.away_team 
          });
          
          if (existingGames.length > 0) {
            // Update existing game with live data
            await Game.update(existingGames[0].id, {
              status: game.status,
              current_score: game.live_score,
              roster_data: {
                home: rosterData.cfb_rosters[game.home_team] || rosterData.nfl_rosters[game.home_team],
                away: rosterData.cfb_rosters[game.away_team] || rosterData.nfl_rosters[game.away_team]
              },
              last_updated: new Date().toISOString()
            });
          } else {
            // Create new game entry
            await Game.create({
              sport: "CFB",
              home_team: game.home_team,
              away_team: game.away_team,
              game_date: game.game_date,
              game_time_est: game.game_time_est,
              venue: game.venue,
              status: game.status,
              tv_network: game.tv_network,
              home_rank: game.home_rank,
              away_rank: game.away_rank,
              current_score: game.live_score,
              roster_data: {
                home: rosterData.cfb_rosters[game.home_team] || rosterData.nfl_rosters[game.home_team],
                away: rosterData.cfb_rosters[game.away_team] || rosterData.nfl_rosters[game.away_team]
              },
              last_updated: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error(`Error updating game ${game.home_team} vs ${game.away_team}:`, error);
        }
      }
      
      return {
        success: true,
        games_updated: sportsData.games.length,
        rosters_updated: Object.keys(rosterData.cfb_rosters).length + Object.keys(rosterData.nfl_rosters).length,
        source: "live_data_with_ourlads_rosters"
      };
      
    } catch (error) {
      console.error("❌ Error refreshing live data:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Auto-refresh every 5 minutes for live games
  static startLiveUpdates() {
    console.log("▶️ Starting live updates with OurLads roster sync (5 minute intervals)...");
    
    const interval = setInterval(async () => {
      await this.refreshLiveData();
    }, 300000); // 5 minutes
    
    return interval;
  }
}

export default LiveDataService;