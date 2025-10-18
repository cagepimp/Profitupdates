import React from 'react';
import { X, TrendingUp, Users, Target, AlertTriangle, Brain, DollarSign, ThumbsUp, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AnalysisModal({ isOpen, onClose, analysis, gameInfo }) {
  if (!analysis || !analysis.data) return null;

  const data = analysis.data;
  const { prediction, edge_summary, key_trends, key_players, recommended_bets, sharp_indicators, weather_impact, injuries, contrarian_opportunity, trap_game_warning } = data;

  // Helper to format confidence as color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  // Helper to format units as size
  const getUnitsSize = (units) => {
    if (units >= 2.5) return 'bg-green-600';
    if (units >= 1.5) return 'bg-yellow-600';
    return 'bg-blue-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Analyzer 10000+ Results
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            {gameInfo?.away} @ {gameInfo?.home}
          </p>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            
            {/* Edge Summary */}
            {edge_summary && (
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-purple-300 mb-1">The Edge</h3>
                    <p className="text-gray-200">{edge_summary}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Warnings */}
            {(contrarian_opportunity || trap_game_warning) && (
              <div className="flex gap-3">
                {contrarian_opportunity && (
                  <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-500/50">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    Contrarian Opportunity
                  </Badge>
                )}
                {trap_game_warning && (
                  <Badge className="bg-red-600/20 text-red-300 border-red-500/50">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Trap Game Warning
                  </Badge>
                )}
              </div>
            )}

            {/* Prediction */}
            {prediction && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Predictions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Winner</div>
                    <div className="text-lg font-bold text-white">{prediction.winner}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Spread Pick</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{prediction.spread_pick}</span>
                      <span className={`text-sm font-semibold ${getConfidenceColor(prediction.spread_confidence)}`}>
                        ({prediction.spread_confidence}%)
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Total Pick</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{prediction.total_pick}</span>
                      <span className={`text-sm font-semibold ${getConfidenceColor(prediction.total_confidence)}`}>
                        ({prediction.total_confidence}%)
                      </span>
                    </div>
                  </div>
                  {prediction.moneyline_value && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1">ML Value</div>
                      <div className="text-lg font-bold text-green-400">{prediction.moneyline_value}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommended Bets */}
            {recommended_bets && recommended_bets.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Recommended Bets
                </h3>
                <div className="space-y-3">
                  {recommended_bets.map((bet, idx) => (
                    <div key={idx} className="bg-gray-900/50 rounded-lg p-3 border border-gray-600">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-bold text-white text-lg">{bet.bet}</div>
                          {bet.book && (
                            <div className="text-xs text-gray-400 mt-1">Best at: {bet.book}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getUnitsSize(bet.units)} text-white`}>
                            {bet.units}U
                          </Badge>
                          <Badge className={`${getConfidenceColor(bet.confidence)} bg-gray-800 border border-current`}>
                            {bet.confidence}%
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{bet.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Trends */}
            {key_trends && key_trends.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Key Betting Trends
                </h3>
                <ul className="space-y-2">
                  {key_trends.map((trend, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span className="text-gray-200">{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Players */}
            {key_players && key_players.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  Key Players
                </h3>
                <div className="space-y-3">
                  {key_players.map((player, idx) => (
                    <div key={idx} className="bg-gray-900/50 rounded p-3">
                      <div className="font-bold text-white mb-1">{player.name}</div>
                      <div className="text-sm text-gray-300">{player.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sharp Indicators */}
            {sharp_indicators && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  Sharp vs Public
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Sharp Money</div>
                    <div className="text-white font-semibold">{sharp_indicators.sharp_side || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Public Money</div>
                    <div className="text-white font-semibold">{sharp_indicators.public_side || 'N/A'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-400 mb-1">Line Movement</div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      {sharp_indicators.line_movement || 'N/A'}
                      {sharp_indicators.reverse_line_movement && (
                        <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-500/50 text-xs">
                          RLM
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Weather Impact */}
            {weather_impact && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-400" />
                  Weather Impact
                </h3>
                <p className="text-gray-200">{weather_impact}</p>
              </div>
            )}

            {/* Injuries */}
            {injuries && injuries.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Injury Report
                </h3>
                <div className="space-y-2">
                  {injuries.map((injury, idx) => (
                    <div key={idx} className="flex items-start justify-between bg-gray-900/50 rounded p-2">
                      <div>
                        <div className="font-semibold text-white">{injury.player}</div>
                        <div className="text-xs text-gray-400">{injury.status}</div>
                      </div>
                      <div className="text-sm text-gray-300 text-right max-w-xs">
                        {injury.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}