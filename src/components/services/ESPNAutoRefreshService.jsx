
import { fetchESPNSchedule } from "@/api/functions";
import { advanceSportWeek } from "@/api/functions";
import { Game } from "@/api/entities";

class ESPNAutoRefreshService {
  constructor() {
    this.refreshInterval = 30 * 60 * 1000; // 30 minutes in milliseconds
    this.intervals = {};
    this.healthCheckIntervals = {};
    this.currentWeeks = {
      NFL: 5,
      CFB: 6,
      NBA: 1,
      MLB: 1,  // MLB now uses weekly system
      UFC: 1
    };
    this.lastHealthCheck = {};
    this.healthStatus = {};
  }

  // Start auto-refresh for a specific sport
  startAutoRefresh(sport, onUpdate) {
    console.log(`🔄 Starting auto-refresh for ${sport} every 30 minutes...`);
    
    // Clear existing interval if any
    this.stopAutoRefresh(sport);
    
    // Initial fetch
    this.fetchAndUpdate(sport, onUpdate);
    
    // Set interval for 30-minute refreshes
    this.intervals[sport] = setInterval(() => {
      this.fetchAndUpdate(sport, onUpdate);
    }, this.refreshInterval);

    // Start health check monitoring
    this.startHealthCheck(sport);
    
    // Start Tuesday 1 AM week advancement check
    this.startWeekAdvancementCheck(sport);
  }

  // Stop auto-refresh for a specific sport
  stopAutoRefresh(sport) {
    if (this.intervals[sport]) {
      clearInterval(this.intervals[sport]);
      delete this.intervals[sport];
      console.log(`⏹️ Stopped auto-refresh for ${sport}`);
    }
    
    if (this.healthCheckIntervals[sport]) {
      clearInterval(this.healthCheckIntervals[sport]);
      delete this.healthCheckIntervals[sport];
    }
  }

  // Stop all auto-refreshes
  stopAll() {
    Object.keys(this.intervals).forEach(sport => {
      this.stopAutoRefresh(sport);
    });
  }

  // Health check - runs every 30 minutes
  startHealthCheck(sport) {
    this.healthCheckIntervals[sport] = setInterval(async () => {
      await this.performHealthCheck(sport);
    }, this.refreshInterval);
    
    // Immediate health check
    this.performHealthCheck(sport);
  }

  async performHealthCheck(sport) {
    try {
      console.log(`🏥 Health check for ${sport}...`);
      
      const games = await Game.filter({ sport: sport });
      const now = new Date();
      
      this.healthStatus[sport] = {
        status: 'healthy',
        total_games: games.length,
        live_games: games.filter(g => g.status === 'live').length,
        upcoming_games: games.filter(g => g.status === 'upcoming').length,
        completed_games: games.filter(g => g.status === 'completed').length,
        last_check: now.toISOString(),
        current_week: this.currentWeeks[sport]
      };
      
      this.lastHealthCheck[sport] = now;
      
      console.log(`✅ ${sport} Health Check:`, this.healthStatus[sport]);
      
      // Check if week should advance (Tuesday 1 AM ET check)
      await this.checkWeekAdvancement(sport);
      
    } catch (error) {
      console.error(`❌ Health check failed for ${sport}:`, error);
      this.healthStatus[sport] = {
        status: 'unhealthy',
        error: error.message,
        last_check: new Date().toISOString()
      };
    }
  }

  // Check if it's Tuesday 1 AM ET and advance week if needed
  async checkWeekAdvancement(sport) {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 2 = Tuesday
    const hour = now.getHours();
    
    // Check if it's Tuesday (2) and hour is 1 AM
    if (dayOfWeek === 2 && hour === 1) {
      console.log(`📅 Tuesday 1 AM detected - checking if ${sport} Week ${this.currentWeeks[sport]} should advance...`);
      
      try {
        const advanceCheck = await advanceSportWeek({
          sport: sport,
          currentWeek: this.currentWeeks[sport]
        });
        
        if (advanceCheck.data.should_advance) {
          const newWeek = advanceCheck.data.next_week;
          console.log(`✅ Advancing ${sport} from Week ${this.currentWeeks[sport]} to Week ${newWeek}`);
          this.currentWeeks[sport] = newWeek;
          
          // Immediately fetch new week's games
          await this.fetchAndUpdate(sport, null);
        } else {
          console.log(`⏳ ${sport} Week ${this.currentWeeks[sport]} not complete yet. ${advanceCheck.data.games_remaining} games remaining.`);
        }
      } catch (error) {
        console.error(`❌ Error checking week advancement for ${sport}:`, error);
      }
    }
  }

  // Separate week advancement check (runs independently)
  startWeekAdvancementCheck(sport) {
    // Check every 30 minutes for Tuesday 1 AM
    setInterval(async () => {
      await this.checkWeekAdvancement(sport);
    }, this.refreshInterval);
  }

  // Fetch and update schedule for a sport
  async fetchAndUpdate(sport, onUpdate) {
    try {
      console.log(`🔍 Fetching ESPN ${sport} Week ${this.currentWeeks[sport]} schedule...`);
      
      const response = await fetchESPNSchedule({
        sport: sport,
        week: this.currentWeeks[sport]
      });

      if (response.data.success && response.data.data) {
        const scheduleData = response.data.data;
        
        // Validate games array exists
        if (!scheduleData.games || !Array.isArray(scheduleData.games)) {
          console.warn(`⚠️ No games array found for ${sport} Week ${this.currentWeeks[sport]}`);
          return;
        }
        
        // Check if we should advance to next week (all games completed)
        if (scheduleData.should_advance_week) {
          console.log(`✅ ${sport} Week ${this.currentWeeks[sport]} complete! Advancing to Week ${scheduleData.next_week}...`);
          this.currentWeeks[sport] = scheduleData.next_week;
          
          // Fetch next week's schedule immediately
          return this.fetchAndUpdate(sport, onUpdate);
        }

        // Update database with fresh games
        await this.updateGamesInDatabase(sport, scheduleData.games);
        
        // Notify caller with updated data
        if (onUpdate) {
          onUpdate({
            sport: sport,
            week: this.currentWeeks[sport],
            games: scheduleData.games || [],
            timestamp: new Date().toISOString(),
            health: this.healthStatus[sport]
          });
        }

        console.log(`✅ ${sport} schedule updated - ${scheduleData.games?.length || 0} games`);
      }
      
    } catch (error) {
      console.error(`❌ Error fetching ${sport} schedule:`, error);
    }
  }

  // Update games in database
  async updateGamesInDatabase(sport, games) {
    try {
      // Validate games parameter
      if (!games || !Array.isArray(games)) {
        console.warn(`⚠️ Invalid games data for ${sport}, skipping database update`);
        return;
      }

      // Get existing games for this sport
      const existingGames = await Game.filter({ sport: sport });
      
      // Delete existing games for clean slate
      for (const game of existingGames) {
        await Game.delete(game.id);
      }
      
      // Add new games with proper sport tag
      const processedGames = games.map(game => ({
        ...game,
        sport: sport, // Ensure sport is set correctly
        status: game.status || 'upcoming'
      }));
      
      if (processedGames.length > 0) {
        await Game.bulkCreate(processedGames);
        console.log(`💾 Updated ${processedGames.length} ${sport} games in database`);
      } else {
        console.log(`⚠️ No games to update for ${sport}`);
      }
      
    } catch (error) {
      console.error(`❌ Error updating ${sport} games in database:`, error);
    }
  }

  // Manual refresh for a sport
  async manualRefresh(sport) {
    console.log(`🔄 Manual refresh triggered for ${sport}...`);
    return this.fetchAndUpdate(sport, null);
  }

  // Get current week for a sport
  getCurrentWeek(sport) {
    return this.currentWeeks[sport];
  }

  // Set current week for a sport (manual override)
  setCurrentWeek(sport, week) {
    this.currentWeeks[sport] = week;
    console.log(`📅 ${sport} week set to ${week}`);
  }

  // Get health status for all sports
  getHealthStatus() {
    return this.healthStatus;
  }

  // Get last health check time
  getLastHealthCheck(sport) {
    return this.lastHealthCheck[sport];
  }
}

// Export singleton instance
const autoRefreshService = new ESPNAutoRefreshService();
export default autoRefreshService;
