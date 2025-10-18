import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Tv } from "lucide-react";
import { format } from "date-fns";

export default function SportsSchedule({ sport, games }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400';
      case 'live': return 'bg-red-500/20 text-red-400';
      case 'completed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          {sport} Schedule
        </CardTitle>
        <p className="text-slate-400 text-sm">Upcoming games and events</p>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
        {games.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No scheduled games found for {sport}</p>
            <p className="text-slate-500 text-sm mt-1">The daily automated refresh may not have run yet.</p>
          </div>
        ) : (
          games.map((game) => (
            <div key={game.id} className="bg-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-white font-medium">{game.away_team} @ {game.home_team}</p>
                    <p className="text-slate-400 text-sm">{game.event_name || 'Regular Season'}</p>
                </div>
                <Badge className={getStatusColor(game.status)}>
                  {game.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm pt-2 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3 h-3" />
                  {format(new Date(game.game_date), "MMM d, yyyy, h:mm a")}
                </div>
                {game.venue && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3 h-3" />
                    {game.venue}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}