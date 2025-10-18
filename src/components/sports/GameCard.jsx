import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Brain, TrendingUp, Clock, Users, Target, DollarSign, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function GameCard({ game = {}, sport = "NFL", onAnalyze, analysisData }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingProps, setAnalyzingProps] = useState(false);
  const [analyzingTeamProps, setAnalyzingTeamProps] = useState(false);
  const [showInjuries, setShowInjuries] = useState(false);
  const [injuries, setInjuries] = useState([]);
  
  const homeTeam = game.home_team || game.home || 'Home Team';
  const awayTeam = game.away_team || game.away || 'Away Team';
  
  useEffect(() => {
    const loadInjuries = async () => {
      try {
        const response = await base44.functions.invoke('fetchInjuries', { sport });
        const data = response?.data;
        
        if (data?.injuries) {
          const gameInjuries = data.injuries.filter(inj => 
            homeTeam.includes(inj.team_abbr) || 
            awayTeam.includes(inj.team_abbr) ||
            homeTeam.toLowerCase().includes(inj.team_abbr?.toLowerCase()) ||
            awayTeam.toLowerCase().includes(inj.team_abbr?.toLowerCase())
          );
          setInjuries(gameInjuries);
        }
      } catch (error) {
        console.error('Error loading injuries:', error);
      }
    };
    
    loadInjuries();
  }, [sport, homeTeam, awayTeam]);
  
  const markets = game.markets || {};
  const moneyline = markets.moneyline || {};
  const spread = markets.spread || {};
  const total = markets.total || {};
  
  const dkMoneyline = moneyline.draftkings || [];
  const fdMoneyline = moneyline.fanduel || [];
  const dkSpread = spread.draftkings || [];
  const fdSpread = spread.fanduel || [];
  const dkTotal = total.draftkings || [];
  const fdTotal = total.fanduel || [];
  
  const allBooks = new Set([
    ...Object.keys(moneyline),
    ...Object.keys(spread),
    ...Object.keys(total)
  ]);
  
  const formatOdds = (odds) => {
    if (!odds) return '-';
    return odds > 0 ? `+${odds}` : `${odds}`;
  };
  
  const getTeamOdds = (outcomes, teamName) => {
    const outcome = outcomes?.find(o => o.name === teamName);
    return outcome ? formatOdds(outcome.price) : '-';
  };
  
  const getSpread = (outcomes, teamName) => {
    const outcome = outcomes?.find(o => o.name === teamName);
    if (!outcome) return { line: '-', odds: '-' };
    return { 
      line: outcome.point > 0 ? `+${outcome.point}` : `${outcome.point}`,
      odds: formatOdds(outcome.price)
    };
  };
  
  const getTotal = (outcomes) => {
    if (!outcomes || outcomes.length === 0) return { line: '-', over: '-', under: '-' };
    const over = outcomes.find(o => o.name === 'Over');
    const under = outcomes.find(o => o.name === 'Under');
    return {
      line: over?.point || under?.point || '-',
      over: over ? formatOdds(over.price) : '-',
      under: under ? formatOdds(under.price) : '-'
    };
  };

  const dkHomeSpread = getSpread(dkSpread, homeTeam);
  const fdHomeSpread = getSpread(fdSpread, homeTeam);
  const dkAwaySpread = getSpread(dkSpread, awayTeam);
  const fdAwaySpread = getSpread(fdSpread, awayTeam);
  
  const dkTotalData = getTotal(dkTotal);
  const fdTotalData = getTotal(fdTotal);

  const gameTime = game.commence_time || game.game_date;
  
  const targetTimeZone = 'America/New_York';

  const formattedDate = gameTime ? new Date(gameTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: targetTimeZone
  }) : 'TBD';

  const timezoneAbbr = gameTime ? new Date(gameTime).toLocaleTimeString('en-US', {
    timeZoneName: 'short',
    timeZone: targetTimeZone
  }).split(' ').pop() : '';
  
  const formattedTime = gameTime ? new Date(gameTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }) : '';

  const handleAnalyze = async () => {
    if (!onAnalyze) {
      alert('Analyzer function not available');
      return;
    }
    setAnalyzing(true);
    try {
      await onAnalyze(game, 'game');
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePlayerProps = async () => {
    if (!onAnalyze) {
      alert('Player Props analyzer not available');
      return;
    }
    setAnalyzingProps(true);
    try {
      await onAnalyze(game, 'player_props');
    } catch (error) {
      console.error('Player props analysis error:', error);
    } finally {
      setAnalyzingProps(false);
    }
  };

  const handleTeamProps = async () => {
    if (!onAnalyze) {
      alert('Team Props analyzer not available');
      return;
    }
    setAnalyzingTeamProps(true);
    try {
      await onAnalyze(game, 'team_props');
    } catch (error) {
      console.error('Team props analysis error:', error);
    } finally {
      setAnalyzingTeamProps(false);
    }
  };

  const formatConfidence = (conf) => {
    if (!conf) return '0';
    return conf < 1 ? (conf * 100).toFixed(0) : conf.toFixed(0);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
      <div className="relative p-5 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-xs font-bold text-white shadow-lg">
              {sport}
            </span>
            {allBooks.size > 0 && (
              <span className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-xs text-green-400 font-semibold">
                {allBooks.size} Books
              </span>
            )}
            {injuries.length > 0 && (
              <button
                onClick={() => setShowInjuries(!showInjuries)}
                className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400 font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-1"
              >
                <ShieldAlert className="w-3 h-3" />
                {injuries.length} {injuries.length === 1 ? 'Injury' : 'Injuries'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Clock className="w-4 h-4" />
            <div className="text-right">
              <div className="font-semibold">{formattedDate}</div>
              {formattedTime && <div className="text-xs text-gray-400">{formattedTime}</div>}
            </div>
          </div>
        </div>

        {showInjuries && injuries.length > 0 && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Injury Report
            </h4>
            <div className="space-y-2">
              {injuries.map((injury, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded p-2 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-white font-semibold">{injury.player_name}</span>
                      <span className="text-gray-400 text-xs ml-2">({injury.position})</span>
                    </div>
                    <span className={`text-xs font-bold ${
                      injury.injury_status?.toLowerCase() === 'out' ? 'text-red-400' :
                      injury.injury_status?.toLowerCase() === 'doubtful' ? 'text-orange-400' :
                      injury.injury_status?.toLowerCase() === 'questionable' ? 'text-yellow-400' :
                      'text-gray-400'
                    }`}>
                      {injury.injury_status}
                    </span>
                  </div>
                  {injury.injury_description && (
                    <p className="text-gray-400 text-xs mt-1">{injury.injury_description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-xl font-bold text-white">{awayTeam}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Away</div>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm font-semibold">@</div>
          
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <span className="text-xl font-bold text-white">{homeTeam}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Home</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-3 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Game Analysis
              </>
            )}
          </button>

          <button
            onClick={handlePlayerProps}
            disabled={analyzingProps}
            className="px-3 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
          >
            {analyzingProps ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Player Props
              </>
            )}
          </button>

          <button
            onClick={handleTeamProps}
            disabled={analyzingTeamProps}
            className="px-3 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
          >
            {analyzingTeamProps ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Team Props
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="text-xs text-gray-400 mb-1 font-semibold">MONEYLINE</div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300 truncate text-xs">{awayTeam.split(' ').pop()}</span>
                <span className="text-blue-400 font-mono font-bold">{getTeamOdds(dkMoneyline, awayTeam)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 truncate text-xs">{homeTeam.split(' ').pop()}</span>
                <span className="text-purple-400 font-mono font-bold">{getTeamOdds(dkMoneyline, homeTeam)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="text-xs text-gray-400 mb-1 font-semibold">SPREAD</div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300 truncate text-xs">{awayTeam.split(' ').pop()}</span>
                <span className="text-green-400 font-mono font-bold">{dkAwaySpread.line}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 truncate text-xs">{homeTeam.split(' ').pop()}</span>
                <span className="text-green-400 font-mono font-bold">{dkHomeSpread.line}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="text-xs text-gray-400 mb-1 font-semibold">TOTAL</div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300 text-xs">Over</span>
                <span className="text-orange-400 font-mono font-bold">{dkTotalData.line}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-xs">Under</span>
                <span className="text-cyan-400 font-mono font-bold">{dkTotalData.line}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4 pt-4 border-t border-gray-700">
          <div>
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Moneyline Odds
            </h4>
            <div className="bg-gray-800/50 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 pb-2 font-semibold">Team</th>
                    <th className="text-center text-gray-400 pb-2 font-semibold">DraftKings</th>
                    <th className="text-center text-gray-400 pb-2 font-semibold">FanDuel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700/50">
                    <td className="py-2 text-white font-medium">{awayTeam}</td>
                    <td className="text-center text-blue-400 font-mono font-bold">{getTeamOdds(dkMoneyline, awayTeam)}</td>
                    <td className="text-center text-blue-400 font-mono font-bold">{getTeamOdds(fdMoneyline, awayTeam)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white font-medium">{homeTeam}</td>
                    <td className="text-center text-purple-400 font-mono font-bold">{getTeamOdds(dkMoneyline, homeTeam)}</td>
                    <td className="text-center text-purple-400 font-mono font-bold">{getTeamOdds(fdMoneyline, homeTeam)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Spread
            </h4>
            <div className="bg-gray-800/50 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 pb-2 font-semibold">Team</th>
                    <th className="text-center text-gray-400 pb-2 font-semibold">DraftKings</th>
                    <th className="text-center text-gray-400 pb-2 font-semibold">FanDuel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700/50">
                    <td className="py-2 text-white font-medium">{awayTeam}</td>
                    <td className="text-center text-green-400 font-mono font-bold">
                      {dkAwaySpread.line !== '-' ? `${dkAwaySpread.line} (${dkAwaySpread.odds})` : '-'}
                    </td>
                    <td className="text-center text-green-400 font-mono font-bold">
                      {fdAwaySpread.line !== '-' ? `${fdAwaySpread.line} (${fdAwaySpread.odds})` : '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white font-medium">{homeTeam}</td>
                    <td className="text-center text-green-400 font-mono font-bold">
                      {dkHomeSpread.line !== '-' ? `${dkHomeSpread.line} (${dkHomeSpread.odds})` : '-'}
                    </td>
                    <td className="text-center text-green-400 font-mono font-bold">
                      {fdHomeSpread.line !== '-' ? `${fdHomeSpread.line} (${fdHomeSpread.odds})` : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              Total (Over/Under)
            </h4>
            <div className="bg-gray-800/50 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 pb-2 font-semibold">Line</th>
                    <th className="text-center text-gray-400 pb-2 font-semibold">DraftKings</th>
                    <th className="text-center text-gray-400 pb-2 font-semibold">FanDuel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700/50">
                    <td className="py-2 text-white font-medium">Over {dkTotalData.line}</td>
                    <td className="text-center text-orange-400 font-mono font-bold">{dkTotalData.over}</td>
                    <td className="text-center text-orange-400 font-mono font-bold">{fdTotalData.over}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white font-medium">Under {dkTotalData.line}</td>
                    <td className="text-center text-cyan-400 font-mono font-bold">{dkTotalData.under}</td>
                    <td className="text-center text-cyan-400 font-mono font-bold">{fdTotalData.under}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-3 text-xs text-gray-400">
            <p>Game ID: {game.id}</p>
            <p className="mt-1">Status: {game.status || 'Upcoming'}</p>
            {allBooks.size > 0 && (
              <p className="mt-1 text-green-400">
                Available at: {Array.from(allBooks).join(', ')}
              </p>
            )}
          </div>
        </div>

        {analysisData && (
          <div className="mt-6 pt-6 border-t-2 border-purple-500/30">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              AI Analysis
            </h3>
            
            <div className="space-y-4">
              {analysisData.edge_summary && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-yellow-400 font-bold mb-1">🎯 THE EDGE</h3>
                      <p className="text-white font-semibold">{analysisData.edge_summary}</p>
                    </div>
                  </div>
                </div>
              )}

              {analysisData.weather_impact && (
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                  <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                    ☁️ Weather Impact
                  </h4>
                  <p className="text-gray-300 text-sm">{analysisData.weather_impact}</p>
                </div>
              )}

              {analysisData.predictions && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    📊 Predictions & Projections
                  </h4>

                  {analysisData.score_prediction && (
                    <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded">
                      <div className="text-purple-400 text-sm font-semibold mb-1">Projected Score</div>
                      <div className="text-white font-bold text-lg text-center">
                        {typeof analysisData.score_prediction === 'string' 
                          ? analysisData.score_prediction 
                          : `${analysisData.score_prediction.away_score || 0} - ${analysisData.score_prediction.home_score || 0}`
                        }
                      </div>
                    </div>
                  )}

                  {analysisData.predictions.winner && (
                    <div className="mb-3">
                      <div className="text-gray-400 text-sm">Winner</div>
                      <div className="text-white font-bold text-lg">{analysisData.predictions.winner}</div>
                    </div>
                  )}

                  {analysisData.predictions.spread_pick && (
                    <div className="mb-3">
                      <div className="text-gray-400 text-sm mb-1">Spread Pick</div>
                      <div className="text-green-400 font-bold">{analysisData.predictions.spread_pick}</div>
                      {analysisData.predictions.spread_confidence && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Confidence</span>
                            <span className="text-white font-bold">{formatConfidence(analysisData.predictions.spread_confidence)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                              style={{ width: `${formatConfidence(analysisData.predictions.spread_confidence)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {analysisData.predictions.total_pick && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Total</div>
                      <div className="text-purple-400 font-bold">{analysisData.predictions.total_pick}</div>
                      {analysisData.predictions.total_confidence && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Confidence</span>
                            <span className="text-white font-bold">{formatConfidence(analysisData.predictions.total_confidence)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${formatConfidence(analysisData.predictions.total_confidence)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {analysisData.recommended_bets && analysisData.recommended_bets.length > 0 && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Recommended Bets
                  </h4>
                  <div className="space-y-3">
                    {analysisData.recommended_bets.map((bet, idx) => {
                      const units = bet.units || (bet.confidence >= 0.7 ? 2 : 1);
                      
                      return (
                        <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-green-400">{bet.bet || bet.pick || bet.recommendation}</div>
                            <div className="text-white font-bold">{units}u</div>
                          </div>
                          
                          {bet.best_at && (
                            <div className="text-gray-400 text-xs mb-2">Best at: {bet.best_at}</div>
                          )}

                          {bet.reasoning && (
                            <p className="text-gray-300 text-sm">{bet.reasoning}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PLAYER PROPS - SEPARATED BY SPORTSBOOK */}
              {(analysisData.top_player_props_draftkings || analysisData.top_player_props_fanduel) && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Top 5 Player Props
                  </h4>

                  {/* DraftKings Player Props */}
                  {analysisData.top_player_props_draftkings && analysisData.top_player_props_draftkings.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                          <span className="text-xs font-bold">DK</span>
                        </div>
                        <h5 className="text-green-400 font-bold">DraftKings</h5>
                      </div>
                      <div className="space-y-3">
                        {analysisData.top_player_props_draftkings.map((prop, idx) => {
                          const confidencePercent = formatConfidence(prop.confidence);
                          
                          return (
                            <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded p-3">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="font-semibold text-green-400">{prop.player}</div>
                                  <div className="text-white text-sm font-medium">{prop.prop}</div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-white font-bold text-lg">{confidencePercent}%</div>
                                  <div className="text-green-400 text-xs">DraftKings</div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                                  style={{ width: `${confidencePercent}%` }}
                                ></div>
                              </div>
                              {prop.reasoning && (
                                <p className="text-gray-400 text-xs">{prop.reasoning}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* FanDuel Player Props */}
                  {analysisData.top_player_props_fanduel && analysisData.top_player_props_fanduel.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-xs font-bold">FD</span>
                        </div>
                        <h5 className="text-blue-400 font-bold">FanDuel</h5>
                      </div>
                      <div className="space-y-3">
                        {analysisData.top_player_props_fanduel.map((prop, idx) => {
                          const confidencePercent = formatConfidence(prop.confidence);
                          
                          return (
                            <div key={idx} className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="font-semibold text-blue-400">{prop.player}</div>
                                  <div className="text-white text-sm font-medium">{prop.prop}</div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-white font-bold text-lg">{confidencePercent}%</div>
                                  <div className="text-blue-400 text-xs">FanDuel</div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                  style={{ width: `${confidencePercent}%` }}
                                ></div>
                              </div>
                              {prop.reasoning && (
                                <p className="text-gray-400 text-xs">{prop.reasoning}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TEAM PROPS - SEPARATED BY SPORTSBOOK */}
              {(analysisData.top_team_props_draftkings || analysisData.top_team_props_fanduel) && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Top 5 Team Props
                  </h4>

                  {/* DraftKings Team Props */}
                  {analysisData.top_team_props_draftkings && analysisData.top_team_props_draftkings.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                          <span className="text-xs font-bold">DK</span>
                        </div>
                        <h5 className="text-green-400 font-bold">DraftKings</h5>
                      </div>
                      <div className="space-y-3">
                        {analysisData.top_team_props_draftkings.map((prop, idx) => {
                          const confidencePercent = formatConfidence(prop.confidence);
                          
                          return (
                            <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded p-3">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="font-semibold text-green-400">{prop.team}</div>
                                  <div className="text-white text-sm font-medium">{prop.prop}</div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-white font-bold text-lg">{confidencePercent}%</div>
                                  <div className="text-green-400 text-xs">DraftKings</div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                                  style={{ width: `${confidencePercent}%` }}
                                ></div>
                              </div>
                              {prop.reasoning && (
                                <p className="text-gray-400 text-xs">{prop.reasoning}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* FanDuel Team Props */}
                  {analysisData.top_team_props_fanduel && analysisData.top_team_props_fanduel.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-xs font-bold">FD</span>
                        </div>
                        <h5 className="text-blue-400 font-bold">FanDuel</h5>
                      </div>
                      <div className="space-y-3">
                        {analysisData.top_team_props_fanduel.map((prop, idx) => {
                          const confidencePercent = formatConfidence(prop.confidence);
                          
                          return (
                            <div key={idx} className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="font-semibold text-blue-400">{prop.team}</div>
                                  <div className="text-white text-sm font-medium">{prop.prop}</div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-white font-bold text-lg">{confidencePercent}%</div>
                                  <div className="text-blue-400 text-xs">FanDuel</div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                  style={{ width: `${confidencePercent}%` }}
                                ></div>
                              </div>
                              {prop.reasoning && (
                                <p className="text-gray-400 text-xs">{prop.reasoning}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {analysisData.key_trends && analysisData.key_trends.length > 0 && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    📋 Key Trends
                  </h4>
                  <ul className="space-y-2">
                    {analysisData.key_trends.map((trend, idx) => (
                      <li key={idx} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-blue-400">•</span>
                        <span>{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}