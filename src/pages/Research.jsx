import React, { useState, useEffect } from "react";
import { getCachedMarketData } from "@/api/functions";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GameCard from "@/components/cards/GameCard";

export default function ResearchPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get sport from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const sport = urlParams.get('sport') || 'NFL';

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await getCachedMarketData({ sport });
        const data = response?.data;

        if (data?.success && Array.isArray(data.games)) {
          setGames(data.games);
        } else {
          setGames([]);
        }
      } catch (err) {
        console.error("Research fetch error:", err);
        setGames([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sport]);

  // Calculate value opportunities (mock logic - replace with real algorithm)
  const getValueOpportunities = () => {
    return games.slice(0, 3).map(game => {
      const ml = game.markets?.moneyline || {};
      const dkHome = ml.DraftKings?.home || "-";
      const fdHome = ml.FanDuel?.home || "-";
      
      return {
        game: `${game.away} @ ${game.home}`,
        pick: game.home,
        book: "DraftKings",
        odds: dkHome,
        edge: "+2.3%",
        confidence: "High"
      };
    });
  };

  const valueOpportunities = getValueOpportunities();

  return (
    <main className="flex-1 p-6 bg-[#1154CB] text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">{sport} Research Center</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <p className="ml-4 text-white">Loading research data...</p>
        </div>
      ) : (
        <>
          {/* Value Opportunities */}
          <Card className="bg-white border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-[#1154CB]">Top Value Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {valueOpportunities.map((opp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{opp.game}</p>
                      <p className="text-sm text-gray-600">
                        {opp.pick} @ {opp.book} ({opp.odds})
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">{opp.edge}</p>
                        <p className="text-xs text-gray-500">{opp.confidence}</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Games with Research Data */}
          <h2 className="text-xl font-bold mb-4 text-white">All {sport} Games</h2>
          <div className="grid gap-6">
            {games.map((game, idx) => (
              <GameCard key={idx} game={game} sport={sport} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}