// Helper function to get injuries for a specific game
// Add this to your Home.js or create a utils file

export async function getGameInjuries(sport, homeTeam, awayTeam) {
  try {
    const { fetchInjuries } = await import('@/api/functions');
    const response = await fetchInjuries({ sport });
    
    if (response?.data?.injuries) {
      // Filter injuries for teams in this game
      const gameInjuries = response.data.injuries.filter(inj => {
        const teamAbbr = inj.team_abbr?.toLowerCase() || '';
        const home = homeTeam?.toLowerCase() || '';
        const away = awayTeam?.toLowerCase() || '';
        
        return (
          home.includes(teamAbbr) || 
          away.includes(teamAbbr) ||
          teamAbbr.includes(home.split(' ').pop()) ||
          teamAbbr.includes(away.split(' ').pop())
        );
      });
      
      return gameInjuries;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching game injuries:', error);
    return [];
  }
}