import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign,
  User,
  Users,
  Zap,
  Activity
} from "lucide-react";

export default function RealTimeAnalytics({ games, playerProps, teamProps, algorithmData, sport }) {
  const getRecommendationColor = (recommendation) => {
    switch(recommendation) {
      case 'BET': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'LEAN': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'PASS': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Moneylines */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Live Moneylines - Real-Time Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {games.slice(0, 3).map((game) => (
            <div key={game.id} className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-white font-medium">{game.away_team} @ {game.home_team}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-white/70">Moneyline</Badge>
                    <Badge className="bg-red-500/20 text-red-400">LIVE</Badge>
                  </div>
                </div>
                {algorithmData[`game_${game.id}`] && (
                  <div className="text-right">
                    <Badge className={getRecommendationColor(algorithmData[`game_${game.id}`].recommendation)}>
                      {algorithmData[`game_${game.id}`].recommendation}
                    </Badge>
                    <p className="text-white/70 text-sm mt-1">
                      {algorithmData[`game_${game.id}`].winRate}% Win Rate
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-600/20 rounded-lg p-3 text-center">
                  <p className="text-blue-100 text-sm">FanDuel</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button className="bg-white/20 hover:bg-white/30 text-white text-xs h-8">
                      {game.away_team}: {game.fd_moneyline_away > 0 ? '+' : ''}{game.fd_moneyline_away}
                    </Button>
                    <Button className="bg-white/20 hover:bg-white/30 text-white text-xs h-8">
                      {game.home_team}: {game.fd_moneyline_home > 0 ? '+' : ''}{game.fd_moneyline_home}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-800/40 rounded-lg p-3 text-center">
                  <p className="text-gray-200 text-sm">DraftKings</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button className="bg-white/10 hover:bg-white/20 text-white text-xs h-8">
                      {game.away_team}: {game.dk_moneyline_away > 0 ? '+' : ''}{game.dk_moneyline_away}
                    </Button>
                    <Button className="bg-white/10 hover:bg-white/20 text-white text-xs h-8">
                      {game.home_team}: {game.dk_moneyline_home > 0 ? '+' : ''}{game.dk_moneyline_home}
                    </Button>
                  </div>
                </div>
              </div>

              {algorithmData[`game_${game.id}`] && (
                <div className="mt-3 bg-purple-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 text-sm font-medium">Algorithm 10000 Analysis</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-xs text-white">
                    <div>
                      <span className="text-purple-200">Iterations:</span>
                      <p className="font-bold">10,000</p>
                    </div>
                    <div>
                      <span className="text-purple-200">Win Rate:</span>
                      <p className="font-bold">{algorithmData[`game_${game.id}`].winRate}%</p>
                    </div>
                    <div>
                      <span className="text-purple-200">Edge:</span>
                      <p className="font-bold text-green-400">+{algorithmData[`game_${game.id}`].edge}%</p>
                    </div>
                    <div>
                      <span className="text-purple-200">Kelly:</span>
                      <p className="font-bold">{algorithmData[`game_${game.id}`].kelly_criterion}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Live Over/Under */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Over/Under Totals - Live Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {games.slice(0, 3).map((game) => (
            <div key={`total_${game.id}`} className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-white font-medium">{game.away_team} @ {game.home_team}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-white/70">Total Points</Badge>
                    <Badge className="bg-red-500/20 text-red-400">LIVE</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">O/U {game.fd_total}</p>
                  <p className="text-white/70 text-sm">Current Line</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-600/20 rounded-lg p-3">
                  <p className="text-green-100 text-sm mb-2">Over {game.fd_total}</p>
                  <div className="space-y-2">
                    <Button className="bg-green-500/30 hover:bg-green-500/40 text-white text-xs w-full">
                      FD: -110
                    </Button>
                    <Button className="bg-green-500/20 hover:bg-green-500/30 text-white text-xs w-full">
                      DK: -105
                    </Button>
                  </div>
                </div>
                
                <div className="bg-red-600/20 rounded-lg p-3">
                  <p className="text-red-100 text-sm mb-2">Under {game.fd_total}</p>
                  <div className="space-y-2">
                    <Button className="bg-red-500/30 hover:bg-red-500/40 text-white text-xs w-full">
                      FD: -110
                    </Button>
                    <Button className="bg-red-500/20 hover:bg-red-500/30 text-white text-xs w-full">
                      DK: -115
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Live Player Props */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Player Props - Algorithm Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {playerProps.slice(0, 4).map((prop) => (
            <div key={prop.id} className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-white font-medium">{prop.player_name}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-blue-500/20 text-blue-400">{prop.team}</Badge>
                    <Badge variant="outline" className="text-white/70">{prop.prop_type}</Badge>
                    <Badge className="bg-red-500/20 text-red-400">LIVE</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">{prop.prop_line}</p>
                  <p className="text-white/70 text-sm">Line</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <Button className="bg-green-500/20 hover:bg-green-500/30 text-white border border-green-500/50">
                  Over {prop.prop_line} ({prop.fd_over_odds > 0 ? '+' : ''}{prop.fd_over_odds})
                </Button>
                <Button className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50">
                  Under {prop.prop_line} ({prop.fd_under_odds > 0 ? '+' : ''}{prop.fd_under_odds})
                </Button>
              </div>

              {algorithmData[`player_prop_${prop.id}`] && (
                <div className="bg-cyan-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 text-sm font-medium">10,000 Iteration Analysis</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-white">
                    <div>
                      <span className="text-cyan-200">Win Rate:</span>
                      <p className="font-bold">{algorithmData[`player_prop_${prop.id}`].winRate}%</p>
                    </div>
                    <div>
                      <span className="text-cyan-200">Edge:</span>
                      <p className="font-bold text-green-400">+{algorithmData[`player_prop_${prop.id}`].edge}%</p>
                    </div>
                    <div>
                      <span className="text-cyan-200">Recommend:</span>
                      <p className="font-bold">{algorithmData[`player_prop_${prop.id}`].recommendation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Team Props */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            Team Props - Live Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamProps.slice(0, 3).map((prop) => (
            <div key={prop.id} className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-white font-medium">{prop.team}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-orange-500/20 text-orange-400">{prop.prop_type}</Badge>
                    <Badge className="bg-red-500/20 text-red-400">LIVE</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">{prop.prop_line}</p>
                  <p className="text-white/70 text-sm">Line</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button className="bg-green-500/20 hover:bg-green-500/30 text-white border border-green-500/50">
                  Over {prop.prop_line} ({prop.fd_over_odds > 0 ? '+' : ''}{prop.fd_over_odds})
                </Button>
                <Button className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50">
                  Under {prop.prop_line} ({prop.fd_under_odds > 0 ? '+' : ''}{prop.fd_under_odds})
                </Button>
              </div>

              {algorithmData[`team_prop_${prop.id}`] && (
                <div className="mt-3 bg-orange-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-300 text-sm font-medium">Algorithm 10000</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-white">
                    <div>
                      <span className="text-orange-200">Confidence:</span>
                      <p className="font-bold">{algorithmData[`team_prop_${prop.id}`].confidence}%</p>
                    </div>
                    <div>
                      <span className="text-orange-200">Edge:</span>
                      <p className="font-bold text-green-400">+{algorithmData[`team_prop_${prop.id}`].edge}%</p>
                    </div>
                    <div>
                      <span className="text-orange-200">Action:</span>
                      <p className="font-bold">{algorithmData[`team_prop_${prop.id}`].recommendation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}