import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Brain, 
  Target, 
  TrendingUp, 
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Shield
} from "lucide-react";
import AdvancedAlgorithmService from "../services/AdvancedAlgorithmService";

export default function AdvancedAlgorithmDisplay({ games, playerProps, teamProps, sport }) {
  const [analysisResults, setAnalysisResults] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState("comprehensive");

  const runComprehensiveAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const allBets = [
      ...games.map(g => ({ type: 'game', id: g.id, data: g, sport })),
      ...playerProps.map(p => ({ type: 'player_prop', id: p.id, data: p, sport })),
      ...teamProps.map(t => ({ type: 'team_prop', id: t.id, data: t, sport }))
    ];

    const results = {};
    const total = allBets.length;

    for (let i = 0; i < allBets.length; i++) {
      const bet = allBets[i];
      setAnalysisProgress((i / total) * 100);
      
      try {
        const analysis = await AdvancedAlgorithmService.runAdvancedAlgorithm(bet.data, {
          sport: bet.sport,
          market_context: "live_analysis"
        });
        
        results[`${bet.type}_${bet.id}`] = {
          ...analysis,
          bet_info: bet
        };
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error analyzing bet ${bet.type}_${bet.id}:`, error);
      }
    }
    
    setAnalysisResults(results);
    setAnalysisProgress(100);
    setIsAnalyzing(false);
  };

  const getRecommendationIcon = (recommendation) => {
    switch(recommendation?.toUpperCase()) {
      case 'BET': 
      case 'STRONG BUY': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'LEAN':
      case 'BUY': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'PASS':
      case 'AVOID': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const sortedResults = Object.entries(analysisResults)
    .sort(([,a], [,b]) => {
      const aEdge = a.algorithm_analysis?.edge_percentage || 0;
      const bEdge = b.algorithm_analysis?.edge_percentage || 0;
      return bEdge - aEdge;
    });

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-400" />
            Advanced AI Algorithm Engine
          </CardTitle>
          <p className="text-blue-100">Multi-layered AI analysis with 10,000+ scenario processing</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <Button 
              onClick={runComprehensiveAnalysis}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400">
                <Activity className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400">
                <Zap className="w-3 h-3 mr-1" />
                10,000+ Iterations
              </Badge>
            </div>
          </div>

          {isAnalyzing && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Processing AI Analysis...</span>
                <span className="text-white">{analysisProgress.toFixed(0)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {sortedResults.length > 0 && (
        <Tabs defaultValue="top_plays" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="top_plays" className="data-[state=active]:bg-blue-600">
              🎯 Top AI Picks
            </TabsTrigger>
            <TabsTrigger value="detailed" className="data-[state=active]:bg-blue-600">
              📊 Detailed Analysis  
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-blue-600">
              📈 Portfolio View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top_plays" className="space-y-4">
            <div className="grid gap-4">
              {sortedResults.slice(0, 5).map(([key, result]) => (
                <Card key={key} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getRecommendationIcon(result.final_recommendation?.action)}
                          <h4 className="text-white font-semibold">
                            {result.bet_info?.type === 'game' ? 'Game Bet' : 
                             result.bet_info?.type === 'player_prop' ? 'Player Prop' : 'Team Prop'}
                          </h4>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {result.final_recommendation?.action || 'ANALYZING'}
                          </Badge>
                        </div>
                        <p className="text-slate-300">
                          {result.bet_info?.data.away_team && result.bet_info?.data.home_team ? 
                            `${result.bet_info.data.away_team} @ ${result.bet_info.data.home_team}` :
                            result.bet_info?.data.player_name || 
                            result.bet_info?.data.team || 'Market Analysis'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getConfidenceColor(result.algorithm_analysis?.confidence_score)}`}>
                          {result.algorithm_analysis?.confidence_score?.toFixed(1)}%
                        </div>
                        <p className="text-slate-400 text-sm">Confidence</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-green-400 font-bold">
                          +{result.algorithm_analysis?.edge_percentage?.toFixed(1)}%
                        </div>
                        <div className="text-slate-400 text-xs">Edge</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">
                          {result.algorithm_analysis?.win_probability?.toFixed(1)}%
                        </div>
                        <div className="text-slate-400 text-xs">Win Prob</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-bold">
                          {result.algorithm_analysis?.kelly_criterion_percentage?.toFixed(1)}%
                        </div>
                        <div className="text-slate-400 text-xs">Kelly</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-400 font-bold">
                          {result.algorithm_analysis?.expected_value?.toFixed(1)}%
                        </div>
                        <div className="text-slate-400 text-xs">EV</div>
                      </div>
                    </div>

                    {result.final_recommendation?.reasoning && (
                      <div className="bg-slate-800 rounded p-3">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <p className="text-slate-300 text-sm">
                            {result.final_recommendation.reasoning}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            {/* Detailed analysis view */}
            <div className="grid gap-4">
              {sortedResults.map(([key, result]) => (
                <Card key={key} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Statistical Factors */}
                      {result.statistical_factors && (
                        <div>
                          <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-cyan-400" />
                            Statistical Analysis
                          </h5>
                          <div className="space-y-2 text-sm">
                            {Object.entries(result.statistical_factors).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                                <span className="text-white">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Market Factors */}
                      {result.market_factors && (
                        <div>
                          <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            Market Analysis
                          </h5>
                          <div className="space-y-2 text-sm">
                            {Object.entries(result.market_factors).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                                <span className="text-white">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Advanced Metrics */}
                    {result.advanced_metrics && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-purple-400" />
                          Advanced Metrics
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Value Score:</span>
                            <div className="text-white font-medium">{result.advanced_metrics.value_score?.toFixed(2)}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Volatility:</span>
                            <div className="text-white font-medium">{result.advanced_metrics.volatility_index?.toFixed(2)}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Risk Level:</span>
                            <div className="text-white font-medium">{result.algorithm_analysis?.risk_level}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Contrarian:</span>
                            <div className="text-white font-medium">{result.advanced_metrics.contrarian_indicator}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            {/* Portfolio optimization view */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  AI Portfolio Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {sortedResults.filter(([,r]) => r.final_recommendation?.action === 'BET').length}
                    </div>
                    <div className="text-slate-400">Strong Bets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {sortedResults.filter(([,r]) => r.final_recommendation?.action === 'LEAN').length}
                    </div>
                    <div className="text-slate-400">Lean Plays</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {(sortedResults.reduce((acc, [,r]) => acc + (r.algorithm_analysis?.edge_percentage || 0), 0) / sortedResults.length).toFixed(1)}%
                    </div>
                    <div className="text-slate-400">Avg Edge</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}