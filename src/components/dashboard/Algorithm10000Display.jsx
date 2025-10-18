import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Target, 
  TrendingUp, 
  DollarSign,
  Activity,
  BarChart3
} from "lucide-react";

export default function Algorithm10000Display({ algorithmData, games, playerProps, teamProps }) {
  const totalBetsAnalyzed = Object.keys(algorithmData).length;
  const betRecommendations = Object.values(algorithmData).filter(data => data.recommendation === 'BET').length;
  const leanRecommendations = Object.values(algorithmData).filter(data => data.recommendation === 'LEAN').length;
  const passRecommendations = Object.values(algorithmData).filter(data => data.recommendation === 'PASS').length;

  const averageWinRate = totalBetsAnalyzed > 0 
    ? (Object.values(algorithmData).reduce((acc, data) => acc + parseFloat(data.winRate), 0) / totalBetsAnalyzed).toFixed(1)
    : 0;

  const averageEdge = totalBetsAnalyzed > 0
    ? (Object.values(algorithmData).reduce((acc, data) => acc + parseFloat(data.edge), 0) / totalBetsAnalyzed).toFixed(1)
    : 0;

  return (
    <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-purple-400" />
          Algorithm 10000 - Master Analysis Dashboard
        </CardTitle>
        <p className="text-purple-100">Real-time computational analysis of every available bet</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Algorithm Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">10,000</div>
            <div className="text-white/70 text-sm">Iterations per bet</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{totalBetsAnalyzed}</div>
            <div className="text-white/70 text-sm">Bets Analyzed</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{averageWinRate}%</div>
            <div className="text-white/70 text-sm">Avg Win Rate</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">+{averageEdge}%</div>
            <div className="text-white/70 text-sm">Avg Edge</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{betRecommendations}</div>
            <div className="text-white/70 text-sm">Strong Bets</div>
          </div>
        </div>

        {/* Recommendation Breakdown */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Strong Bets</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{betRecommendations}</div>
            <p className="text-green-200 text-sm">High confidence recommendations</p>
            <Progress value={(betRecommendations / totalBetsAnalyzed) * 100} className="mt-3 h-2" />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Lean Bets</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{leanRecommendations}</div>
            <p className="text-yellow-200 text-sm">Moderate confidence plays</p>
            <Progress value={(leanRecommendations / totalBetsAnalyzed) * 100} className="mt-3 h-2" />
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold">Pass Bets</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{passRecommendations}</div>
            <p className="text-red-200 text-sm">Low confidence, avoid</p>
            <Progress value={(passRecommendations / totalBetsAnalyzed) * 100} className="mt-3 h-2" />
          </div>
        </div>

        {/* Top Algorithm Picks */}
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Top Algorithm Picks (Highest Edge)
          </h4>
          <div className="space-y-3">
            {Object.entries(algorithmData)
              .filter(([_, data]) => data.recommendation === 'BET')
              .sort((a, b) => parseFloat(b[1].edge) - parseFloat(a[1].edge))
              .slice(0, 5)
              .map(([key, data], index) => (
                <div key={key} className="bg-white/10 rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium">Bet #{index + 1}</span>
                      <div className="flex gap-2 mt-1">
                        <Badge className="bg-green-500/20 text-green-400">{data.recommendation}</Badge>
                        <Badge variant="outline" className="text-white/70">
                          {key.includes('game') ? 'Game' : key.includes('player') ? 'Player Prop' : 'Team Prop'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">+{data.edge}% Edge</div>
                      <div className="text-white text-sm">{data.winRate}% Win Rate</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}