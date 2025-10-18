import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSlatesForSport } from "@/api/functions";
import { runAnalyzerPropsV3 } from "@/api/functions";
import { runAnalyzer10000Plus } from "@/api/functions";
import { Loader2 } from "lucide-react";
import GameCard from "@/components/sports/GameCard";

// Power 5 conference teams (for CFB filtering)
const POWER_5_TEAMS = [
  // SEC
  'Alabama', 'Arkansas', 'Auburn', 'Florida', 'Georgia', 'Kentucky', 'LSU', 
  'Mississippi State', 'Missouri', 'Ole Miss', 'South Carolina', 'Tennessee', 
  'Texas A&M', 'Vanderbilt', 'Texas', 'Oklahoma',
  // Big Ten
  'Illinois', 'Indiana', 'Iowa', 'Maryland', 'Michigan', 'Michigan State', 
  'Minnesota', 'Nebraska', 'Northwestern', 'Ohio State', 'Penn State', 'Purdue', 
  'Rutgers', 'Wisconsin', 'UCLA', 'USC', 'Oregon', 'Washington',
  // ACC
  'Boston College', 'Clemson', 'Duke', 'Florida State', 'Georgia Tech', 
  'Louisville', 'Miami', 'NC State', 'North Carolina', 'Pittsburgh', 'Syracuse', 
  'Virginia', 'Virginia Tech', 'Wake Forest', 'SMU', 'California', 'Stanford',
  // Big 12
  'Baylor', 'BYU', 'UCF', 'Cincinnati', 'Houston', 'Iowa State', 'Kansas', 
  'Kansas State', 'Oklahoma State', 'TCU', 'Texas Tech', 'West Virginia', 
  'Arizona', 'Arizona State', 'Colorado', 'Utah'
];

function isPower5Game(game) {
  const homeTeam = game.home_team || game.home || '';
  const awayTeam = game.away_team || game.away || '';
  
  return POWER_5_TEAMS.some(team => 
    homeTeam.includes(team) || awayTeam.includes(team)
  );
}

export default function SportPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sport = query.get("sport")?.toUpperCase() || "NFL";

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        setError(null);
        
        const dateFrom = new Date().toISOString();
        const dateTo = new Date("2025-12-31T23:59:59Z").toISOString();
        
        console.log(`📊 Fetching ${sport} games...`);
        
        const response = await getSlatesForSport({ sport, dateFrom, dateTo });
        const data = response?.data || response;
        
        console.log(`✅ ${sport} response:`, data);
        
        if (data?.success && Array.isArray(data.games)) {
          let filteredGames = data.games;
          
          // Apply Power 5 filter for CFB only
          if (sport === "CFB") {
            filteredGames = data.games.filter(isPower5Game);
            console.log(`🏈 Filtered ${data.games.length} CFB games to ${filteredGames.length} Power 5 games`);
          }
          
          setGames(filteredGames);
          console.log(`✅ Set ${filteredGames.length} ${sport} games`);
        } else {
          setGames([]);
          setError(data?.message || `No ${sport} games available`);
        }
      } catch (err) {
        console.error(`❌ ${sport} fetch error:`, err);
        setError(err.message);
        setGames([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGames();
  }, [sport]);

  // EXACT copy from working Home.jsx
  const handleAnalyzeGame = async (game, analysisType = 'game') => {
    try {
      console.log(`🧠 Analyzing ${analysisType} for game:`, game.id);
      const analysisKey = `${game.id}_${analysisType}`;
      setAnalysisResults(prev => ({ ...prev, [analysisKey]: { loading: true } }));

      // Fetch injury data for this game
      let injuryData = [];
      try {
        const { fetchInjuries } = await import('@/api/functions');
        const injResponse = await fetchInjuries({ sport });
        if (injResponse?.data?.injuries) {
          const homeTeam = game.home_team || game.home || '';
          const awayTeam = game.away_team || game.away || '';

          injuryData = injResponse.data.injuries.filter(inj => {
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
        }
      } catch (injError) {
        console.warn('Could not fetch injury data:', injError);
      }

      let response;

      if (analysisType === 'player_props') {
        response = await runAnalyzerPropsV3({
          sport: sport,
          gameId: game.id,
          analysisType: 'player'
        });
      } else if (analysisType === 'team_props') {
        response = await runAnalyzerPropsV3({
          sport: sport,
          gameId: game.id,
          analysisType: 'team'
        });
      } else {
        response = await runAnalyzer10000Plus({
          sport: sport,
          gameId: game.id
        });
      }

      const data = response?.data || response;
      console.log(`✅ ${analysisType} analysis result:`, data);

      if (data?.success && data?.results && data.results.length > 0) {
        const analysis = data.results[0].analysis;

        setAnalysisResults(prev => ({
          ...prev,
          [analysisKey]: {
            loading: false,
            data: analysis,
            type: analysisType
          }
        }));

        // Force the card to show the analysis
        console.log('✅ Analysis saved:', analysisKey, analysis);
      } else {
        throw new Error(data?.error || data?.message || 'Analysis failed - no results returned');
      }
    } catch (error) {
      console.error(`❌ ${analysisType} analysis error:`, error);
      const analysisKey = `${game.id}_${analysisType}`;
      setAnalysisResults(prev => ({
        ...prev,
        [analysisKey]: {
          loading: false,
          error: error.message
        }
      }));
      alert(`❌ Analysis failed: ${error.message}`);
    }
  };

  // Sport-specific display configurations
  const sportConfig = {
    NFL: { emoji: "🏈", title: "NFL", subtitle: "National Football League" },
    CFB: { emoji: "🏈", title: "College Football - Power 5", subtitle: "SEC, Big Ten, ACC, Big 12, and Pac-12 conferences" },
    NBA: { emoji: "🏀", title: "NBA", subtitle: "National Basketball Association" },
    MLB: { emoji: "⚾", title: "MLB", subtitle: "Major League Baseball" },
    UFC: { emoji: "🥊", title: "UFC", subtitle: "Ultimate Fighting Championship" },
    GOLF: { emoji: "⛳", title: "Golf", subtitle: "PGA Tour & Major Championships" }
  };

  const config = sportConfig[sport] || { emoji: "🏆", title: sport, subtitle: "" };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{config.emoji}</span>
          <h1 className="text-3xl font-bold text-white">{config.title}</h1>
        </div>
        {config.subtitle && (
          <p className="text-slate-400 text-sm mb-6 ml-14">{config.subtitle}</p>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="ml-4 text-white">Loading {sport} games...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-white">
            <p>⚠️ {error}</p>
          </div>
        ) : games.length > 0 ? (
          <div className="grid gap-6">
            {games.map((game, idx) => {
              const analysisKey = `${game.id}_game`;
              const gameAnalysis = analysisResults[analysisKey];
              
              return (
                <GameCard 
                  key={game.id || idx} 
                  game={game} 
                  sport={sport}
                  onAnalyze={handleAnalyzeGame}
                  analysisData={gameAnalysis?.data}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
            <span className="text-6xl mb-4 block">{config.emoji}</span>
            <p className="text-cyan-400 text-lg font-semibold">No {sport} games available</p>
            <p className="text-slate-400 text-sm mt-2">Check back later for upcoming games</p>
          </div>
        )}
      </div>
    </div>
  );
}