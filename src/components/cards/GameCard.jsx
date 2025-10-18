import React, { useState } from 'react';
import { TrendingUp, Zap, ChevronDown, ChevronUp, Target, BarChart3 } from 'lucide-react';

export default function GameCard({ game = {}, sport = "NFL" }) {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  
  // Extract team names
  const homeTeam = game.home_team || game.home || 'Home Team';
  const awayTeam = game.away_team || game.away || 'Away Team';
  
  // Extract REAL markets from game data
  const markets = game.markets || {};
  const moneyline = markets.moneyline || {};
  const spread = markets.spread || {};
  const total = markets.total || {};
  
  // Get DraftKings and FanDuel odds
  const dkMoneyline = moneyline.draftkings || [];
  const fdMoneyline = moneyline.fanduel || [];
  const dkSpread = spread.draftkings || [];
  const fdSpread = spread.fanduel || [];
  const dkTotal = total.draftkings || [];
  const fdTotal = total.fanduel || [];
  
  // Helper to format odds
  const formatOdds = (odds) => {
    if (!odds) return '-';
    return odds > 0 ? `+${odds}` : `${odds}`;
  };
  
  // Helper to get team odds from outcomes array
  const getTeamOdds = (outcomes, teamName) => {
    const outcome = outcomes?.find(o => o.name === teamName);
    return outcome ? formatOdds(outcome.price) : '-';
  };
  
  // Helper to get spread with odds
  const getSpread = (outcomes, teamName) => {
    const outcome = outcomes?.find(o => o.name === teamName);
    if (!outcome) return { line: '-', odds: '-' };
    return { 
      line: outcome.point > 0 ? `+${outcome.point}` : `${outcome.point}`,
      odds: formatOdds(outcome.price)
    };
  };
  
  // Helper to get total
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

  // USE REAL ANALYZER DATA from game.analysis (not mock data!)
  const analysis = game?.analysis;
  const hasAnalysis = analysis && analysis.prediction;
  
  // Calculate real confidence from spread and total confidence
  const confidence = hasAnalysis 
    ? Math.round((analysis.prediction.spread_confidence + analysis.prediction.total_confidence) / 2)
    : null;

  const getConfidenceColor = (confidence) => {
    if (!confidence) return 'text-gray-400 bg-gray-900/30 border-gray-500';
    if (confidence >= 70) return 'text-green-400 bg-green-900/30 border-green-500';
    if (confidence >= 60) return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
    return 'text-orange-400 bg-orange-900/30 border-orange-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-bold text-white">
            {sport}
          </span>
          <span className="text-gray-300 text-sm">
            {game.game_date || game.commence_time 
              ? new Date(game.game_date || game.commence_time).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })
              : 'TBD'
            }
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-right">
            <h3 className="text-xl font-bold text-white">{awayTeam}</h3>
            <p className="text-blue-400 text-sm font-semibold mt-1">
              {getTeamOdds(fdMoneyline, awayTeam)}
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-1">@</div>
            <div className="text-2xl font-bold text-gray-500">VS</div>
          </div>
          
          <div className="text-left">
            <h3 className="text-xl font-bold text-white">{homeTeam}</h3>
            <p className="text-blue-400 text-sm font-semibold mt-1">
              {getTeamOdds(fdMoneyline, homeTeam)}
            </p>
          </div>
        </div>
      </div>

      {/* REAL Odds Tables */}
      <div className="p-4 bg-gray-900">
        {/* Moneyline */}
        <div className="mb-4">
          <h4 className="text-white font-semibold mb-2 text-sm">Moneyline</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-xs text-gray-400">Team</div>
            <div className="text-xs text-gray-400 text-center">DraftKings</div>
            <div className="text-xs text-gray-400 text-center">FanDuel</div>
            
            <div className="text-sm text-white truncate">{awayTeam}</div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-blue-400 font-mono">
              {getTeamOdds(dkMoneyline, awayTeam)}
            </div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-blue-400 font-mono">
              {getTeamOdds(fdMoneyline, awayTeam)}
            </div>
            
            <div className="text-sm text-white truncate">{homeTeam}</div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-blue-400 font-mono">
              {getTeamOdds(dkMoneyline, homeTeam)}
            </div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-blue-400 font-mono">
              {getTeamOdds(fdMoneyline, homeTeam)}
            </div>
          </div>
        </div>

        {/* Spread */}
        <div className="mb-4">
          <h4 className="text-white font-semibold mb-2 text-sm">Spread</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-xs text-gray-400">Team</div>
            <div className="text-xs text-gray-400 text-center">DraftKings</div>
            <div className="text-xs text-gray-400 text-center">FanDuel</div>
            
            <div className="text-sm text-white truncate">{awayTeam}</div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-green-400 font-mono">
              {dkAwaySpread.line} ({dkAwaySpread.odds})
            </div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-green-400 font-mono">
              {fdAwaySpread.line} ({fdAwaySpread.odds})
            </div>
            
            <div className="text-sm text-white truncate">{homeTeam}</div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-green-400 font-mono">
              {dkHomeSpread.line} ({dkHomeSpread.odds})
            </div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-green-400 font-mono">
              {fdHomeSpread.line} ({fdHomeSpread.odds})
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="mb-4">
          <h4 className="text-white font-semibold mb-2 text-sm">Total</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-xs text-gray-400">Line</div>
            <div className="text-xs text-gray-400 text-center">DraftKings</div>
            <div className="text-xs text-gray-400 text-center">FanDuel</div>
            
            <div className="text-sm text-white">Over {dkTotalData.line}</div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-purple-400 font-mono">
              {dkTotalData.over}
            </div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-purple-400 font-mono">
              {fdTotalData.over}
            </div>
            
            <div className="text-sm text-white">Under {dkTotalData.line}</div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-purple-400 font-mono">
              {dkTotalData.under}
            </div>
            <div className="text-sm text-center bg-gray-800 rounded px-2 py-1 text-purple-400 font-mono">
              {fdTotalData.under}
            </div>
          </div>
        </div>

        {/* Analyzer Toggle Button */}
        <button
          onClick={() => setShowAnalyzer(!showAnalyzer)}
          className={`w-full px-6 py-3 transition-all flex items-center justify-between text-white font-semibold rounded ${
            hasAnalysis 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              : 'bg-gray-700 hover:bg-gray-600 cursor-not-allowed'
          }`}
          disabled={!hasAnalysis}
        >
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <span>Analyzer 10,000</span>
            {hasAnalysis ? (
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${getConfidenceColor(confidence)} border`}>
                {confidence}% Confidence
              </span>
            ) : (
              <span className="ml-2 px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400 border border-gray-600">
                Not Analyzed
              </span>
            )}
          </div>
          {hasAnalysis && (showAnalyzer ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />)}
        </button>

        {/* Analyzer Details - REAL DATA */}
        {showAnalyzer && hasAnalysis && (
          <div className="mt-4 p-4 bg-gray-800 rounded space-y-3">
            {/* The Edge */}
            {analysis.the_edge && (
              <div>
                <div className="text-cyan-400 font-semibold text-sm mb-1">⚡ THE EDGE</div>
                <p className="text-white text-sm">{analysis.the_edge}</p>
              </div>
            )}

            {/* Prediction */}
            {analysis.prediction && (
              <div>
                <div className="text-purple-400 font-semibold text-sm mb-1">🎯 PREDICTION</div>
                <div className="space-y-1 text-sm">
                  <p className="text-white">Winner: <span className="text-cyan-400 font-bold">{analysis.prediction.winner}</span></p>
                  {analysis.prediction.projected_score && (
                    <p className="text-white">Score: <span className="text-cyan-400">{analysis.prediction.projected_score}</span></p>
                  )}
                  <p className="text-white">Spread: <span className="text-green-400">{analysis.prediction.spread_pick}</span> ({analysis.prediction.spread_confidence}%)</p>
                  <p className="text-white">Total: <span className="text-purple-400">{analysis.prediction.total_pick}</span> ({analysis.prediction.total_confidence}%)</p>
                </div>
              </div>
            )}

            {/* Recommended Bets */}
            {analysis.recommended_bets && analysis.recommended_bets.length > 0 && (
              <div>
                <div className="text-yellow-400 font-semibold text-sm mb-1">💰 RECOMMENDED BETS</div>
                <div className="space-y-2">
                  {analysis.recommended_bets.map((bet, idx) => (
                    <div key={idx} className="bg-gray-900/50 p-2 rounded border border-gray-700">
                      <div className="flex justify-between items-start">
                        <span className="text-white font-semibold text-sm">{bet.bet}</span>
                        <span className="text-yellow-400 text-xs">{bet.units || 1}u</span>
                      </div>
                      {bet.best_at && <p className="text-xs text-gray-400 mt-1">Best at: {bet.best_at}</p>}
                      <p className="text-xs text-gray-300 mt-1">{bet.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Trends */}
            {analysis.key_trends && analysis.key_trends.length > 0 && (
              <div>
                <div className="text-blue-400 font-semibold text-sm mb-1">📊 KEY TRENDS</div>
                <ul className="space-y-1">
                  {analysis.key_trends.map((trend, idx) => (
                    <li key={idx} className="text-xs text-gray-300">• {trend}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weather */}
            {analysis.weather_impact && (
              <div>
                <div className="text-orange-400 font-semibold text-sm mb-1">🌤️ WEATHER</div>
                <p className="text-white text-xs">{analysis.weather_impact}</p>
              </div>
            )}

            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-500">Game ID: {game.id}</p>
              {game.analyzed_at && (
                <p className="text-xs text-gray-500">Analyzed: {new Date(game.analyzed_at).toLocaleString()}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}