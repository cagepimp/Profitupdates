
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Users, TrendingUp } from "lucide-react";

export default function PlayerPropsComparison({ playerProps, teamProps, isLoading, sport }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/10 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-white/20 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-white/20 rounded"></div>
                  <div className="h-16 bg-white/20 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (playerProps.length === 0 && teamProps.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0">
        <CardContent className="p-12 text-center">
          <User className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">No Props Available</h3>
          <p className="text-white/70">No player or team props available for {sport}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Player Props */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><User /> Player Props</h2>
        <div className="space-y-4">
          {playerProps.slice(0, 10).map((prop) => (
            <Card key={prop.id} className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/15 transition-all">
              <CardContent className="p-6">
                {/* Player Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{prop.player_name}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge className="bg-blue-500 text-white text-xs">{prop.team}</Badge>
                      <Badge className="bg-purple-500 text-white text-xs">{prop.prop_type}</Badge>
                      <Badge className={`text-white text-xs ${
                        prop.injury_status === 'healthy' ? 'bg-green-500' :
                        prop.injury_status === 'questionable' ? 'bg-yellow-500' :
                        prop.injury_status === 'doubtful' ? 'bg-orange-500' : 'bg-red-500'
                      }`}>
                        {prop.injury_status}
                      </Badge>
                    </div>
                  </div>
                  {prop.algorithm_confidence && (
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">{prop.algorithm_confidence}%</div>
                      <div className="text-white/70 text-xs">Confidence</div>
                    </div>
                  )}
                </div>

                <div className="text-center mb-4">
                  <div className="text-white font-bold text-2xl">{prop.prop_line}</div>
                  <div className="text-white/70 text-sm">{prop.prop_type}</div>
                </div>

                {/* FanDuel vs DraftKings Props */}
                <div className="grid grid-cols-2 gap-6">
                  {/* FanDuel Props */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4">
                    <div className="text-center mb-3">
                      <h4 className="text-white font-bold">FanDuel</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="bg-green-500/20 hover:bg-green-500/30 text-white border border-green-500/50 h-12 flex flex-col justify-center">
                        <div className="text-xs">Over {prop.prop_line}</div>
                        <div className="font-bold">
                          {prop.fd_over_odds > 0 ? '+' : ''}{prop.fd_over_odds}
                        </div>
                      </Button>
                      <Button className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50 h-12 flex flex-col justify-center">
                        <div className="text-xs">Under {prop.prop_line}</div>
                        <div className="font-bold">
                          {prop.fd_under_odds > 0 ? '+' : ''}{prop.fd_under_odds}
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* DraftKings Props */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4">
                    <div className="text-center mb-3">
                      <h4 className="text-white font-bold">DraftKings</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="bg-green-500/20 hover:bg-green-500/30 text-white border border-green-500/50 h-12 flex flex-col justify-center">
                        <div className="text-xs">Over {prop.prop_line}</div>
                        <div className="font-bold">
                          {prop.dk_over_odds > 0 ? '+' : ''}{prop.dk_over_odds}
                        </div>
                      </Button>
                      <Button className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50 h-12 flex flex-col justify-center">
                        <div className="text-xs">Under {prop.prop_line}</div>
                        <div className="font-bold">
                          {prop.dk_under_odds > 0 ? '+' : ''}{prop.dk_under_odds}
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Public Betting Percentage */}
                {prop.public_bet_percentage_over && (
                  <div className="mt-4 bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between text-white text-sm mb-2">
                      <span>Public Betting</span>
                      <span>{prop.public_bet_percentage_over}% taking Over</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${prop.public_bet_percentage_over}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Team Props */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Users /> Team Props</h2>
        <div className="space-y-4">
           {teamProps.slice(0, 10).map((prop) => (
            <Card key={prop.id} className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/15 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{prop.team}</h3>
                    <Badge className="bg-purple-500 text-white text-xs mt-1">{prop.prop_type}</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold text-2xl">{prop.prop_line}</div>
                    <div className="text-white/70 text-sm">{prop.prop_type} Line</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4">
                    <div className="text-center mb-3"><h4 className="text-white font-bold">FanDuel</h4></div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="bg-green-500/20 hover:bg-green-500/30 text-white border border-green-500/50 h-12 flex flex-col justify-center">
                        <div className="text-xs">Over {prop.prop_line}</div>
                        <div className="font-bold">{prop.fd_over_odds > 0 ? '+' : ''}{prop.fd_over_odds}</div>
                      </Button>
                      <Button className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50 h-12 flex flex-col justify-center">
                        <div className="text-xs">Under {prop.prop_line}</div>
                        <div className="font-bold">{prop.fd_under_odds > 0 ? '+' : ''}{prop.fd_under_odds}</div>
                      </Button>
                    </div>
                  </div>

                   <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4">
                    <div className="text-center mb-3"><h4 className="text-white font-bold">DraftKings</h4></div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="bg-green-500/20 hover:bg-green-500/30 text-white border border-green-500/50 h-12 flex flex-col justify-center">
                        <div className="text-xs">Over {prop.prop_line}</div>
                        <div className="font-bold">{prop.dk_over_odds > 0 ? '+' : ''}{prop.dk_over_odds}</div>
                      </Button>
                      <Button className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50 h-12 flex flex-col justify-center">
                        <div className="text-xs">Under {prop.prop_line}</div>
                        <div className="font-bold">{prop.dk_under_odds > 0 ? '+' : ''}{prop.dk_under_odds}</div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
