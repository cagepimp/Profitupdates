
import React, { useState } from "react";
import { Loader2, RefreshCw, Database, TestTube, Wrench, AlertCircle, CheckCircle, Calculator, BarChart3, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DevToolsSidebar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});

  const runScript = async (scriptName, displayName) => {
    setLoading(prev => ({ ...prev, [scriptName]: true }));
    setResults(prev => ({ ...prev, [scriptName]: null }));

    try {
      // Replace with your actual function imports
      const response = await fetch(`/api/dev/${scriptName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [scriptName]: {
          success: data.success,
          message: data.message || `${displayName} completed successfully`,
          details: data.details
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [scriptName]: {
          success: false,
          message: error.message || `${displayName} failed`,
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [scriptName]: false }));
    }
  };

  const tools = [
    {
      id: 'multiSportOdds',
      name: 'Multi-Sport Odds',
      description: 'View and analyze odds across all sports in one dashboard',
      icon: LineChart,
      color: 'green',
      isNavigation: true,
      path: '/MultiSportOdds'
    },
    {
      id: 'predictionHistory',
      name: 'Prediction History',
      description: 'View all analyzed games with accuracy scores, grades, and performance metrics',
      icon: BarChart3,
      color: 'cyan',
      isNavigation: true,
      path: '/PredictionHistory'
    },
    {
      id: 'manualTools',
      name: 'Manual Game Tools',
      description: 'Search games, enter scores manually, and run on-demand analysis',
      icon: Wrench,
      color: 'orange',
      isNavigation: true,
      path: '/ManualTools'
    },
    {
      id: 'updateMarketCache',
      name: 'Refresh Full Slate',
      description: 'Calls updateMarketCache.js to refresh odds + game data across all sports',
      icon: RefreshCw,
      color: 'blue'
    },
    {
      id: 'clearGameCache',
      name: 'Clear Game Cache',
      description: 'Clears cached game data',
      icon: Database,
      color: 'red'
    },
    {
      id: 'updatePropsAnalyzer',
      name: 'Trigger Props Analyzer',
      description: 'Runs updatePropsAnalyzer.js to compute top team & player props',
      icon: TestTube,
      color: 'purple'
    },
    {
      id: 'rebuildEntityCache',
      name: 'Rebuild Entity Cache',
      description: 'Clears and rebuilds the Game entity in the database',
      icon: Database,
      color: 'orange'
    },
    {
      id: 'testSportsbooks',
      name: 'Test Sportsbooks API',
      description: 'Runs testSportsbooks.js (checks live DraftKings + FanDuel + Odds API)',
      icon: TestTube,
      color: 'green'
    },
    {
      id: 'testDraftKingsNFL',
      name: 'Test DraftKings NFL Fetch',
      description: 'Runs testDraftKingsNFL.js (pulls raw NFL data directly from DK)',
      icon: TestTube,
      color: 'blue'
    },
    {
      id: 'reformatOddsData',
      name: 'Reformat Odds Data',
      description: 'Runs reformatOddsData.js (normalizes markets for consistent odds display)',
      icon: Wrench,
      color: 'yellow'
    },
    {
      id: 'forceAnalyzerRebuild',
      name: 'Force Analyzer Rebuild',
      description: 'Triggers full recalculation of the 10,000 Analyzer across all sports',
      icon: RefreshCw,
      color: 'purple'
    },
    {
      id: 'clearAllCacheSafe',
      name: 'Clear All Cache (Safe Mode)',
      description: 'Clears entities + memory caches in small batches (prevents crashes)',
      icon: Database,
      color: 'red'
    },
    {
      id: 'propsAnalyzerDebug',
      name: 'Props & Analyzer Page Debug',
      description: 'Used to verify top 50 player props + Analyzer scoring page logic',
      icon: TestTube,
      color: 'blue'
    },
    {
      id: 'functionHealthCheck',
      name: 'Function Health Check',
      description: 'Pings all Base44 endpoints and reports failures',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    red: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
    purple: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
    orange: 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800',
    green: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
    yellow: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800',
    cyan: 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800'
  };

  return (
    <div className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-purple-500/20 h-screen overflow-y-auto p-4">
      <div className="mb-6 pb-4 border-b border-purple-500/20">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          🛠️ Dev Tools
        </h2>
        <p className="text-gray-400 text-sm">Backend maintenance & debugging</p>
      </div>

      <div className="space-y-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isLoading = loading[tool.id];
          const result = results[tool.id];

          return (
            <div key={tool.id} className="bg-white/5 backdrop-blur-lg rounded-lg p-3 border border-white/10 hover:border-purple-500/30 transition-all">
              <button
                onClick={() => tool.isNavigation ? navigate(tool.path) : runScript(tool.id, tool.name)}
                disabled={isLoading}
                className={`w-full ${colorClasses[tool.color]} text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 disabled:hover:scale-100`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Icon className="w-4 h-4" />
                    {tool.name}
                  </>
                )}
              </button>

              <p className="text-gray-400 text-xs mt-2 leading-relaxed">{tool.description}</p>

              {result && (
                <div
                  className={`mt-3 p-3 rounded-lg text-sm backdrop-blur-lg ${
                    result.success
                      ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                      : 'bg-red-500/20 border border-red-500/50 text-red-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{result.message}</p>
                      {result.details && (
                        <p className="text-xs mt-1 opacity-80 break-words">{result.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-lg">
        <p className="text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>These tools directly modify production data. Use with caution.</span>
        </p>
      </div>
    </div>
  );
}
