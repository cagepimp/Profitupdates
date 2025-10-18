import React, { useState, useEffect } from "react";
import { Game, PlayerProp, TeamProp } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, BarChart3, Users, User, Target } from "lucide-react";

import PerformanceSummary from "../components/performance/PerformanceSummary";
import PredictionHistory from "../components/performance/PredictionHistory";
import InsightEffectiveness from "../components/performance/InsightEffectiveness";

// --- SIMULATION & ANALYSIS LOGIC ---

// Simulate grading game predictions
const analyzeGamePredictions = (games) => {
  const graded = games.map(game => {
    // For demo, we create a mock prediction to grade
    const predictionType = ['spread', 'total', 'moneyline'][game.id.charCodeAt(game.id.length - 1) % 3];
    let prediction, outcome;
    
    const actualTotal = game.home_score + game.away_score;
    const actualSpread = game.away_score - game.home_score;

    switch (predictionType) {
      case 'spread':
        prediction = { type: 'Spread', selection: `${game.home_team} ${game.dk_spread}`, odds: -110 };
        outcome = actualSpread < game.dk_spread ? 'win' : 'loss';
        break;
      case 'total':
        prediction = { type: 'Total', selection: `Over ${game.dk_total}`, odds: -110 };
        outcome = actualTotal > game.dk_total ? 'win' : 'loss';
        break;
      case 'moneyline':
        prediction = { type: 'Moneyline', selection: `${game.home_team}`, odds: game.dk_moneyline_home };
        outcome = game.home_score > game.away_score ? 'win' : 'loss';
        break;
      default:
        prediction = { type: 'N/A', selection: 'N/A', odds: 0 };
        outcome = 'push';
    }

    return {
      id: game.id,
      description: `${game.away_team} @ ${game.home_team}`,
      prediction,
      result: `${game.away_score} - ${game.home_score}`,
      outcome
    };
  });

  return graded;
};

// Simulate grading prop predictions
const analyzePropPredictions = (props) => {
  return props.map(prop => {
    // Simulate the actual result for the prop
    const actualValue = prop.prop_line * (0.5 + Math.random()); // Random value around the line
    const recommendedPick = prop.sharp_action || 'over'; // Assume 'over' if no sharp action
    
    let outcome;
    if (recommendedPick === 'over') {
      outcome = actualValue > prop.prop_line ? 'win' : 'loss';
    } else {
      outcome = actualValue < prop.prop_line ? 'win' : 'loss';
    }
    
    return {
      id: prop.id,
      description: `${prop.player_name || prop.team} (${prop.prop_type.replace(/_/g, ' ')})`,
      prediction: { type: 'Prop', selection: `${recommendedPick.toUpperCase()} ${prop.prop_line}`, odds: -115 },
      result: actualValue.toFixed(1),
      outcome
    };
  });
};

export default function Performance() {
  const [gameResults, setGameResults] = useState([]);
  const [playerPropResults, setPlayerPropResults] = useState([]);
  const [teamPropResults, setTeamPropResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAndAnalyze = async () => {
      setIsLoading(true);
      
      const [games, playerProps, teamProps] = await Promise.all([
        Game.filter({ status: 'Final' }),
        PlayerProp.list(),
        TeamProp.list(),
      ]);

      setGameResults(analyzeGamePredictions(games));
      setPlayerPropResults(analyzePropPredictions(playerProps));
      setTeamPropResults(analyzePropPredictions(teamProps));
      
      setIsLoading(false);
    };

    loadAndAnalyze();
  }, []);

  const allResults = [...gameResults, ...playerPropResults, ...teamPropResults];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
              Algorithm Performance
            </h1>
            <p className="text-slate-400 mt-2">Analyzing the algorithm's predictive accuracy and profitability.</p>
          </div>
        </div>

        {/* Performance Summary */}
        <PerformanceSummary results={allResults} isLoading={isLoading} />

        {/* Detailed Breakdown */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-teal-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              All Predictions
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-teal-600">
              <Users className="w-4 h-4 mr-2" />
              Game Predictions
            </TabsTrigger>
            <TabsTrigger value="props" className="data-[state=active]:bg-teal-600">
              <User className="w-4 h-4 mr-2" />
              Player/Team Props
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-teal-600">
              <Target className="w-4 h-4 mr-2" />
              Insight Effectiveness
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <PredictionHistory title="All Prediction History" results={allResults} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="games">
            <PredictionHistory title="Game Prediction History" results={gameResults} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="props">
            <PredictionHistory title="Props Prediction History" results={[...playerPropResults, ...teamPropResults]} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="insights">
            <InsightEffectiveness />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}