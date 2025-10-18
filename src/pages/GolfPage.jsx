import React, { useState, useEffect } from "react";
import { getCachedMarketData } from "@/api/functions";
import { runAnalyzerPropsV3 } from "@/api/functions";
import { runAnalyzer10000Plus } from "@/api/functions";
import { Loader2 } from "lucide-react";
import GameCard from "@/components/sports/GameCard";

export default function GolfPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});

  useEffect(() => {
    async function fetchTournaments() {
      try {
        setLoading(true);
        const response = await getCachedMarketData({ sport: "GOLF" });
        const data = response?.data;
        
        if (data?.success && Array.isArray(data.games)) {
          setTournaments(data.games);
          console.log(`Loaded ${data.games.length} Golf tournaments`);
        } else {
          setTournaments([]);
          setError(data?.message || "No Golf tournaments available");
        }
      } catch (err) {
        console.error("Golf fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTournaments();
  }, []);

  const handleAnalyzeGame = async (game, analysisType = 'game') => {
    try {
      console.log(`🧠 Analyzing ${analysisType} for Golf tournament:`, game.id);
      const analysisKey = `${game.id}_${analysisType}`;
      setAnalysisResults(prev => ({ ...prev, [analysisKey]: { loading: true } }));
      
      let response;
      
      if (analysisType === 'player_props') {
        response = await runAnalyzerPropsV3({ 
          sport: 'GOLF',
          gameId: game.id,
          analysisType: 'player'
        });
      } else if (analysisType === 'team_props') {
        response = await runAnalyzerPropsV3({ 
          sport: 'GOLF',
          gameId: game.id,
          analysisType: 'team'
        });
      } else {
        response = await runAnalyzer10000Plus({ 
          sport: 'GOLF',
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
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Golf</h1>
        <p className="text-slate-400 text-sm mb-6">
          PGA Tour & Major Championships
        </p>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="ml-4 text-white">Loading Golf tournaments...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-white">
            <p>⚠️ {error}</p>
          </div>
        ) : tournaments.length > 0 ? (
          <div className="grid gap-6">
            {tournaments.map((tournament, idx) => {
              const analysisKey = `${tournament.id}_game`;
              const tournamentAnalysis = analysisResults[analysisKey];
              
              return (
                <GameCard 
                  key={tournament.id || idx} 
                  game={tournament} 
                  sport="GOLF"
                  onAnalyze={handleAnalyzeGame}
                  analysisData={tournamentAnalysis?.data}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
            <p className="text-cyan-400 text-lg font-semibold">No Golf tournaments available</p>
            <p className="text-slate-400 text-sm mt-2">Check back later for upcoming tournaments</p>
          </div>
        )}
      </div>
    </div>
  );
}