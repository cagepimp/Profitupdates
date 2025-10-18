import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LiveOddsTable({ games, sport }) {
  if (!games || games.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Live Odds</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center py-8">No games available</p>
        </CardContent>
      </Card>
    );
  }

  const formatOdds = (odds) => {
    if (odds === null || odds === undefined || odds === "-") return "-";
    if (typeof odds === "number") {
      return odds > 0 ? `+${odds}` : String(odds);
    }
    return String(odds);
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Live {sport} Odds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-white">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4">Game</th>
                <th className="text-center py-3 px-4">DraftKings ML</th>
                <th className="text-center py-3 px-4">FanDuel ML</th>
                <th className="text-center py-3 px-4">Spread</th>
                <th className="text-center py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, idx) => {
                const ml_dk = game.markets?.moneyline?.DraftKings || {};
                const ml_fd = game.markets?.moneyline?.FanDuel || {};
                const spread_dk = game.markets?.spread?.DraftKings || {};
                const total_dk = game.markets?.total?.DraftKings;

                return (
                  <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800">
                    <td className="py-3 px-4">
                      <div className="font-semibold">{game.away || game.away_team}</div>
                      <div className="text-slate-400">@ {game.home || game.home_team}</div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div>{formatOdds(ml_dk.away)}</div>
                      <div className="text-slate-400">{formatOdds(ml_dk.home)}</div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div>{formatOdds(ml_fd.away)}</div>
                      <div className="text-slate-400">{formatOdds(ml_fd.home)}</div>
                    </td>
                    <td className="text-center py-3 px-4 text-xs">
                      <div>{spread_dk.away || "-"}</div>
                      <div className="text-slate-400">{spread_dk.home || "-"}</div>
                    </td>
                    <td className="text-center py-3 px-4 text-xs">
                      {typeof total_dk === "string" ? total_dk : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}