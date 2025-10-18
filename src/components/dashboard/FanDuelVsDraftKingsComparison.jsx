import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react";

export default function FanDuelVsDraftKingsComparison({ games, playerProps, isLoading, sport }) {
  const getBestOdds = (fdOdds, dkOdds) => {
    if (!fdOdds || !dkOdds) return null;
    return fdOdds > dkOdds ? { book: 'FD', odds: fdOdds, better: true } : { book: 'DK', odds: dkOdds, better: true };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(2).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/10 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-white/20 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-white/20 rounded"></div>
                  <div className="h-24 bg-white/20 rounded"></div>
                  <div className="h-24 bg-white/20 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Comparison Stats */}
      <Card className="bg-white/10 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Sportsbook Comparison Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4">
                <div className="text-white font-bold text-2xl">{games.length}</div>
                <div className="text-blue-100 text-sm">FanDuel Games</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4">
                <div className="text-white font-bold text-2xl">{games.length}</div>
                <div className="text-gray-300 text-sm">DraftKings Games</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4">
                <div className="text-white font-bold text-2xl">{playerProps.length}</div>
                <div className="text-purple-100 text-sm">Player Props</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4">
                <div className="text-white font-bold text-2xl">
                  {games.filter(g => g.fd_moneyline_home !== g.dk_moneyline_home).length}
                </div>
                <div className="text-green-100 text-sm">Odds Differences</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Odds Finder */}
      <Card className="bg-white/10 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Best Odds Finder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {games.slice(0, 5).map((game) => {
              const bestHomeML = getBestOdds(game.fd_moneyline_home, game.dk_moneyline_home);
              const bestAwayML = getBestOdds(game.fd_moneyline_away, game.dk_moneyline_away);
              
              return (
                <div key={game.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-semibold">
                      {game.away_team} @ {game.home_team}
                    </h4>
                    <Badge className="bg-yellow-500 text-black font-semibold">
                      Best Odds Available
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Moneyline Best Odds */}
                    <div className="space-y-2">
                      <h5 className="text-white/80 text-sm font-medium">Moneyline</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-white/10 rounded-lg p-2">
                          <span className="text-white text-sm">{game.away_team}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">
                              {bestAwayML?.odds > 0 ? '+' : ''}{bestAwayML?.odds}
                            </span>
                            <Badge className={bestAwayML?.book === 'FD' ? 'bg-blue-600' : 'bg-gray-700'}>
                              {bestAwayML?.book}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center bg-white/10 rounded-lg p-2">
                          <span className="text-white text-sm">{game.home_team}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">
                              {bestHomeML?.odds > 0 ? '+' : ''}{bestHomeML?.odds}
                            </span>
                            <Badge className={bestHomeML?.book === 'FD' ? 'bg-blue-600' : 'bg-gray-700'}>
                              {bestHomeML?.book}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spread Comparison */}
                    <div className="space-y-2">
                      <h5 className="text-white/80 text-sm font-medium">Spread</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 text-center">
                          <div className="text-blue-100 text-xs">FanDuel</div>
                          <div className="text-white font-bold">{game.fd_spread}</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 text-center">
                          <div className="text-gray-300 text-xs">DraftKings</div>
                          <div className="text-white font-bold">{game.dk_spread}</div>
                        </div>
                      </div>
                    </div>

                    {/* Total Comparison */}
                    <div className="space-y-2">
                      <h5 className="text-white/80 text-sm font-medium">Total</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 text-center">
                          <div className="text-blue-100 text-xs">FanDuel</div>
                          <div className="text-white font-bold">{game.fd_total}</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 text-center">
                          <div className="text-gray-300 text-xs">DraftKings</div>
                          <div className="text-white font-bold">{game.dk_total}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Odds Movement Tracker */}
      <Card className="bg-white/10 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Line Movement Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {games.filter(g => g.line_movement_direction !== 'stable').slice(0, 5).map((game) => (
              <div key={game.id} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                <div>
                  <span className="text-white font-medium">{game.away_team} @ {game.home_team}</span>
                  <div className="text-white/70 text-sm">
                    {game.sharp_money_indicator !== 'neutral' && (
                      <span className="text-yellow-400">Sharp money on {game.sharp_money_indicator}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${
                    game.line_movement_direction === 'up' ? 'bg-green-500' : 'bg-red-500'
                  } text-white flex items-center gap-1`}>
                    {game.line_movement_direction === 'up' ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    Line Movement
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}