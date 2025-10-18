import React, { useEffect, useState } from "react";
import { getSlatesForSport } from "@/api/functions";
import { runAnalyzerPropsV3 } from "@/api/functions";
import { runAnalyzer10000Plus } from "@/api/functions";
import GameCard from "@/components/sports/GameCard";
import { Loader2 } from "lucide-react";

export default function CFBPage() {
  const sport = "CFB";
  const [games, setGames] = useState([]);
  const [debug, setDebug] = useState("");
  const [loading, setLoading] = useState(true);
  const [analysisResults, setAnalysisResults] = useState({});

  useEffect(() => {
    const dateFrom = new Date().toISOString();
    const dateTo = new Date("2025-12-31T23:59:59Z").toISOString();

    let cancelled = false;

    const fetchGames = async () => {
      setLoading(true);
      setDebug(`Fetching ${sport} games...`);
      setGames([]);

      try {
        console.log(`[CFBPage] Fetching games for ${sport}`);

        const res = await getSlatesForSport({ sport, dateFrom, dateTo });
        const data = res?.data || res;

        if (cancelled) return;

        if (data?.success) {
          const gamesList = data.games || [];
          setGames(gamesList);
          setDebug(`✅ Loaded ${gamesList.length} ${sport} game${gamesList.length !== 1 ? 's' : ''}`);

          if (gamesList.length === 0) {
            setDebug(`⚠️ No ${sport} games found for the selected date range`);
          }
        } else {
          setGames([]);
          setDebug(`❌ ${data?.error || data?.message || "Failed to load games"}`);
        }
      } catch (error) {
        if (error.message === 'Request aborted' || cancelled) return;

        setGames([]);
        setDebug(`❌ Error: ${error?.message || String(error)}`);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchGames();

    return () => {
      cancelled = true;
    };
  }, []);

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

  return (
    <main className="flex-1 p-6 bg-blue-950 text-blue-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Today's Slate — {sport}
        </h1>

        <div className="text-sm mb-6 text-blue-400 font-mono bg-blue-900/30 p-3 rounded">
          {debug}
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="inline-block w-12 h-12 animate-spin text-white mb-4" />
            <p className="text-blue-400">Loading {sport} games...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">🏈</div>
            <p className="text-xl text-blue-300 mb-2">No {sport} games found</p>
            <p className="text-sm text-blue-500 mb-4">
              Try running "Refresh Full Slate" from Developer Tools
            </p>
            <a 
              href={`?sport=${sport}&devtools=true`}
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Open Developer Tools
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {games.map((g) => {
              const analysisKey = `${g.id}_game`;
              const gameAnalysis = analysisResults[analysisKey];
              
              return (
                <GameCard 
                  key={g.id || `${g.away_team}@${g.home_team}-${g.commence_time}`} 
                  game={g}
                  sport={sport}
                  onAnalyze={handleAnalyzeGame}
                  analysisData={gameAnalysis?.data}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}