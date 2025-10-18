import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, Zap } from 'lucide-react';
import { format } from 'date-fns';

const GameCard = ({ game, analysis }) => {
  const getTeamLogo = (teamName) => {
    // In a real app, you'd have a mapping of team names to logo URLs
    return `https://avatar.vercel.sh/${teamName.replace(/\s+/g, '')}.png?size=40`;
  };

  const getRecommendationColor = (rec) => {
    if (rec === 'BET') return 'bg-green-500/20 text-green-300 border-green-400';
    if (rec === 'LEAN') return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
    return 'bg-red-500/20 text-red-300 border-red-400';
  };
  
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/80 transition-colors">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-sky-300 border-sky-400/50">{game.sport}</Badge>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{format(new Date(game.game_date), 'MMM d, h:mm a')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={getTeamLogo(game.away_team)} alt={game.away_team} className="w-6 h-6 rounded-full" />
                <span className="font-semibold text-white">{game.away_team}</span>
              </div>
              <span className="text-slate-500">@</span>
              <div className="flex items-center gap-2">
                <img src={getTeamLogo(game.home_team)} alt={game.home_team} className="w-6 h-6 rounded-full" />
                <span className="font-semibold text-white">{game.home_team}</span>
              </div>
            </div>
          </div>
          {analysis && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-green-300 font-semibold flex items-center justify-end gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{analysis.edge}% Edge
                </p>
                <p className="text-xs text-slate-400">{analysis.winRate}% Win Rate</p>
              </div>
               <Badge className={`text-sm font-bold ${getRecommendationColor(analysis.recommendation)}`}>
                {analysis.recommendation}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="text-slate-400">Spread</p>
            <p className="text-white font-mono">{game.home_team} {game.dk_spread > 0 ? `+${game.dk_spread}`: game.dk_spread}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400">Moneyline</p>
            <p className="text-white font-mono">{game.dk_moneyline_home > 0 ? `+${game.dk_moneyline_home}`: game.dk_moneyline_home}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400">Total</p>
            <p className="text-white font-mono">O/U {game.dk_total}</p>
          </div>
          <Button className="bg-sky-500 hover:bg-sky-600 text-white w-full h-auto sm:h-full">
            View Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;