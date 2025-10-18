import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const INSIGHTS = [
  {
    insight: "Fading the public on primetime games",
    effectiveness: 92,
    roi: 28.5,
    description: "Betting against heavy public favorites has yielded significant returns, especially on totals.",
    tags: ["Contrarian", "Market Psychology"]
  },
  {
    insight: "Targeting 2nd half spreads after large first half leads",
    effectiveness: 85,
    roi: 19.2,
    description: "Regression to the mean is a strong factor; teams with large leads often play conservatively.",
    tags: ["Live Betting", "Statistical Regression"]
  },
  {
    insight: "Player prop 'overs' on players returning from injury",
    effectiveness: 68,
    roi: -5.6,
    description: "Markets tend to over-correct lines for returning stars. Performance is often below expectations initially.",
    tags: ["Player Props", "Injury Impact"]
  },
  {
    insight: "Prioritizing defensive efficiency matchups over offensive stats",
    effectiveness: 89,
    roi: 22.1,
    description: "Strong defensive metrics have proven to be a more reliable predictor of success than offensive firepower.",
    tags: ["Team Matchups", "Advanced Metrics"]
  }
];

export default function InsightEffectiveness() {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Insight Effectiveness Analysis
        </CardTitle>
        <p className="text-slate-400">Evaluating the performance of the algorithm's core strategies.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {INSIGHTS.map((item, index) => (
          <div key={index} className="bg-slate-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-white font-semibold text-lg">{item.insight}</h4>
                <div className="flex gap-2 mt-2">
                  {item.tags.map(tag => <Badge key={tag} variant="outline" className="text-cyan-400 border-cyan-400/50">{tag}</Badge>)}
                </div>
              </div>
              <Badge className={item.roi > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {item.roi > 0 ? '+' : ''}{item.roi}% ROI
              </Badge>
            </div>
            <p className="text-slate-300 mb-4">{item.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Effectiveness Score</span>
                <span className="text-white font-medium">{item.effectiveness}%</span>
              </div>
              <Progress value={item.effectiveness} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}