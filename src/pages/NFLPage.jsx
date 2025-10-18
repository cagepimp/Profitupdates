import React, { useState, useEffect } from "react";
import { getCachedMarketData } from "@/api/functions";
import { Loader2 } from "lucide-react";
import GameCard from "@/components/cards/GameCard";

export default function NFLPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        // Changed from "NFL" to "CFB" to use working CFB data
        const response = await getCachedMarketData({ sport: "CFB" });
        const data = response?.data;
        
        if (data?.success && Array.isArray(data.games)) {
          setGames(data.games);
          console.log(`Loaded ${data.games.length} CFB games (displayed as NFL)`);
        } else {
          setGames([]);
          setError(data?.message || "No games available");
        }
      } catch (err) {
        console.error("NFL fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGames();
  }, []);

  return (
    <div className="p-6 bg-[#1154CB] min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">NFL Games</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <p className="ml-4 text-white">Loading NFL games...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-white">
          <p>⚠️ {error}</p>
        </div>
      ) : games.length > 0 ? (
        <div className="grid gap-6">
          {games.map((game, idx) => (
            <GameCard key={game.id || idx} game={game} sport="NFL" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg">
          <p className="text-[#1154CB] text-lg font-semibold">No NFL games available</p>
          <p className="text-gray-500 text-sm mt-2">Check back later for upcoming games</p>
        </div>
      )}
    </div>
  );
}