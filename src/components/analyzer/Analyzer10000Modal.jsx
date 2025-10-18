import React from 'react';
import { X, TrendingUp, Target, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Analyzer10000Modal({ analysis, onClose }) {
  if (!analysis) return null;
  
  const { home, away, startTime, topProps, sport } = analysis;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-5xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 rounded-t-lg flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Analyzer 10000+</h2>
            </div>
            <h3 className="text-xl mb-2">{away} @ {home}</h3>
            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white">{sport}</Badge>
              <span className="text-sm opacity-90">
                {startTime ? new Date(startTime).toLocaleString() : 'Time TBD'}
              </span>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20">
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Top Props */}
          {topProps && topProps.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-600">
                  <Target className="w-5 h-5" />
                  Top Value Props (Sorted by EV & Edge)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProps.map((prop, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="w-4 h-4 text-cyan-600" />
                          <p className="font-semibold text-gray-900">{prop.entity}</p>
                        </div>
                        <p className="text-sm text-gray-600">{prop.prop}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Best Book: <span className="font-semibold text-cyan-600">{prop.bestBook}</span>
                          {' • '}
                          Odds: <span className="font-semibold">{prop.bestAmerican > 0 ? '+' : ''}{prop.bestAmerican}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          prop.trend === 'Strong Value Bet' ? 'bg-green-600' :
                          prop.trend === 'Lean Value' ? 'bg-yellow-500' :
                          prop.trend === 'Market Discrepancy' ? 'bg-orange-500' : 'bg-gray-400'
                        }>
                          {prop.trend}
                        </Badge>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            <span className="text-gray-600">EV:</span>{' '}
                            <span className={`font-bold ${prop.evPercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {prop.evPercent}%
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-600">Edge:</span>{' '}
                            <span className="font-bold text-cyan-600">{prop.edgePercent}%</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Confidence: {prop.confidence} books
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-semibold">No props available for analysis</p>
                <p className="text-sm text-gray-500 mt-2">
                  This game may not have team/player props yet, or odds haven't been aggregated.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card className="bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700">How to Read This Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 space-y-2">
              <p><strong className="text-cyan-600">EV (Expected Value):</strong> The mathematical edge you have on this bet. Higher is better.</p>
              <p><strong className="text-cyan-600">Edge:</strong> The difference between consensus probability and best available odds.</p>
              <p><strong className="text-cyan-600">Confidence:</strong> Number of sportsbooks offering this prop (more books = more reliable consensus).</p>
              <p><strong className="text-cyan-600">Trend:</strong> AI-predicted betting recommendation based on multi-book analysis.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}