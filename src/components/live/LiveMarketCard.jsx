import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Eye, 
  BarChart3,
  Clock,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

export default function LiveMarketCard({ game }) {
  const getMovementIcon = (direction) => {
    switch(direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <ArrowRight className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSharpIndicatorColor = (indicator) => {
    switch(indicator) {
      case 'home': return 'bg-green-500/20 text-green-400';
      case 'away': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'live': return 'bg-red-500/20 text-red-400';
      case 'upcoming': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800 hover:bg-slate-800/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sky-400 border-sky-400">
                {game.sport}
              </Badge>
              <Badge className={getStatusColor(game.status)}>
                {game.status}
              </Badge>
              {game.line_movement_direction !== 'stable' && (
                <Badge className="bg-orange-500/20 text-orange-400">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Movement
                </Badge>
              )}
            </div>
            <CardTitle className="text-white text-lg">
              {game.away_team || game.event_name}
              {game.home_team && (
                <span className="text-slate-400"> vs {game.home_team}</span>
              )}
            </CardTitle>
            {game.game_date && (
              <p className="text-slate-400 text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(game.game_date), "MMM d, h:mm a")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getMovementIcon(game.line_movement_direction)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Odds Comparison */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-1">Moneyline</p>
            <div className="space-y-1">
              <div className="text-sky-400 font-medium">
                DK: {game.dk_moneyline_home > 0 ? '+' : ''}{game.dk_moneyline_home}
              </div>
              <div className="text-cyan-400 font-medium">
                FD: {game.fd_moneyline_home > 0 ? '+' : ''}{game.fd_moneyline_home}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-1">Spread</p>
            <div className="space-y-1">
              <div className="text-sky-400 font-medium">DK: {game.dk_spread}</div>
              <div className="text-cyan-400 font-medium">FD: {game.fd_spread}</div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-1">Total</p>
            <div className="space-y-1">
              <div className="text-sky-400 font-medium">DK: {game.dk_total}</div>
              <div className="text-cyan-400 font-medium">FD: {game.fd_total}</div>
            </div>
          </div>
        </div>

        {/* Public Betting and Sharp Money */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Public Bets</span>
              <span className="text-white font-medium">{game.public_bet_percentage_home}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-sky-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${game.public_bet_percentage_home}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Sharp Money</span>
            <Badge className={getSharpIndicatorColor(game.sharp_money_indicator)}>
              {game.sharp_money_indicator === 'neutral' ? 'No Action' : `On ${game.sharp_money_indicator}`}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300 hover:text-white">
            <Eye className="w-3 h-3 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300 hover:text-white">
            <BarChart3 className="w-3 h-3 mr-2" />
            Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}