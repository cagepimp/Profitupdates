import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, TrendingUp, Target, Loader2 } from 'lucide-react';

export default function PredictionAccuracyCard({ game, onVerify }) {
  const [loading, setLoading] = useState(false);
  const [accuracy, setAccuracy] = useState(game.prediction_accuracy);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const result = await onVerify(game.id);
      if (result?.accuracy) {
        setAccuracy(result.accuracy);
      }
    } finally {
      setLoading(false);
    }
  };

  const getAccuracyColor = (percentage) => {
    if (percentage >= 75) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAccuracyBg = (percentage) => {
    if (percentage >= 75) return 'bg-green-900/20 border-green-600';
    if (percentage >= 50) return 'bg-yellow-900/20 border-yellow-600';
    return 'bg-red-900/20 border-red-600';
  };

  if (!accuracy) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 mt-4">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Verify Prediction Accuracy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm mb-4">
            Check how accurate the AI prediction was against the actual game result from ESPN
          </p>
          <Button
            onClick={handleVerify}
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking ESPN...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Verify Prediction
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { overallAccuracy, winner, spread, total, score } = accuracy.accuracy;

  return (
    <Card className="bg-slate-800/50 border-slate-700 mt-4">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Prediction Accuracy Report
          </div>
          <div className={`text-2xl font-bold ${getAccuracyColor(overallAccuracy.percentage)}`}>
            {overallAccuracy.percentage}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Summary */}
        <div className={`p-4 rounded-lg border ${getAccuracyBg(overallAccuracy.percentage)}`}>
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Overall Accuracy</span>
            <span className={`text-xl font-bold ${getAccuracyColor(overallAccuracy.percentage)}`}>
              {overallAccuracy.correctPicks} / {overallAccuracy.totalPicks} Correct
            </span>
          </div>
        </div>

        {/* Actual Result */}
        {accuracy.actualResult && (
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <h3 className="text-white font-semibold mb-2">📊 Actual Result</h3>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">{accuracy.actualResult.awayTeam}</span>
              <span className="text-cyan-400 text-xl font-bold">{accuracy.actualResult.awayScore}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-slate-300">{accuracy.actualResult.homeTeam}</span>
              <span className="text-cyan-400 text-xl font-bold">{accuracy.actualResult.homeScore}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-700">
              <span className="text-slate-400 text-sm">Winner: </span>
              <span className="text-white font-semibold">{accuracy.actualResult.winner}</span>
            </div>
            <div className="mt-1">
              <span className="text-slate-400 text-sm">Total: </span>
              <span className="text-white font-semibold">{accuracy.actualResult.totalScore}</span>
            </div>
          </div>
        )}

        {/* Winner Prediction */}
        {winner && (
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">🏆 Winner Prediction</h3>
              {winner.correct ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Predicted:</span>
                <span className="text-white">{winner.predicted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Actual:</span>
                <span className="text-white">{winner.actual}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confidence:</span>
                <span className="text-cyan-400">{winner.confidence}%</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-700">
                <span className={`font-semibold ${winner.correct ? 'text-green-400' : 'text-red-400'}`}>
                  {winner.correct ? '✅ CORRECT' : '❌ INCORRECT'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Score Prediction */}
        {score && (
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <h3 className="text-white font-semibold mb-2">📊 Score Prediction</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Predicted:</span>
                <span className="text-white">{score.predicted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Actual:</span>
                <span className="text-white">{score.actual}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Predicted:</span>
                <span className="text-white">{score.predictedTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Actual:</span>
                <span className="text-white">{score.actualTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Difference:</span>
                <span className="text-cyan-400">{score.difference} points</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-700">
                <span className="text-white font-semibold">Accuracy: {score.accuracy}</span>
              </div>
            </div>
          </div>
        )}

        {/* Spread Pick */}
        {spread && (
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">📈 Spread Pick</h3>
              {spread.correct ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Predicted:</span>
                <span className="text-white">{spread.predicted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confidence:</span>
                <span className="text-cyan-400">{spread.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Actual Margin:</span>
                <span className="text-white">{spread.margin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Spread Covered:</span>
                <span className="text-white">{spread.covered ? 'Yes' : 'No'}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-700">
                <span className={`font-semibold ${spread.correct ? 'text-green-400' : 'text-red-400'}`}>
                  {spread.correct ? '✅ CORRECT' : '❌ INCORRECT'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Total (Over/Under) */}
        {total && (
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">🎯 Total Pick</h3>
              {total.correct ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Predicted:</span>
                <span className="text-white">{total.predicted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confidence:</span>
                <span className="text-cyan-400">{total.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Line:</span>
                <span className="text-white">{total.line}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Actual Total:</span>
                <span className="text-white">{total.actualTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Difference:</span>
                <span className="text-cyan-400">{total.difference} points</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-700">
                <span className={`font-semibold ${total.correct ? 'text-green-400' : 'text-red-400'}`}>
                  {total.correct ? '✅ CORRECT' : '❌ INCORRECT'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Reverify Button */}
        <Button
          onClick={handleVerify}
          disabled={loading}
          variant="outline"
          className="w-full border-cyan-600 text-cyan-400 hover:bg-cyan-900/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Rechecking...
            </>
          ) : (
            <>
              <Target className="w-4 h-4 mr-2" />
              Reverify Prediction
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}