import React, { useState, useEffect } from "react";
import { getCachedMarketData } from "@/api/functions";
import GameCard from "@/components/cards/GameCard";
import { Loader2 } from "lucide-react";

const SPORT_NAMES = {
  NFL: "NFL Odds",
  CFB: "College Football Odds",
  NBA: "NBA Odds",
  MLB: "MLB Odds",
  UFC: "UFC Odds",
  Golf: "Golf Odds"
};

export default function SportPage({ sport }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGames() {
      try {
        const res = await getCachedMarketData({ sport });
        if (res?.data?.success && Array.isArray(res.data.games)) {
          setGames(res.data.games);
        } else {
          throw new Error(res?.data?.message || `No ${sport} games available`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, [sport]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-white">
        <Loader2 className="animate-spin mr-3" /> Loading {sport} games...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-400 mt-10">
        Error loading {sport} games: {error}
      </div>
    );

  if (games.length === 0)
    return (
      <div className="text-center text-gray-400 mt-10">
        No {sport} games found. Go to Debug Panel and click "Add Sportsbook Odds".
      </div>
    );

  return (
    <div className="p-6 bg-[#1154CB] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">
        {SPORT_NAMES[sport] || `${sport} Odds`}
      </h1>
      <div className="grid gap-4">
        {games.map((game) => (
          <GameCard
            key={game.id || `${game.home}-${game.away}`}
            game={game}
            sport={sport}
          />
        ))}
      </div>
    </div>
  );
}