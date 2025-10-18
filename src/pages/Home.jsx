import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSlatesForSport } from "@/api/functions";
import { updateMarketCache } from "@/api/functions";
import { clearCacheIteratively } from "@/api/functions";
import { testSportsbooks } from "@/api/functions";
import { testDraftKingsNFL } from "@/api/functions";
import { reformatOddsData } from "@/api/functions";
import { runAnalyzerPropsV3 } from "@/api/functions";
import { runAnalyzer10000Plus } from "@/api/functions";
import { testOddsAPI } from "@/api/functions";
import GameCard from "@/components/sports/GameCard";
import AnalysisModal from "@/components/sports/AnalysisModal";
import { Loader2, RefreshCw, Database, TestTube, Wrench, AlertCircle, CheckCircle, X, Users, Brain, TrendingUp, Target, Zap } from "lucide-react";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const SPORT_KEY_MAP = {
  'NFL': 'americanfootball_nfl',
  'CFB': 'americanfootball_ncaaf',
  'NCAAF': 'americanfootball_ncaaf',
  'NBA': 'basketball_nba',
  'MLB': 'baseball_mlb',
  'UFC': 'mma_mixed_martial_arts',
  'MMA': 'mma_mixed_martial_arts',
  'GOLF': 'golf_masters',
  'NHL': 'icehockey_nhl'
};

const getSportKey = (sport) => {
  return SPORT_KEY_MAP[sport?.toUpperCase()] || 'americanfootball_nfl';
};

export default function Home() {
  const query = useQuery();
  const sport = query.get("sport")?.toUpperCase();
  const showDevTools = query.get("devtools") === "true";

  const [games, setGames] = useState([]);
  const [debug, setDebug] = useState("");
  const [loading, setLoading] = useState(true);
  const [toolLoading, setToolLoading] = useState({});
  const [toolResults, setToolResults] = useState({});
  const [selectedSport, setSelectedSport] = useState(sport || 'NFL');
  const [analysisResults, setAnalysisResults] = useState({});
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);

  useEffect(() => {
    if (sport) {
      setSelectedSport(sport);
    }
  }, [sport]);

  useEffect(() => {
    if (!sport) {
      setLoading(false);
      return;
    }

    const dateFrom = query.get("dateFrom") || new Date().toISOString();
    const dateTo = query.get("dateTo") || new Date("2025-12-31T23:59:59Z").toISOString();

    let cancelled = false;

    const fetchGames = async () => {
      setLoading(true);
      setDebug(`Fetching ${sport} games...`);
      setGames([]);

      try {
        console.log(`[Home] Fetching games for ${sport}`);

        const res = await getSlatesForSport({ sport, dateFrom, dateTo });
        const data = res?.data || res;

        if (cancelled) return;

        if (data?.success) {
          const gamesList = data.games || [];
          setGames(gamesList);
          setDebug(`✅ Loaded ${gamesList.length} ${sport} game${gamesList.length !== 1 ? 's' : ''}`);

          if (gamesList.length === 0) {
            setDebug(`⚠️ No ${sport} games found for the selected date range`);
          }
        } else {
          setGames([]);
          setDebug(`❌ ${data?.error || data?.message || "Failed to load games"}`);
        }
      } catch (error) {
        if (error.message === 'Request aborted' || cancelled) return;

        setGames([]);
        setDebug(`❌ Error: ${error?.message || String(error)}`);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchGames();

    return () => {
      cancelled = true;
    };
  }, [sport]);

  const handleAnalyzeGame = async (game, analysisType = 'game') => {
    try {
      console.log(`🧠 Analyzing ${analysisType} for game:`, game.id);
      const analysisKey = `${game.id}_${analysisType}`;
      setAnalysisResults(prev => ({ ...prev, [analysisKey]: { loading: true } }));

      let injuryData = [];
      try {
        const { fetchInjuries } = await import('@/api/functions');
        const injResponse = await fetchInjuries({ sport });
        if (injResponse?.data?.injuries) {
          const homeTeam = game.home_team || game.home || '';
          const awayTeam = game.away_team || game.away || '';

          injuryData = injResponse.data.injuries.filter(inj => {
            const teamAbbr = inj.team_abbr?.toLowerCase() || '';
            const home = homeTeam?.toLowerCase() || '';
            const away = awayTeam?.toLowerCase() || '';

            return (
              home.includes(teamAbbr) ||
              away.includes(teamAbbr) ||
              teamAbbr.includes(home.split(' ').pop()) ||
              teamAbbr.includes(away.split(' ').pop())
            );
          });
        }
      } catch (injError) {
        console.warn('Could not fetch injury data:', injError);
      }

      let response;

      if (analysisType === 'player_props') {
        response = await runAnalyzerPropsV3({
          sport: sport,
          gameId: game.id,
          analysisType: 'player'
        });
      } else if (analysisType === 'team_props') {
        response = await runAnalyzerPropsV3({
          sport: sport,
          gameId: game.id,
          analysisType: 'team'
        });
      } else {
        response = await runAnalyzer10000Plus({
          sport: sport,
          gameId: game.id
        });
      }

      const data = response?.data || response;
      console.log(`✅ ${analysisType} analysis result:`, data);

      if (data?.success && data?.results && data.results.length > 0) {
        const analysis = data.results[0].analysis;

        setAnalysisResults(prev => ({
          ...prev,
          [analysisKey]: {
            loading: false,
            data: analysis,
            type: analysisType
          }
        }));

        console.log('✅ Analysis saved:', analysisKey, analysis);
      } else {
        throw new Error(data?.error || data?.message || 'Analysis failed - no results returned');
      }
    } catch (error) {
      console.error(`❌ ${analysisType} analysis error:`, error);
      const analysisKey = `${game.id}_${analysisType}`;
      setAnalysisResults(prev => ({
        ...prev,
        [analysisKey]: {
          loading: false,
          error: error.message
        }
      }));
      alert(`❌ Analysis failed: ${error.message}`);
    }
  };

  const runTool = async (toolId, toolName, toolFunction, sportToUse) => {
    setToolLoading(prev => ({ ...prev, [toolId]: true }));
    setToolResults(prev => ({ ...prev, [toolId]: null }));

    try {
      const sportKey = getSportKey(sportToUse);
      console.log(`Running ${toolName} for sport: ${sportToUse} (key: ${sportKey})`);

      const response = await toolFunction({ sport_key: sportKey });
      const data = response?.data || response;

      setToolResults(prev => ({
        ...prev,
        [toolId]: {
          success: data.success !== false,
          message: data.message || `${toolName} completed for ${sportToUse}`,
          details: `Sport: ${sportKey}\n${JSON.stringify(data, null, 2).substring(0, 200)}`
        }
      }));
    } catch (error) {
      console.error(`${toolName} error:`, error);
      setToolResults(prev => ({
        ...prev,
        [toolId]: {
          success: false,
          message: error.message || `${toolName} failed`,
          details: error.stack || String(error)
        }
      }));
    } finally {
      setToolLoading(prev => ({ ...prev, [toolId]: false }));
    }
  };

  const runToolWithoutSport = async (toolId, toolName, toolFunction) => {
    setToolLoading(prev => ({ ...prev, [toolId]: true }));
    setToolResults(prev => ({ ...prev, [toolId]: null }));

    try {
      console.log(`Running ${toolName}...`);

      const response = await toolFunction({});
      const data = response?.data || response;

      setToolResults(prev => ({
        ...prev,
        [toolId]: {
          success: data.success !== false,
          message: data.message || `${toolName} completed`,
          details: JSON.stringify(data, null, 2).substring(0, 300)
        }
      }));
    } catch (error) {
      console.error(`${toolName} error:`, error);
      setToolResults(prev => ({
        ...prev,
        [toolId]: {
          success: false,
          message: error.message || `${toolName} failed`,
          details: error.stack || String(error)
        }
      }));
    } finally {
      setToolLoading(prev => ({ ...prev, [toolId]: false }));
    }
  };

  const tools = [
    { id: 'testAPI', name: 'Test Odds API', func: testOddsAPI, icon: CheckCircle, color: 'green' },
    { id: 'refresh', name: 'Refresh Full Slate', func: updateMarketCache, icon: RefreshCw, color: 'blue' },
    { id: 'clearCache', name: 'Clear Cache', func: clearCacheIteratively, icon: Database, color: 'red' },
    { id: 'props', name: 'Props Analyzer', func: runAnalyzerPropsV3, icon: TestTube, color: 'purple' },
    { id: 'testSB', name: 'Test Sportsbooks', func: testSportsbooks, icon: TestTube, color: 'green' },
    { id: 'testDK', name: 'Test DraftKings', func: testDraftKingsNFL, icon: TestTube, color: 'blue' },
    { id: 'reformat', name: 'Reformat Odds', func: reformatOddsData, icon: Wrench, color: 'yellow' },
  ];

  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    red: 'bg-red-600 hover:bg-red-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    green: 'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700'
  };

  if (showDevTools) {
    const currentSportKey = getSportKey(selectedSport);

    return (
      <main className="flex-1 p-6 bg-gray-900 text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">🛠️ Developer Tools</h1>
              <div className="mt-3">
                <label className="text-sm text-gray-400 mr-2">Select Sport:</label>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 text-sm"
                >
                  <option value="NFL">NFL</option>
                  <option value="CFB">CFB</option>
                  <option value="NBA">NBA</option>
                  <option value="MLB">MLB</option>
                  <option value="UFC">UFC</option>
                  <option value="GOLF">Golf</option>
                </select>
                <span className="ml-3 text-xs text-gray-500">({currentSportKey})</span>
              </div>
            </div>
            <a href="?sport=NFL" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
              <X className="w-5 h-5" /> Close
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isLoading = toolLoading[tool.id];
              const result = toolResults[tool.id];

              return (
                <div key={tool.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <button
                    onClick={() => runTool(tool.id, tool.name, tool.func, selectedSport)}
                    disabled={isLoading}
                    className={`w-full ${colorClasses[tool.color]} text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-3`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Icon className="w-5 h-5" />
                        {tool.name}
                      </>
                    )}
                  </button>

                  {result && (
                    <div
                      className={`p-3 rounded-lg text-sm ${result.success
                          ? 'bg-green-900/30 border border-green-500 text-green-300'
                          : 'bg-red-900/30 border border-red-500 text-red-300'
                        }`}
                    >
                      <div className="flex items-start gap-2">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 overflow-hidden">
                          <p className="font-semibold">{result.message}</p>
                          {result.details && (
                            <pre className="text-xs mt-1 opacity-80 whitespace-pre-wrap break-words">{result.details}</pre>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <button
                onClick={async () => {
                  const { updateAllRosters } = await import('@/api/functions');
                  runToolWithoutSport('updateRosters', 'Update All Rosters', updateAllRosters);
                }}
                disabled={toolLoading.updateRosters}
                className={`w-full ${colorClasses.indigo} text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-3`}
              >
                {toolLoading.updateRosters ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    Update All Rosters
                  </>
                )}
              </button>

              {toolResults.updateRosters && (
                <div
                  className={`p-3 rounded-lg text-sm ${toolResults.updateRosters.success
                      ? 'bg-green-900/30 border border-green-500 text-green-300'
                      : 'bg-red-900/30 border border-red-500 text-red-300'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    {toolResults.updateRosters.success ? (
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold">{toolResults.updateRosters.message}</p>
                      {toolResults.updateRosters.details && (
                        <pre className="text-xs mt-1 opacity-80 whitespace-pre-wrap break-words">{toolResults.updateRosters.details}</pre>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-sm text-red-300">
              ⚠️ These tools directly modify production data. Use with caution.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!sport) {
    return (
      <main className="flex-1 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '700ms'}}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-8 py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full mb-6">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-semibold">AI-Powered Sports Analytics</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Welcome to Your
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Sports Dashboard
                </span>
              </h1>
              
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Prophet.AI uses advanced machine learning to analyze thousands of data points across NFL, CFB, NBA, MLB, UFC, and Golf
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <a href="?sport=NFL" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg">
                  View NFL Games
                </a>
                <a href="?sport=NFL&devtools=true" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all border border-white/20 backdrop-blur-sm">
                  Developer Tools
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Analysis</h3>
                <p className="text-gray-400 text-sm">Advanced ML models analyze thousands of data points to find edges</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Live Odds</h3>
                <p className="text-gray-400 text-sm">Real-time odds from DraftKings, FanDuel, and more</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Player Props</h3>
                <p className="text-gray-400 text-sm">Detailed prop analysis with confidence ratings and trends</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/30 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Get Started in 3 Steps</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold">
                    1
                  </div>
                  <h3 className="text-white font-bold mb-2">Choose Sport</h3>
                  <p className="text-gray-400 text-sm">Select from the sidebar</p>
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold">
                    2
                  </div>
                  <h3 className="text-white font-bold mb-2">View Analysis</h3>
                  <p className="text-gray-400 text-sm">Browse AI insights</p>
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold">
                    3
                  </div>
                  <h3 className="text-white font-bold mb-2">Make Bets</h3>
                  <p className="text-gray-400 text-sm">Find value plays</p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-purple-400 mb-1">6</div>
                <div className="text-gray-400 text-sm">Sports</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-pink-400 mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Updates</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-blue-400 mb-1">AI</div>
                <div className="text-gray-400 text-sm">Powered</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-green-400 mb-1">∞</div>
                <div className="text-gray-400 text-sm">Data Points</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 bg-blue-950 text-blue-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Today's Slate — {sport}
        </h1>

        <div className="text-sm mb-6 text-blue-400 font-mono bg-blue-900/30 p-3 rounded">
          {debug}
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="inline-block w-12 h-12 animate-spin text-white mb-4" />
            <p className="text-blue-400">Loading {sport} games...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">🏈</div>
            <p className="text-xl text-blue-300 mb-2">No {sport} games found</p>
            <p className="text-sm text-blue-500 mb-4">
              Try running "Refresh Full Slate" from Developer Tools
            </p>
            <a 
              href={`?sport=${sport}&devtools=true`}
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Open Developer Tools
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {games.map((g) => {
              const gameAnalysisKey = `${g.id}_game`;
              const playerPropsKey = `${g.id}_player_props`;
              const teamPropsKey = `${g.id}_team_props`;

              const gameAnalysis = analysisResults[gameAnalysisKey];
              const playerPropsAnalysis = analysisResults[playerPropsKey];
              const teamPropsAnalysis = analysisResults[teamPropsKey];

              const combinedAnalysis = {
                ...gameAnalysis?.data,
                ...playerPropsAnalysis?.data,
                ...teamPropsAnalysis?.data
              };
              
              return (
                <GameCard 
                  key={g.id || `${g.away_team}@${g.home_team}-${g.commence_time}`} 
                  game={g}
                  sport={sport}
                  onAnalyze={handleAnalyzeGame}
                  analysisData={combinedAnalysis}
                />
              );
            })}
          </div>
        )}
      </div>

      {showAnalysisModal && currentAnalysis && (
        <AnalysisModal
          analysis={currentAnalysis}
          game={currentGame}
          sport={sport}
          onClose={() => {
            setShowAnalysisModal(false);
            setCurrentAnalysis(null);
            setCurrentGame(null);
          }}
        />
      )}
    </main>
  );
}