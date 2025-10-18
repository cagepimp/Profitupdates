import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Calculator, Zap, TrendingUp } from "lucide-react";

export default function ParlayBuilder({ selectedProps, onRemoveFromParlay, onClearAll }) {
  const [betAmount, setBetAmount] = useState(10);

  const formatOdds = (odds) => {
    if (!odds) return 'N/A';
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const convertOddsToDecimal = (americanOdds) => {
    if (americanOdds > 0) {
      return (americanOdds / 100) + 1;
    } else {
      return (100 / Math.abs(americanOdds)) + 1;
    }
  };

  const calculateParlayOdds = () => {
    if (selectedProps.length === 0) return { decimal: 1, american: 0 };
    
    const totalDecimalOdds = selectedProps.reduce((acc, prop) => {
      return acc * convertOddsToDecimal(prop.odds);
    }, 1);
    
    const americanOdds = totalDecimalOdds >= 2 
      ? Math.round((totalDecimalOdds - 1) * 100)
      : Math.round(-100 / (totalDecimalOdds - 1));
    
    return { 
      decimal: totalDecimalOdds, 
      american: americanOdds 
    };
  };

  const calculatePayout = () => {
    const parlayOdds = calculateParlayOdds();
    return (betAmount * parlayOdds.decimal).toFixed(2);
  };

  const calculateProfit = () => {
    return (calculatePayout() - betAmount).toFixed(2);
  };

  const getOverallConfidence = () => {
    if (selectedProps.length === 0) return 0;
    
    const avgConfidence = selectedProps.reduce((acc, prop) => {
      return acc + (prop.prop.algorithm_confidence || 50);
    }, 0) / selectedProps.length;
    
    // Reduce confidence for more legs (parlay tax)
    const parlayTax = Math.max(0, (selectedProps.length - 1) * 5);
    return Math.max(0, Math.round(avgConfidence - parlayTax));
  };

  const parlayOdds = calculateParlayOdds();
  const overallConfidence = getOverallConfidence();

  return (
    <Card className="bg-slate-900 border-slate-800 sticky top-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-green-400" />
          Parlay Builder
          {selectedProps.length > 0 && (
            <Badge className="bg-green-500/20 text-green-400">
              {selectedProps.length} legs
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {selectedProps.length === 0 ? (
          <div className="text-center py-8">
            <Calculator className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No props selected</p>
            <p className="text-slate-500 text-sm mt-1">Add props to build your parlay</p>
          </div>
        ) : (
          <>
            {/* Selected Props */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedProps.map((selected) => (
                <div key={selected.id} className="bg-slate-800 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {selected.prop.player_name || selected.prop.team}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {selected.selection.toUpperCase()} {selected.prop.prop_line} • {selected.prop.prop_type?.replace(/_/g, ' ')}
                    </p>
                    <p className="text-slate-300 text-xs">
                      {formatOdds(selected.odds)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFromParlay(selected.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Parlay Calculation */}
            <div className="space-y-4 pt-4 border-t border-slate-700">
              <div className="space-y-2">
                <label className="text-slate-400 text-sm">Bet Amount ($)</label>
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  min="1"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Parlay Odds:</span>
                  <span className="text-white font-bold">
                    {formatOdds(parlayOdds.american)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Potential Payout:</span>
                  <span className="text-green-400 font-bold">
                    ${calculatePayout()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Profit:</span>
                  <span className="text-green-400 font-bold">
                    ${calculateProfit()}
                  </span>
                </div>
              </div>

              {/* Algorithm Confidence */}
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-3 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">Algorithm Analysis</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Overall Confidence:</span>
                  <Badge className={`${
                    overallConfidence >= 75 ? 'bg-green-500/20 text-green-400' :
                    overallConfidence >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {overallConfidence}%
                  </Badge>
                </div>
                <p className="text-slate-300 text-xs mt-1">
                  {overallConfidence >= 75 
                    ? "Strong parlay with high-confidence props"
                    : overallConfidence >= 60
                    ? "Moderate confidence - consider fewer legs"
                    : "High risk parlay - proceed with caution"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Place Parlay Bet
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-slate-600 text-slate-300"
                  onClick={onClearAll}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}