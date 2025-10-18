import React, { useState, useEffect } from "react";
import { getCachedMarketData } from "@/api/functions";
import { Loader2 } from "lucide-react";
import GameCard from "@/components/sports/GameCard";

export default function SlatePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  
  const urlParams = new URLSearchParams(window.location.search);
  const sport = urlParams.get('sport') || 'NFL';

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        console.log(`🔍 Slate: Fetching all games for ${sport} slate...`);
        const response = await getCachedMarketData({}); // Fetch ALL games
        const data = response?.data;

        if (data?.success && Array.isArray(data.games)) {
          // Filter by sport on the frontend
          const sportGames = data.games.filter(g => g.sport === sport);
          setGames(sportGames);
          setStatus(`Showing ${sportGames.length} ${sport} events`);
          console.log(`✅ Slate: Loaded ${sportGames.length} ${sport} games`);
        } else {
          setGames([]);
          setStatus(data?.message || `No data available for ${sport}`);
        }
      } catch (err) {
        console.error("Slate fetch error:", err);
        setGames([]);
        setStatus(`Error loading ${sport}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sport]);

  return (
    <main className="flex-1 p-6 bg-[#1154CB] text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">{sport} Slate</h1>

      <div className="bg-white text-gray-700 text-sm rounded-lg px-4 py-3 mb-6 shadow-md">
        <p className="font-semibold text-[#1154CB]">System Status</p>
        <p className="text-gray-600">{status}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <p className="ml-4 text-white">Loading {sport} games...</p>
        </div>
      ) : games.length > 0 ? (
        <div className="grid gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg">
          <p className="text-[#1154CB] text-lg font-semibold">No {sport} games available</p>
          <p className="text-gray-500 text-sm mt-2">
            The daily automated refresh might not have run, or no games are scheduled.
          </p>
        </div>
      )}
    </main>
  );
}