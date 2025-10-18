import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Target, TrendingUp, Plus, Crown } from "lucide-react";

export default function AlgorithmRankings({ playerProps, teamProps, sport, onAddToParlay }) {
  const formatOdds = (odds) => {
    if (!odds) return 'N/A';
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  // Combine and rank all props by algorithm confidence
  const getAllProps = () => {
    const allProps = [
      ...playerProps.map(prop => ({ ...prop, type: 'player' })),
      ...teamProps.map(prop => ({ ...prop, type: 'team' }))
    ];
    
    return allProps
      .filter(prop => prop.algorithm_confidence && prop.algorithm_confidence > 0)
      .sort((a, b) => (b.algorithm_confidence || 0) - (a.algorithm_confidence || 0))
      .slice(0, 20); // Top 20 props
  };

  const getRecommendation = (prop) => {
    if (prop.sharp_action === 'over') return { selection: 'OVER', color: 'text-green-400' };
    if (prop.sharp_action === 'under') return { selection: 'UNDER', color: 'text-red-400' };
    return { selection: 'NEUTRAL', color: 'text-slate-400' };
  };

  const getBestOdds = (prop, side) => {
    const overOdds = [prop.fd_over_odds, prop.dk_over_odds, prop.mgm_over_odds].filter(Boolean);
    const underOdds = [prop.fd_under_odds, prop.dk_under_odds, prop.mgm_under_odds].filter(Boolean);
    
    if (side === 'over') {
      return overOdds.length > 0 ? Math.max(...overOdds) : null;
    } else {
      return underOdds.length > 0 ? Math.max(...underOdds) : null;
    }
  };

  const topProps = getAllProps();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            Algorithm Top Picks - {sport}
          </CardTitle>
          <p className="text-slate-400">Props ranked by AI confidence and edge analysis</p>
        </CardHeader>
      </Card>

      {/* Top Tier Props */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Highest Confidence Props</h3>
          <Badge className="bg-yellow-500/20 text-yellow-400">80%+ Confidence</Badge>
        </div>
        
        <div className="grid gap-4">
          {topProps.filter(prop => prop.algorithm_confidence >= 80).map((prop, index) => {
            const recommendation = getRecommendation(prop);
            const recommendedSide = recommendation.selection === 'OVER' ? 'over' : 'under';
            const bestOdds = getBestOdds(prop, recommendedSide);
            
            return (
              <Card key={prop.id} className="bg-gradient-to-r from-yellow-900/10 to-orange-900/10 border-yellow-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">
                          {prop.player_name || prop.team}
                        </h4>
                        <p className="text-slate-300 text-sm">
                          {prop.prop_type?.replace(/_/g, ' ')} {recommendation.selection} {prop.prop_line}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className="bg-yellow-500/20 text-yellow-400 mb-1">
                          <Star className="w-3 h-3 mr-1" />
                          {prop.algorithm_confidence}%
                        </Badge>
                        <p className={`text-sm font-medium ${recommendation.color}`}>
                          {recommendation.selection}
                        </p>
                      </div>
                      
                      <Button 
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => onAddToParlay(prop, recommendedSide)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {formatOdds(bestOdds)}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* High Confidence Props */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-green-400" />
          <h3 className="text-xl font-bold text-white">High Confidence Props</h3>
          <Badge className="bg-green-500/20 text-green-400">70-79% Confidence</Badge>
        </div>
        
        <div className="grid gap-3">
          {topProps.filter(prop => prop.algorithm_confidence >= 70 && prop.algorithm_confidence < 80).map((prop, index) => {
            const recommendation = getRecommendation(prop);
            const recommendedSide = recommendation.selection === 'OVER' ? 'over' : 'under';
            const bestOdds = getBestOdds(prop, recommendedSide);
            
            return (
              <Card key={prop.id} className="bg-slate-900 border-slate-800 hover:border-green-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">
                        {prop.player_name || prop.team}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {prop.prop_type?.replace(/_/g, ' ')} {recommendation.selection} {prop.prop_line}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/20 text-green-400">
                        {prop.algorithm_confidence}%
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-green-600 text-green-400 hover:bg-green-600/10"
                        onClick={() => onAddToParlay(prop, recommendedSide)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {formatOdds(bestOdds)}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Moderate Confidence Props */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <h3 className="text-xl font-bold text-white">Moderate Confidence Props</h3>
          <Badge className="bg-orange-500/20 text-orange-400">60-69% Confidence</Badge>
        </div>
        
        <div className="grid gap-3">
          {topProps.filter(prop => prop.algorithm_confidence >= 60 && prop.algorithm_confidence < 70).slice(0, 10).map((prop, index) => {
            const recommendation = getRecommendation(prop);
            const recommendedSide = recommendation.selection === 'OVER' ? 'over' : 'under';
            const bestOdds = getBestOdds(prop, recommendedSide);
            
            return (
              <Card key={prop.id} className="bg-slate-900 border-slate-800">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white text-sm font-medium">
                        {prop.player_name || prop.team}
                      </h4>
                      <p className="text-slate-400 text-xs">
                        {prop.prop_type?.replace(/_/g, ' ')} {recommendation.selection} {prop.prop_line}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                        {prop.algorithm_confidence}%
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs px-2"
                        onClick={() => onAddToParlay(prop, recommendedSide)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {formatOdds(bestOdds)}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}