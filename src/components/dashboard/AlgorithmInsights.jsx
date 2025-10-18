import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Zap, AlertTriangle } from "lucide-react";

export default function AlgorithmInsights({ selectedSport, games, alerts }) {
  const topPredictions = [
    {
      game: "Cowboys vs Eagles",
      prediction: "Under 47.5",
      confidence: 89,
      edge: "+12.3%",
      reasoning: "Strong defensive matchup, weather conditions"
    },
    {
      game: "Chiefs vs Bills",
      prediction: "Chiefs -3.5",
      confidence: 76,
      edge: "+8.7%",
      reasoning: "Home field advantage, injury report analysis"
    },
    {
      game: "49ers vs Rams",
      prediction: "Over 44.5",
      confidence: 82,
      edge: "+15.1%",
      reasoning: "High-scoring offensive systems, dome environment"
    }
  ];

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-400" />
            Algorithm 10000 Predictions
            <Badge className="bg-sky-500/20 text-sky-400">
              87.3% Accuracy
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topPredictions.map((prediction, index) => (
            <div key={index} className="bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-semibold">{prediction.game}</h4>
                  <p className="text-sky-400 font-medium">{prediction.prediction}</p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getConfidenceColor(prediction.confidence)}`}>
                    {prediction.confidence}%
                  </div>
                  <div className="text-green-400 font-medium">{prediction.edge}</div>
                </div>
              </div>
              <Progress 
                value={prediction.confidence} 
                className="mb-2 h-2"
              />
              <p className="text-slate-400 text-sm">{prediction.reasoning}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">30-Day ROI</span>
              <span className="text-green-400 font-bold">+23.7%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Win Rate</span>
              <span className="text-white font-medium">87.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Sharp Bet Detection</span>
              <span className="text-cyan-400 font-medium">94.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Predictions</span>
              <span className="text-white font-medium">2,847</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.slice(0, 4).map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-800 rounded">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.severity === 'critical' ? 'bg-red-400' :
                  alert.severity === 'high' ? 'bg-orange-400' :
                  alert.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{alert.event_description}</p>
                  <p className="text-slate-400 text-xs mt-1">{alert.recommendation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}