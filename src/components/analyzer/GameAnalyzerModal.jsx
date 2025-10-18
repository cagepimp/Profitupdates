import React, { useState } from 'react';
import { X, TrendingUp, Target, Users, BarChart3, Award, CloudRain, Wind, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GameAnalyzerModal({ modelAnalysis, llmAnalysis, onClose }) {
  if (!modelAnalysis && !llmAnalysis) return null;
  
  const gameInfo = modelAnalysis?.game_info || {
    matchup: `${llmAnalysis?.away || ''} @ ${llmAnalysis?.home || ''}`,
    sport: llmAnalysis?.sport || 'Unknown'
  };
  
  const gameRating = modelAnalysis?.game_rating || 0;
  const aiConfidence = llmAnalysis?.analysis?.prediction?.confidence || 0;
  
  // Combined confidence (average of both models)
  const combinedConfidence = Math.round((gameRating + aiConfidence) / 2);
  
  // Rating color based on combined confidence
  const ratingColor = combinedConfidence >= 75 ? 'text-green-500' : 
                      combinedConfidence >= 50 ? 'text-yellow-500' : 'text-gray-500';
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-6xl w-full my-8 max-h-[90vh] overflow-y-auto border-2 border-cyan-500 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1154CB] to-cyan-600 text-white p-6 rounded-t-2xl flex justify-between items-start z-10 border-b-2 border-cyan-400">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Target className="w-8 h-8" />
              {gameInfo.matchup}
            </h2>
            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white">{gameInfo.sport}</Badge>
              <span className="text-sm opacity-90">
                {gameInfo.start_time ? new Date(gameInfo.start_time).toLocaleString() : 'Time TBD'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm opacity-75">Combined Confidence</p>
              <p className={`text-4xl font-bold ${ratingColor}`}>{combinedConfidence}%</p>
            </div>
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* AI Prediction & Win Probability */}
          {llmAnalysis?.analysis?.prediction && (
            <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-300">
                  <Target className="w-6 h-6" />
                  AI Prediction & Win Probability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-4 bg-slate-800/60 rounded-lg border border-purple-400">
                    <p className="text-sm text-purple-300 mb-1">Winner</p>
                    <p className="text-xl font-bold text-white">{llmAnalysis.analysis.prediction.winner}</p>
                  </div>
                  
                  {llmAnalysis.analysis.prediction.spread_pick && (
                    <div className="text-center p-4 bg-slate-800/60 rounded-lg border border-purple-400">
                      <p className="text-sm text-purple-300 mb-1">Spread Pick</p>
                      <p className="text-xl font-bold text-white">{llmAnalysis.analysis.prediction.spread_pick}</p>
                    </div>
                  )}
                  
                  {llmAnalysis.analysis.prediction.total_pick && (
                    <div className="text-center p-4 bg-slate-800/60 rounded-lg border border-purple-400">
                      <p className="text-sm text-purple-300 mb-1">Total Pick</p>
                      <p className="text-xl font-bold text-white">{llmAnalysis.analysis.prediction.total_pick}</p>
                    </div>
                  )}
                  
                  <div className="text-center p-4 bg-slate-800/60 rounded-lg border border-yellow-400">
                    <p className="text-sm text-yellow-300 mb-1">AI Confidence</p>
                    <p className="text-3xl font-bold text-yellow-400">{aiConfidence}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weather Section */}
          {modelAnalysis?.weather && (
            <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-300">
                  <CloudRain className="w-6 h-6" />
                  Weather Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="flex items-center gap-2 p-3 bg-slate-800/60 rounded-lg">
                    <Thermometer className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-xs text-gray-400">Temperature</p>
                      <p className="text-lg font-bold text-white">{modelAnalysis.weather.temperature}°F</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-800/60 rounded-lg">
                    <Wind className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-400">Wind Speed</p>
                      <p className="text-lg font-bold text-white">{modelAnalysis.weather.wind_speed} mph</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-800/60 rounded-lg">
                    <CloudRain className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Condition</p>
                      <p className="text-lg font-bold text-white">{modelAnalysis.weather.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-800/60 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400">Impact</p>
                      <p className="text-sm font-bold text-white">{modelAnalysis.weather.impact.impact}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blue-200 italic bg-blue-900/30 p-3 rounded-lg">
                  {modelAnalysis.weather.impact.factors}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Over/Under Model Prediction */}
          {modelAnalysis?.total_prediction && (
            <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-300">
                  <BarChart3 className="w-6 h-6" />
                  Over/Under Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center p-4 bg-slate-800/60 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Line</p>
                    <p className="text-3xl font-bold text-white">{modelAnalysis.total_prediction.line}</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800/60 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Predicted Total</p>
                    <p className="text-3xl font-bold text-cyan-400">{modelAnalysis.total_prediction.predicted_total}</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800/60 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Recommendation</p>
                    <p className={`text-3xl font-bold ${modelAnalysis.total_prediction.recommendation === 'OVER' ? 'text-green-400' : 'text-red-400'}`}>
                      {modelAnalysis.total_prediction.recommendation}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-slate-800/60 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Confidence</p>
                    <p className="text-3xl font-bold text-yellow-400">{modelAnalysis.total_prediction.confidence}%</p>
                  </div>
                </div>
                <p className="text-sm text-green-200 italic bg-green-900/30 p-3 rounded-lg">
                  {modelAnalysis.total_prediction.reasoning}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Team Trends */}
          {llmAnalysis?.analysis?.key_trends && (
            <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-300">
                  <TrendingUp className="w-6 h-6" />
                  Key Betting Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {llmAnalysis.analysis.key_trends.map((trend, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-lg border border-orange-400/30 hover:border-orange-400 transition-colors">
                      <span className="text-orange-400 font-bold text-lg">{idx + 1}.</span>
                      <p className="text-orange-100 text-sm flex-1">{trend}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Players */}
          {llmAnalysis?.analysis?.key_players && (
            <Card className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-300">
                  <Award className="w-6 h-6" />
                  Key Players to Watch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {llmAnalysis.analysis.key_players.map((player, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-lg border border-yellow-400/30">
                      <span className="text-2xl">⭐</span>
                      <p className="text-yellow-100 text-sm flex-1">{player}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Player Props Breakdown */}
          {modelAnalysis?.player_props && modelAnalysis.player_props.length > 0 && (
            <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-300">
                  <Users className="w-6 h-6" />
                  Top Player Props (EV+)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modelAnalysis.player_props.slice(0, 8).map((prop, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/60 rounded-lg border border-indigo-400/30 hover:border-indigo-400 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{prop.player}</p>
                        <p className="text-sm text-indigo-300">{prop.stat} • Line: {prop.line}</p>
                      </div>
                      <div className="text-right ml-4">
                        <Badge className={
                          prop.recommendation === 'OVER' ? 'bg-green-600' : 'bg-red-600'
                        }>
                          {prop.recommendation}
                        </Badge>
                        <p className="text-sm mt-1">
                          <span className="font-bold text-cyan-400">{prop.ev}% EV</span>
                          {' • '}
                          <span className="text-yellow-400">{prop.confidence}% confidence</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommended Bets */}
          {llmAnalysis?.analysis?.recommended_bets && (
            <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-300">
                  💰 Recommended Bets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {llmAnalysis.analysis.recommended_bets.map((bet, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-slate-800/60 rounded-lg border-2 border-cyan-400/30 hover:border-cyan-400 transition-colors">
                      <span className="text-2xl">💎</span>
                      <p className="text-cyan-100 text-sm flex-1">{bet}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sharp Money & Public Fade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {llmAnalysis?.analysis?.sharp_money && (
              <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-300 text-lg">📈 Sharp Money</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100 text-sm">{llmAnalysis.analysis.sharp_money}</p>
                </CardContent>
              </Card>
            )}
            {llmAnalysis?.analysis?.public_fade && (
              <Card className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border-red-500">
                <CardHeader>
                  <CardTitle className="text-red-300 text-lg">🎯 Public Fade Opportunity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-100 text-sm">{llmAnalysis.analysis.public_fade}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Stats */}
          {modelAnalysis?.summary && (
            <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-slate-300">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-gray-400">Props Analyzed</p>
                    <p className="text-2xl font-bold text-white">{modelAnalysis.summary.total_props_analyzed || 0}</p>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-gray-400">+EV Opportunities</p>
                    <p className="text-2xl font-bold text-green-400">{modelAnalysis.summary.positive_ev_opportunities || 0}</p>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-gray-400">Avg Confidence</p>
                    <p className="text-2xl font-bold text-yellow-400">{modelAnalysis.summary.avg_confidence || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-b-2xl border-t-2 border-cyan-500 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <p>Generated: {new Date().toLocaleString()}</p>
            <p className="text-xs">Powered by Analyzer Model v1.0 + Analyzer 10000+ (LLM)</p>
          </div>
          <Button onClick={onClose} className="bg-cyan-600 hover:bg-cyan-700">
            Close Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}