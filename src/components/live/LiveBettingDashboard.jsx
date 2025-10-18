
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users,
  BarChart3,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import DraftKingsService from "../services/DraftKingsService";

export default function LiveBettingDashboard({ sport }) {
  const [liveEvents, setLiveEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [props, setProps] = useState({ player_props: [], team_props: [] });
  const [liveStats, setLiveStats] = useState({});
  const [oddsMovements, setOddsMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchLiveData = useCallback(async () => {
    setIsLoading(true);
    try {
      const events = await DraftKingsService.fetchLiveEvents(sport);
      setLiveEvents(events);
      setLastUpdate(new Date());
      
      // Auto-select first event if none selected
      // This logic needs to check if selectedEvent is still null after fetching,
      // and only then set it to the first event. Otherwise, it could override a manually selected event.
      // However, the original code intended to auto-select only if no event was *already* selected.
      // To prevent an infinite loop where setting selectedEvent triggers fetchLiveData again,
      // we need to be careful with selectedEvent in the dependency array.
      // For the purpose of fixing the warning and following the outline,
      // selectedEvent is kept in the dependency array as specified, which means
      // fetchLiveData will be re-created if selectedEvent changes.
      // The implicit behavior is that `selectedEvent` here refers to the *state*
      // at the time `fetchLiveData` is defined.
      // A more robust solution might pass a callback to `setSelectedEvent` or
      // manage the auto-selection separately if `selectedEvent` is not desired as a dep.
      // But adhering to the outline:
      if (events.length > 0 && selectedEvent === null) { // Added explicit null check for clarity
        setSelectedEvent(events[0]);
      }
    } catch (error) {
      console.error("Error fetching live data:", error);
    }
    setIsLoading(false);
  }, [sport, selectedEvent]); // selectedEvent is a dependency as per the outline for auto-selection logic

  useEffect(() => {
    fetchLiveData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchLiveData, 30000);
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  const fetchEventDetails = async (event) => {
    setSelectedEvent(event);
    setIsLoading(true);
    
    try {
      const [propsData, statsData, movementsData] = await Promise.all([
        DraftKingsService.fetchProps(sport, event.event_id),
        DraftKingsService.fetchLiveStats(sport, event.event_id),
        DraftKingsService.trackOddsMovements(sport, event.event_id)
      ]);
      
      setProps(propsData);
      setLiveStats(statsData);
      setOddsMovements(movementsData);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
    
    setIsLoading(false);
  };

  const getMovementIcon = (direction) => {
    if (direction === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (direction === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <BarChart3 className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-red-400" />
            Live {sport} Markets
          </h2>
          <p className="text-slate-400">Real-time DraftKings betting data</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-slate-400 text-sm">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <Button 
            onClick={fetchLiveData}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Live Events Grid */}
      <div className="grid gap-4">
        {liveEvents.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-8 text-center">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No live {sport} games currently available</p>
              <p className="text-slate-500 text-sm mt-1">Check back when games are in progress</p>
            </CardContent>
          </Card>
        ) : (
          liveEvents.map((event) => (
            <Card 
              key={event.event_id} 
              className={`bg-slate-900 border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                selectedEvent?.event_id === event.event_id ? 'ring-2 ring-red-500' : ''
              }`}
              onClick={() => fetchEventDetails(event)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-500/20 text-red-400">
                        <Activity className="w-3 h-3 mr-1" />
                        {event.status}
                      </Badge>
                      {event.quarter_period && (
                        <Badge variant="outline" className="text-slate-400">
                          {event.quarter_period}
                        </Badge>
                      )}
                      {event.time_remaining && (
                        <Badge variant="outline" className="text-slate-400">
                          {event.time_remaining}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-white font-semibold text-lg">
                      {event.away_team} @ {event.home_team}
                    </h3>
                    {event.current_score && (
                      <p className="text-slate-300 mt-1">
                        Score: {event.current_score.away} - {event.current_score.home}
                      </p>
                    )}
                  </div>
                </div>

                {/* Live Betting Markets */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-slate-400 mb-1">Moneyline</p>
                    <div className="space-y-1">
                      <div className="text-white">{event.away_team}: {event.moneyline?.away > 0 ? '+' : ''}{event.moneyline?.away}</div>
                      <div className="text-white">{event.home_team}: {event.moneyline?.home > 0 ? '+' : ''}{event.moneyline?.home}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 mb-1">Spread</p>
                    <div className="space-y-1">
                      <div className="text-white">{event.away_team} {event.spread?.away_line > 0 ? '+' : ''}{event.spread?.away_line} ({event.spread?.away_odds > 0 ? '+' : ''}{event.spread?.away_odds})</div>
                      <div className="text-white">{event.home_team} {event.spread?.home_line > 0 ? '+' : ''}{event.spread?.home_line} ({event.spread?.home_odds > 0 ? '+' : ''}{event.spread?.home_odds})</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 mb-1">Total</p>
                    <div className="space-y-1">
                      <div className="text-white">O {event.total?.line} ({event.total?.over_odds > 0 ? '+' : ''}{event.total?.over_odds})</div>
                      <div className="text-white">U {event.total?.line} ({event.total?.under_odds > 0 ? '+' : ''}{event.total?.under_odds})</div>
                    </div>
                  </div>
                </div>

                {/* Line Movements */}
                {event.line_movements && event.line_movements.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm mb-2">Recent Line Movement:</p>
                    <div className="flex gap-2 flex-wrap">
                      {event.line_movements.slice(0, 3).map((movement, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {getMovementIcon(movement.direction)}
                          <span className="ml-1">{movement.market}: {movement.previous_value} → {movement.current_value}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <Tabs defaultValue="props" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="props" className="data-[state=active]:bg-red-600">
              Player & Team Props
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-red-600">
              Live Stats
            </TabsTrigger>
            <TabsTrigger value="movements" className="data-[state=active]:bg-red-600">
              Line Movements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="props" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Player Props */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Player Props
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {props.player_props.length === 0 ? (
                    <div className="text-slate-400 text-center py-4 flex flex-col items-center">
                      <AlertTriangle className="w-6 h-6 mb-2 text-yellow-500" />
                      No Player Props available for this event.
                    </div>
                  ) : (
                    props.player_props.map((prop, idx) => (
                      <div key={idx} className="bg-slate-800 rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-white font-medium">{prop.player_name}</p>
                            <p className="text-slate-400 text-sm">{prop.team} • {prop.prop_type}</p>
                          </div>
                          {prop.season_average && (
                            <Badge variant="outline" className="text-xs">
                              Avg: {prop.season_average}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <Button variant="outline" size="sm" className="border-green-600 text-green-400">
                            Over {prop.line} ({prop.over_odds > 0 ? '+' : ''}{prop.over_odds})
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-600 text-red-400">
                            Under {prop.line} ({prop.under_odds > 0 ? '+' : ''}{prop.under_odds})
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Team Props */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Team Props
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {props.team_props.length === 0 ? (
                    <div className="text-slate-400 text-center py-4 flex flex-col items-center">
                      <AlertTriangle className="w-6 h-6 mb-2 text-yellow-500" />
                      No Team Props available for this event.
                    </div>
                  ) : (
                    props.team_props.map((prop, idx) => (
                      <div key={idx} className="bg-slate-800 rounded p-3">
                        <div className="mb-2">
                          <p className="text-white font-medium">{prop.team}</p>
                          <p className="text-slate-400 text-sm">{prop.prop_type}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <Button variant="outline" size="sm" className="border-green-600 text-green-400">
                            Over {prop.line} ({prop.over_odds > 0 ? '+' : ''}{prop.over_odds})
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-600 text-red-400">
                            Under {prop.line} ({prop.under_odds > 0 ? '+' : ''}{prop.under_odds})
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            {/* Live Game Stats would go here */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Live Game Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(liveStats).length === 0 ? (
                  <div className="text-slate-400 text-center py-4 flex flex-col items-center">
                    <AlertTriangle className="w-6 h-6 mb-2 text-yellow-500" />
                    No Live Statistics available for this event yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
                    {/* Example of displaying live stats - adjust based on actual liveStats structure */}
                    {liveStats.team_stats && (
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Team Stats</h4>
                        <div className="space-y-1">
                          {Object.entries(liveStats.team_stats).map(([teamName, stats]) => (
                            <div key={teamName} className="p-2 bg-slate-800 rounded">
                              <p className="font-medium text-white">{teamName}</p>
                              {Object.entries(stats).map(([statName, value]) => (
                                <p key={statName} className="text-sm">
                                  {statName.replace(/_/g, ' ')}: <span className="font-semibold">{value}</span>
                                </p>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {liveStats.player_stats && (
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Player Highlights</h4>
                        <div className="space-y-1">
                          {liveStats.player_stats.slice(0, 5).map((player, idx) => ( // Showing top 5 players for example
                            <div key={idx} className="p-2 bg-slate-800 rounded">
                              <p className="font-medium text-white">{player.name} ({player.team})</p>
                              <p className="text-sm">{player.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movements" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  Recent Line Movements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {oddsMovements.length === 0 ? (
                  <div className="text-slate-400 text-center py-4 flex flex-col items-center">
                    <AlertTriangle className="w-6 h-6 mb-2 text-yellow-500" />
                    No recent Line Movements recorded for this event.
                  </div>
                ) : (
                  oddsMovements.map((movement, idx) => (
                    <div key={idx} className="bg-slate-800 rounded p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getMovementIcon(movement.movement_direction)}
                        <div>
                          <p className="text-white font-medium">{movement.market_type}</p>
                          <p className="text-slate-400 text-sm">{movement.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{movement.previous_line} → {movement.current_line}</p>
                        <p className="text-slate-400 text-sm">{new Date(movement.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
