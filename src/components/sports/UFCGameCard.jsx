
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, TrendingUp, Target, Zap, Plus, Activity } from "lucide-react";
import { format } from "date-fns";

const UFCGameCard = ({ fight }) => {
  const [showProps, setShowProps] = useState(false);
  const [showAllMarkets, setShowAllMarkets] = useState(false);

  const formatOdds = (odds) => {
    if (odds === null || odds === undefined) return 'N/A';
    // Ensure odds is a number before checking its sign
    const numericOdds = Number(odds);
    if (isNaN(numericOdds)) return 'N/A';
    return numericOdds > 0 ? `+${numericOdds}` : `${numericOdds}`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'live': return 'bg-red-500/20 text-red-400';
      case 'upcoming': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  // Auto-Remove Completed Games from Today's Slate
  if (fight.status === 'completed') {
    return null;
  }

  // Extract fighter names - ENHANCED FOR PROPER DISPLAY AND NEW PRIORITY
  let fighterA = "Fighter A";
  let fighterB = "Fighter B";

  // PRIORITY 1: Use explicit fighter fields (most reliable)
  if (fight.fighter_a && fight.fighter_b) {
    fighterA = fight.fighter_a;
    fighterB = fight.fighter_b;
  } 
  // PRIORITY 2: Parse main_event string with ' vs '
  else if (fight.main_event && fight.main_event.includes(' vs ')) {
    const fighters = fight.main_event.split(' vs ');
    if (fighters.length >= 2) {
      fighterA = fighters[0].trim();
      fighterB = fighters[1].trim();
    }
  }
  // PRIORITY 3: Parse event_name string with ' vs ' (new addition)
  else if (fight.event_name && fight.event_name.includes(' vs ')) {
    const fighters = fight.event_name.split(' vs ');
    if (fighters.length >= 2) {
      fighterA = fighters[0].trim();
      fighterB = fighters[1].trim();
    }
  }
  // PRIORITY 4: Parse main_event with " v " separator
  else if (fight.main_event && fight.main_event.includes(' v ')) {
    const fighters = fight.main_event.split(' v ');
    if (fighters.length >= 2) {
      fighterA = fighters[0].trim();
      fighterB = fighters[1].trim();
    }
  }

  // Use real fight data if available (new structure from DraftKings API)
  const fights = fight.fights || fight.featured_fights || [];

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/80 transition-all">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                UFC
              </Badge>
              <Badge className={getStatusColor(fight.status)}>
                {fight.status === 'live' && <Activity className="w-3 h-3 mr-1 animate-pulse" />}
                {fight.status?.toUpperCase() || 'SCHEDULED'}
              </Badge>
              {fight.lines_available === false && (
                <Badge className="bg-yellow-500/20 text-yellow-400">
                  Lines Pending
                </Badge>
              )}
            </div>
            
            {/* Event Name */}
            <div className="mb-4">
              <h3 className="text-white font-bold text-lg mb-1">{fight.event_name || 'UFC Event'}</h3>
              {/* Only show main_event or derived fighters if we're not displaying individual fights */}
              {fights.length === 0 && (
                <p className="text-sky-400 font-semibold">{fight.main_event || `${fighterA} vs ${fighterB}`}</p>
              )}
              {fight.co_main && fights.length === 0 && ( // Also hide co-main if individual fights are listed
                <p className="text-slate-400 text-sm mt-1">Co-Main: {fight.co_main}</p>
              )}
            </div>
            
            {/* Fighters Display - ENHANCED WITH BETTING LINES - Only show if not using the new 'fights' array */}
            {fights.length === 0 && (
              <div className="space-y-3 bg-slate-900/30 rounded-lg p-4">
                {/* Fighter A */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-xl">{fighterA}</span>
                      {fight.weight_class && (
                        <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                          {fight.weight_class}
                        </Badge>
                      )}
                    </div>
                    {fight.fighter_a_record && (
                      <p className="text-slate-400 text-sm mt-1">Record: {fight.fighter_a_record}</p>
                    )}
                  </div>
                  {fight.dk_moneyline_a && (
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-sky-400 font-bold text-lg">{formatOdds(fight.dk_moneyline_a)}</span>
                        <span className="text-slate-400 text-xs">DK</span>
                      </div>
                      {fight.fd_moneyline_a && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-cyan-400 font-bold">{formatOdds(fight.fd_moneyline_a)}</span>
                          <span className="text-slate-400 text-xs">FD</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="text-center py-2">
                  <span className="text-slate-500 font-bold text-lg">VS</span>
                </div>
                
                {/* Fighter B */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-xl">{fighterB}</span>
                      {fight.weight_class && (
                        <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                          {fight.weight_class}
                        </Badge>
                      )}
                    </div>
                    {fight.fighter_b_record && (
                      <p className="text-slate-400 text-sm mt-1">Record: {fight.fighter_b_record}</p>
                    )}
                  </div>
                  {fight.dk_moneyline_b && (
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-sky-400 font-bold text-lg">{formatOdds(fight.dk_moneyline_b)}</span>
                        <span className="text-slate-400 text-xs">DK</span>
                      </div>
                      {fight.fd_moneyline_b && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-cyan-400 font-bold">{formatOdds(fight.fd_moneyline_b)}</span>
                          <span className="text-slate-400 text-xs">FD</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Fight Time/Status Box */}
          <div className="text-right bg-slate-900/60 rounded-lg p-4 border border-slate-600 min-w-[160px] ml-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-semibold text-xs uppercase tracking-wide">
                {fight.status === 'upcoming' ? 'Fight Time' : fight.status}
              </span>
            </div>
            
            <div className="text-white font-bold text-xl mb-2">
              {fight.game_time_est || 'TBD'}
            </div>
            
            <div className="text-xs text-slate-400 mt-2">
              {fight.tv_network}
            </div>
            {fight.venue && (
              <div className="text-xs text-slate-400 mt-1 text-center">
                {fight.venue}
              </div>
            )}
            
            {fight.lines_last_updated && (
              <div className="text-xs text-green-400 mt-2">
                Lines Updated: {format(new Date(fight.lines_last_updated), 'h:mm a')}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {fight.lines_available === false ? (
          // Lines Not Available Yet
          <div className="text-center py-8 bg-slate-900/30 rounded-lg border border-yellow-500/20">
            <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-yellow-400 font-semibold">Betting Lines Coming Soon</p>
            <p className="text-slate-400 text-sm mt-2">
              {fight.lines_expected || "Lines typically release 2-3 weeks before the event"}
            </p>
            <Button 
              className="mt-4 bg-yellow-600 hover:bg-yellow-700"
              onClick={() => alert("We'll notify you when lines are available!")}
            >
              <Target className="w-4 h-4 mr-2" />
              Notify When Lines Drop
            </Button>
          </div>
        ) : (
          <>
            {/* Display structured fights with multi-sportsbook props */}
            {fights.length > 0 ? (
              <div className="space-y-4">
                {fights.map((f, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-white font-bold text-lg">
                          {f.fighter_a || f.fight_name}
                        </h4>
                        <p className="text-slate-400 text-sm">vs</p>
                        <h4 className="text-white font-bold text-lg">
                          {f.fighter_b}
                        </h4>
                      </div>
                      {idx === 0 && (
                        <Badge className="bg-orange-500/20 text-orange-400">
                          MAIN EVENT
                        </Badge>
                      )}
                    </div>

                    {/* Main Markets - Moneyline, Method of Victory, Rounds */}
                    {f.markets && Object.keys(f.markets).length > 0 && (
                      <div className="space-y-4">
                        {/* Moneyline Comparison */}
                        {f.markets['Moneyline'] && (
                          <div>
                            <h5 className="text-slate-400 text-sm font-medium mb-2">Moneyline</h5>
                            <div className="grid grid-cols-2 gap-3">
                              {f.markets['Moneyline'].map((prop, i) => (
                                <div key={i} className="bg-slate-800/50 p-3 rounded">
                                  <p className="text-white font-medium text-sm mb-2">{prop.participant}</p>
                                  <div className="space-y-1">
                                    {prop.draftkings && (
                                      <div className="flex justify-between text-xs">
                                        <span className="text-sky-400">DK</span>
                                        <span className="text-white font-bold">
                                          {formatOdds(prop.draftkings.oddsAmerican)}
                                        </span>
                                      </div>
                                    )}
                                    {prop.fanduel && (
                                      <div className="flex justify-between text-xs">
                                        <span className="text-cyan-400">FD</span>
                                        <span className="text-white font-bold">
                                          {formatOdds(prop.fanduel.oddsAmerican)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Show More Markets Button */}
                        {Object.keys(f.markets).length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAllMarkets(!showAllMarkets)}
                            className="w-full border-slate-600 text-slate-300"
                          >
                            <Plus className="w-3 h-3 mr-2" />
                            {showAllMarkets ? 'Hide' : 'Show'} All Markets ({Object.keys(f.markets).length - 1})
                          </Button>
                        )}

                        {/* All Other Markets */}
                        {showAllMarkets && (
                          <div className="space-y-3 mt-4">
                            {Object.entries(f.markets)
                              .filter(([marketName]) => marketName !== 'Moneyline')
                              .map(([marketName, props]) => (
                                <div key={marketName} className="bg-slate-800/30 p-3 rounded">
                                  <h6 className="text-sky-400 font-medium text-sm mb-2">{marketName}</h6>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {props.slice(0, 6).map((prop, i) => ( // Limiting to 6 for brevity/layout, adjust as needed
                                      <div key={i} className="flex justify-between items-center text-xs">
                                        <span className="text-slate-300">{prop.prop}</span>
                                        <div className="flex gap-2">
                                          {prop.draftkings && (
                                            <span className="text-sky-400 font-bold">
                                              DK: {formatOdds(prop.draftkings.oddsAmerican)}
                                            </span>
                                          )}
                                          {prop.fanduel && (
                                            <span className="text-cyan-400 font-bold">
                                              FD: {formatOdds(prop.fanduel.oddsAmerican)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Fallback to old format if no 'fights' array is present
              <>
                {/* Main Betting Lines - ENHANCED WITH ALL SPORTSBOOKS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Moneyline */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-slate-400 text-sm font-medium mb-3 text-center">MONEYLINE</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-white">{fighterA.split(' ').pop()}</span>
                        <div className="text-right space-y-1">
                          {fight.dk_moneyline_a && (
                            <div className="flex items-center gap-2">
                              <span className="text-sky-400 font-mono">{formatOdds(fight.dk_moneyline_a)}</span>
                              <span className="text-slate-500 text-xs">DK</span>
                            </div>
                          )}
                          {fight.fd_moneyline_a && (
                            <div className="flex items-center gap-2">
                              <span className="text-cyan-400 font-mono">{formatOdds(fight.fd_moneyline_a)}</span>
                              <span className="text-slate-500 text-xs">FD</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-slate-700 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white">{fighterB.split(' ').pop()}</span>
                          <div className="text-right space-y-1">
                            {fight.dk_moneyline_b && (
                              <div className="flex items-center gap-2">
                                <span className="text-sky-400 font-mono">{formatOdds(fight.dk_moneyline_b)}</span>
                                <span className="text-slate-500 text-xs">DK</span>
                              </div>
                            )}
                            {fight.fd_moneyline_b && (
                              <div className="flex items-center gap-2">
                                <span className="text-cyan-400 font-mono">{formatOdds(fight.fd_moneyline_b)}</span>
                                <span className="text-slate-500 text-xs">FD</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Rounds O/U */}
                  {fight.total_rounds && (
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-slate-400 text-sm font-medium mb-3 text-center">TOTAL ROUNDS</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-white">Over {fight.total_rounds}</span>
                          <div className="text-right space-y-1">
                            {fight.dk_over_rounds && (
                              <div className="flex items-center gap-2">
                                <span className="text-green-400 font-mono">{formatOdds(fight.dk_over_rounds)}</span>
                                <span className="text-slate-500 text-xs">DK</span>
                              </div>
                            )}
                            {fight.fd_over_rounds && (
                              <div className="flex items-center gap-2">
                                <span className="text-green-400 font-mono">{formatOdds(fight.fd_over_rounds)}</span>
                                <span className="text-slate-500 text-xs">FD</span>
                              </div>
                            )}
                            {fight.mgm_over_rounds && (
                              <div className="flex items-center gap-2">
                                <span className="text-green-400 font-mono">{formatOdds(fight.mgm_over_rounds)}</span>
                                <span className="text-slate-500 text-xs">MGM</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="border-t border-slate-700 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white">Under {fight.total_rounds}</span>
                            <div className="text-right space-y-1">
                              {fight.dk_under_rounds && (
                                <div className="flex items-center gap-2">
                                  <span className="text-red-400 font-mono">{formatOdds(fight.dk_under_rounds)}</span>
                                  <span className="text-slate-500 text-xs">DK</span>
                                </div>
                              )}
                              {fight.fd_under_rounds && (
                                <div className="flex items-center gap-2">
                                  <span className="text-red-400 font-mono">{formatOdds(fight.fd_under_rounds)}</span>
                                  <span className="text-slate-500 text-xs">FD</span>
                                </div>
                              )}
                              {fight.mgm_under_rounds && (
                                <div className="flex items-center gap-2">
                                  <span className="text-red-400 font-mono">{formatOdds(fight.mgm_under_rounds)}</span>
                                  <span className="text-slate-500 text-xs">MGM</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Method of Victory Preview */}
                  {(fight.fighter_a_ko_tko_dq || fight.fighter_b_ko_tko_dq || fight.fighter_a_submission || fight.fighter_b_submission || fight.fighter_a_points_decision) && (
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-slate-400 text-sm font-medium mb-3 text-center">METHOD OF VICTORY</h4>
                      <div className="space-y-2 text-sm">
                        {fight.fighter_a_ko_tko_dq && (
                          <div className="flex justify-between">
                            <span className="text-white">{fighterA.split(' ').pop()} KO/TKO</span>
                            <span className="text-green-400 font-mono">{formatOdds(fight.fighter_a_ko_tko_dq)}</span>
                          </div>
                        )}
                        {fight.fighter_b_ko_tko_dq && (
                          <div className="flex justify-between">
                            <span className="text-white">{fighterB.split(' ').pop()} KO/TKO</span>
                            <span className="text-orange-400 font-mono">{formatOdds(fight.fighter_b_ko_tko_dq)}</span>
                          </div>
                        )}
                        {fight.fighter_a_submission && (
                          <div className="flex justify-between">
                            <span className="text-white">{fighterA.split(' ').pop()} SUB</span>
                            <span className="text-purple-400 font-mono">{formatOdds(fight.fighter_a_submission)}</span>
                          </div>
                        )}
                        {fight.fighter_b_submission && (
                          <div className="flex justify-between">
                            <span className="text-white">{fighterB.split(' ').pop()} SUB</span>
                            <span className="text-purple-400 font-mono">{formatOdds(fight.fighter_b_submission)}</span>
                          </div>
                        )}
                        {fight.fighter_a_points_decision && (
                          <div className="flex justify-between">
                            <span className="text-white">Decision</span>
                            <span className="text-blue-400 font-mono">{formatOdds(fight.fighter_a_points_decision)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Action Buttons - Only show "Show/Hide Props" if using the old data structure and props available */}
            <div className="flex gap-3">
              {fights.length === 0 && fight.fight_props_available && (
                <Button 
                  variant="outline" 
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => setShowProps(!showProps)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {showProps ? 'Hide' : 'Show'} Fight Props
                </Button>
              )}
              <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-1">
                <Target className="w-4 h-4 mr-2" />
                UFC Analysis
              </Button>
            </div>

            {/* Fight Props - Only render if using the old data structure and showProps is true */}
            {fights.length === 0 && showProps && fight.fight_props_available && (
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg border border-orange-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <h4 className="text-white font-semibold">Complete UFC Props Suite</h4>
                  <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                    <Target className="w-3 h-3 mr-1" />
                    Live Lines
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Method of Victory - Fighter A */}
                  <div className="space-y-3">
                    <h5 className="text-orange-400 font-medium">{fighterA} Method</h5>
                    <div className="space-y-2">
                      {fight.fighter_a_ko_tko_dq && (
                        <div className="bg-slate-800/50 rounded p-3 flex justify-between items-center">
                          <span className="text-white text-sm">Win by KO/TKO/DQ</span>
                          <Button variant="outline" size="sm" className="border-green-600 text-green-400 text-xs">
                            {formatOdds(fight.fighter_a_ko_tko_dq)}
                          </Button>
                        </div>
                      )}
                      {fight.fighter_a_submission && (
                        <div className="bg-slate-800/50 rounded p-3 flex justify-between items-center">
                          <span className="text-white text-sm">Win by Submission</span>
                          <Button variant="outline" size="sm" className="border-purple-600 text-purple-400 text-xs">
                            {formatOdds(fight.fighter_a_submission)}
                          </Button>
                        </div>
                      )}
                      {fight.fighter_a_points_decision && (
                        <div className="bg-slate-800/50 rounded p-3 flex justify-between items-center">
                          <span className="text-white text-sm">Win by Decision</span>
                          <Button variant="outline" size="sm" className="border-blue-600 text-blue-400 text-xs">
                            {formatOdds(fight.fighter_a_points_decision)}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Method of Victory - Fighter B */}
                  <div className="space-y-3">
                    <h5 className="text-orange-400 font-medium">{fighterB} Method</h5>
                    <div className="space-y-2">
                      {fight.fighter_b_ko_tko_dq && (
                        <div className="bg-slate-800/50 rounded p-3 flex justify-between items-center">
                          <span className="text-white text-sm">Win by KO/TKO/DQ</span>
                          <Button variant="outline" size="sm" className="border-green-600 text-green-400 text-xs">
                            {formatOdds(fight.fighter_b_ko_tko_dq)}
                          </Button>
                        </div>
                      )}
                      {fight.fighter_b_submission && (
                        <div className="bg-slate-800/50 rounded p-3 flex justify-between items-center">
                          <span className="text-white text-sm">Win by Submission</span>
                          <Button variant="outline" size="sm" className="border-purple-600 text-purple-400 text-xs">
                            {formatOdds(fight.fighter_b_submission)}
                          </Button>
                        </div>
                      )}
                      {fight.fighter_b_points_decision && (
                        <div className="bg-slate-800/50 rounded p-3 flex justify-between items-center">
                          <span className="text-white text-sm">Win by Decision</span>
                          <Button variant="outline" size="sm" className="border-blue-600 text-blue-400 text-xs">
                            {formatOdds(fight.fighter_b_points_decision)}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* General Fight & Timing Props */}
                  <div className="space-y-3">
                    <h5 className="text-orange-400 font-medium">Fight & Timing Props</h5>
                    <div className="space-y-2">
                      {fight.ftgtd_yes_odds && fight.ftgtd_no_odds && (
                        <div className="bg-slate-800/50 rounded p-3">
                          <span className="text-white text-sm mb-2 block text-center">Fight Goes Distance</span>
                          <div className="flex justify-around">
                            <Button variant="outline" size="sm" className="border-green-600 text-green-400 text-xs">
                              Yes {formatOdds(fight.ftgtd_yes_odds)}
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-600 text-red-400 text-xs">
                              No {formatOdds(fight.ftgtd_no_odds)}
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {fight.first_minute_finish_yes && (
                        <div className="bg-slate-800/50 rounded p-3 flex justify-between items-center">
                          <span className="text-white text-sm">First Minute Finish</span>
                          <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-400 text-xs">
                            Yes {formatOdds(fight.first_minute_finish_yes)}
                          </Button>
                        </div>
                      )}

                      {fight.last_second_finish_yes && (
                        <div className="bg-slate-800/50 rounded p-3 flex justify-between items-center">
                          <span className="text-white text-sm">Last Second Finish</span>
                          <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-400 text-xs">
                            Yes {formatOdds(fight.last_second_finish_yes)}
                          </Button>
                        </div>
                      )}

                      {fight.draw_no_contest && (
                        <div className="bg-slate-800/50 rounded p-3 flex justify-between items-center">
                          <span className="text-white text-sm">Draw / No Contest</span>
                          <Button variant="outline" size="sm" className="border-gray-500 text-gray-400 text-xs">
                            {formatOdds(fight.draw_no_contest)}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UFCGameCard;
