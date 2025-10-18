import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Plus, User, Users } from "lucide-react";

export default function PropCard({ prop, type, onAddToParlay }) {
  const formatOdds = (odds) => {
    if (!odds) return 'N/A';
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getBestOverOdds = () => {
    const odds = [
      { book: 'FD', value: prop.fd_over_odds },
      { book: 'DK', value: prop.dk_over_odds },
      { book: 'MGM', value: prop.mgm_over_odds }
    ].filter(o => o.value).sort((a, b) => b.value - a.value);
    
    return odds[0] || { book: 'N/A', value: null };
  };

  const getBestUnderOdds = () => {
    const odds = [
      { book: 'FD', value: prop.fd_under_odds },
      { book: 'DK', value: prop.dk_under_odds },
      { book: 'MGM', value: prop.mgm_under_odds }
    ].filter(o => o.value).sort((a, b) => b.value - a.value);
    
    return odds[0] || { book: 'N/A', value: null };
  };

  const bestOver = getBestOverOdds();
  const bestUnder = getBestUnderOdds();

  const handleAddToParlay = (selection) => {
    console.log(`Adding ${prop.player_name || prop.team} ${selection} to parlay`);
    if (onAddToParlay && typeof onAddToParlay === 'function') {
      onAddToParlay(prop, selection);
    } else {
      console.error('onAddToParlay is not a function:', onAddToParlay);
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800 hover:bg-slate-800/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {type === 'player' ? (
                <User className="w-4 h-4 text-blue-400" />
              ) : (
                <Users className="w-4 h-4 text-purple-400" />
              )}
              <Badge variant="outline" className="text-slate-400">
                {prop.sport || prop.team}
              </Badge>
              {prop.algorithm_confidence && (
                <Badge className="bg-green-500/20 text-green-400">
                  <Star className="w-3 h-3 mr-1" />
                  {prop.algorithm_confidence}%
                </Badge>
              )}
            </div>
            
            <div>
              <h3 className="text-white font-semibold text-lg">
                {type === 'player' ? prop.player_name : prop.team}
              </h3>
              <p className="text-slate-400 text-sm">
                {prop.prop_type?.replace(/_/g, ' ')} • Line: {prop.prop_line}
              </p>
              {prop.historical_hit_rate && (
                <p className="text-slate-500 text-xs mt-1">
                  Historical: {prop.historical_hit_rate}% hit rate
                </p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            {prop.injury_status && prop.injury_status !== 'healthy' && (
              <Badge className="bg-red-500/20 text-red-400 mb-2">
                {prop.injury_status}
              </Badge>
            )}
            {prop.sharp_action && prop.sharp_action !== 'neutral' && (
              <Badge className="bg-yellow-500/20 text-yellow-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                Sharp: {prop.sharp_action}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Odds Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-slate-400 text-sm font-medium">Over {prop.prop_line}</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-sky-400">FD:</span>
                <span className="text-white">{formatOdds(prop.fd_over_odds)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-cyan-400">DK:</span>
                <span className="text-white">{formatOdds(prop.dk_over_odds)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-400">MGM:</span>
                <span className="text-white">{formatOdds(prop.mgm_over_odds)}</span>
              </div>
            </div>
            <Button 
              size="sm" 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleAddToParlay('over')}
            >
              <Plus className="w-3 h-3 mr-1" />
              Over ({bestOver.book}: {formatOdds(bestOver.value)})
            </Button>
          </div>
          
          <div className="space-y-2">
            <p className="text-slate-400 text-sm font-medium">Under {prop.prop_line}</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-sky-400">FD:</span>
                <span className="text-white">{formatOdds(prop.fd_under_odds)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-cyan-400">DK:</span>
                <span className="text-white">{formatOdds(prop.dk_under_odds)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-400">MGM:</span>
                <span className="text-white">{formatOdds(prop.mgm_under_odds)}</span>
              </div>
            </div>
            <Button 
              size="sm" 
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={() => handleAddToParlay('under')}
            >
              <Plus className="w-3 h-3 mr-1" />
              Under ({bestUnder.book}: {formatOdds(bestUnder.value)})
            </Button>
          </div>
        </div>

        {/* Algorithm Insight */}
        {prop.algorithm_confidence && (
          <div className="p-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-white font-medium">Algorithm Insight</span>
              <span className={`text-sm font-bold ${getConfidenceColor(prop.algorithm_confidence)}`}>
                {prop.algorithm_confidence}% confidence
              </span>
            </div>
            <p className="text-slate-300 text-xs">
              Recommendation: {prop.sharp_action === 'over' ? 'OVER' : prop.sharp_action === 'under' ? 'UNDER' : 'NEUTRAL'} based on historical performance and market analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}