import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Zap, 
  RefreshCw, 
  Clock,
  TrendingUp,
  Tv,
  MapPin,
  PlayCircle,
  StopCircle
} from "lucide-react";
import { fetchLiveScoring } from "@/api/functions";

export default function LiveScoringScanner() {
  const [liveData, setLiveData] = useState({});
  const [isScanning, setIsScanning] = useState(false);
  const [autoScan, setAutoScan] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedSport, setSelectedSport] = useState("NFL");

  const sports = useMemo(() => ["NFL", "NBA", "MLB", "CFB"], []);

  const fetchLiveData = useCallback(async (sport) => {
    try {
      const response = await fetchLiveScoring({ sport });
      
      if (response.data && response.data.success) {
        setLiveData(prev => ({
          ...prev,
          [sport]: {
            ...response.data.data,
            lastFetched: new Date().toISOString()
          }
        }));
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error(`Error fetching live ${sport} data:`, error);
    }
  }, []);

  const scanAllSports = useCallback(async () => {
    setIsScanning(true);
    
    // Fetch data for all sports in parallel
    await Promise.all(sports.map(sport => fetchLiveData(sport)));
    
    setIsScanning(false);
  }, [sports, fetchLiveData]);

  // Auto-scan functionality
  useEffect(() => {
    let interval;
    
    if (autoScan) {
      // Initial scan
      scanAllSports();
      
      // Set up interval for continuous scanning (every 30 seconds)
      interval = setInterval(() => {
        scanAllSports();
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoScan, scanAllSports]);

  const toggleAutoScan = () => {
    setAutoScan(!autoScan);
  };

  const currentData = liveData[selectedSport];
  const liveGames = currentData?.live_games || [];

  return (
    <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-red-400" />
              Live Scoring Scanner
              <Badge className={`${autoScan ? 'bg-green-500/20 text-green-400 animate-pulse' : 'bg-slate-500/20 text-slate-400'}`}>
                {autoScan ? 'SCANNING 24/7' : 'MANUAL'}
              </Badge>
            </CardTitle>
            <p className="text-slate-400 mt-1">
              Real-time internet scanning for live sports scores and game updates
            </p>
            {lastUpdate && (
              <p className="text-slate-500 text-sm mt-1">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleAutoScan}
              className={`${autoScan ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {autoScan ? (
                <>
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop Auto-Scan
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start 24/7 Scan
                </>
              )}
            </Button>
            
            <Button
              onClick={scanAllSports}
              disabled={isScanning}
              variant="outline"
              className="border-slate-600"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
              Scan Now
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sport Selection */}
        <Tabs value={selectedSport} onValueChange={setSelectedSport}>
          <TabsList className="bg-slate-800 border border-slate-700">
            {sports.map(sport => {
              const sportData = liveData[sport];
              const liveCount = sportData?.live_games?.length || 0;
              
              return (
                <TabsTrigger 
                  key={sport} 
                  value={sport}
                  className="data-[state=active]:bg-red-600 relative"
                >
                  {sport}
                  {liveCount > 0 && (
                    <Badge className="ml-2 bg-red-500/20 text-red-400 text-xs">
                      {liveCount}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {sports.map(sport => (
            <TabsContent key={sport} value={sport} className="space-y-4">
              {/* Live Games Display */}
              {liveGames.length === 0 ? (
                <div className="text-center py-8 bg-slate-800/50 rounded-lg">
                  <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No live {sport} games detected</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {autoScan ? 'Scanner will automatically detect when games go live' : 'Click "Scan Now" to check for live games'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Live {sport} Games ({liveGames.length})
                    </h3>
                    {currentData?.data_source && (
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                        Source: {currentData.data_source}
                      </Badge>
                    )}
                  </div>

                  <div className="grid gap-4">
                    {liveGames.map((game, index) => (
                      <Card key={game.game_id || index} className="bg-slate-800 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <Badge className="bg-red-500/20 text-red-400 animate-pulse">
                                  <Activity className="w-3 h-3 mr-1" />
                                  {game.status}
                                </Badge>
                                {game.quarter_period && (
                                  <Badge variant="outline" className="text-slate-400">
                                    {game.quarter_period}
                                  </Badge>
                                )}
                                {game.time_remaining && (
                                  <Badge variant="outline" className="text-slate-400">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {game.time_remaining}
                                  </Badge>
                                )}
                              </div>

                              {/* Score Display */}
                              <div className="mb-4 p-4 bg-slate-900/60 rounded-lg">
                                <div className="flex justify-between items-center text-2xl font-bold">
                                  <div className="text-center">
                                    <div className="text-white text-sm mb-1">{game.away_team}</div>
                                    <div className="text-3xl text-sky-400">{game.away_score}</div>
                                  </div>
                                  <div className="text-slate-400 text-lg">@</div>
                                  <div className="text-center">
                                    <div className="text-white text-sm mb-1">{game.home_team}</div>
                                    <div className="text-3xl text-sky-400">{game.home_score}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Game Details */}
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                {game.venue && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {game.venue}
                                  </div>
                                )}
                                {game.tv_network && (
                                  <div className="flex items-center gap-1">
                                    <Tv className="w-3 h-3" />
                                    {game.tv_network}
                                  </div>
                                )}
                                {game.game_time && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {game.game_time}
                                  </div>
                                )}
                              </div>

                              {/* Last Play */}
                              {game.last_play && (
                                <div className="mt-3 p-3 bg-slate-900/50 rounded">
                                  <p className="text-xs text-slate-400 mb-1">LAST PLAY</p>
                                  <p className="text-sm text-white">{game.last_play}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Scanning Status */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Scanner Status</h4>
              <p className="text-slate-400 text-sm">
                {autoScan 
                  ? "Automatically scanning internet for live games every 30 seconds" 
                  : "Manual scanning mode - click 'Scan Now' to update"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {autoScan && (
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm">Live</span>
                </div>
              )}
              <Badge className={`${isScanning ? 'bg-blue-500/20 text-blue-400 animate-pulse' : 'bg-slate-500/20 text-slate-400'}`}>
                {isScanning ? 'Scanning...' : 'Ready'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}