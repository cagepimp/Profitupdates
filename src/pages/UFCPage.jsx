import React, { useState, useEffect } from "react";
import { getCachedMarketData } from "@/api/functions";
import { runAnalyzerPropsV3 } from "@/api/functions";
import { runAnalyzer10000Plus } from "@/api/functions";
import { Loader2 } from "lucide-react";
import GameCard from "@/components/sports/GameCard";

export default function UFCPage() {
  const [fights, setFights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});

  useEffect(() => {
    async function fetchFights() {
      try {
        setLoading(true);
        const response = await getCachedMarketData({ sport: "UFC" });
        const data = response?.data;
        
        if (data?.success && Array.isArray(data.games)) {
          setFights(data.games);
          console.log(`Loaded ${data.games.length} UFC fights`);
        } else {
          setFights([]);
          setError(data?.message || "No UFC fights available");
        }
      } catch (err) {
        console.error("UFC fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFights();
  }, []);

  const handleAnalyzeGame = async (game, analysisType = 'game') => {
    try {
      console.log(`🧠 Analyzing ${analysisType} for UFC fight:`, game.id);
      const analysisKey = `${game.id}_${analysisType}`;
      setAnalysisResults(prev => ({ ...prev, [analysisKey]: { loading: true } }));
      
      let response;
      
      if (analysisType === 'player_props') {
        response = await runAnalyzerPropsV3({ 
          sport: 'UFC',
          gameId: game.id,
          analysisType: 'player'
        });
      } else if (analysisType === 'team_props') {
        response = await runAnalyzerPropsV3({ 
          sport: 'UFC',
          gameId: game.id,
          analysisType: 'team'
        });
      } else {
        response = await runAnalyzer10000Plus({ 
          sport: 'UFC',
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
        <h1 className="text-3xl font-bold text-white mb-2">UFC</h1>
        <p className="text-slate-400 text-sm mb-6">
          Ultimate Fighting Championship
        </p>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="ml-4 text-white">Loading UFC fights...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-white">
            <p>⚠️ {error}</p>
          </div>
        ) : fights.length > 0 ? (
          <div className="grid gap-6">
            {fights.map((fight, idx) => {
              const analysisKey = `${fight.id}_game`;
              const fightAnalysis = analysisResults[analysisKey];
              
              return (
                <GameCard 
                  key={fight.id || idx} 
                  game={fight} 
                  sport="UFC"
                  onAnalyze={handleAnalyzeGame}
                  analysisData={fightAnalysis?.data}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
            <p className="text-cyan-400 text-lg font-semibold">No UFC fights available</p>
            <p className="text-slate-400 text-sm mt-2">Check back later for upcoming fight cards</p>
          </div>
        )}
      </div>
    </div>
  );
}