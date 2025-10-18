import { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Database, TestTube, Wrench, AlertCircle, CheckCircle, X, Users, Zap } from 'lucide-react';

export default function DeveloperTools() {
  const [selectedSport, setSelectedSport] = useState('americanfootball_nfl');
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});
  const [stats, setStats] = useState({
    totalGames: 0,
    totalPlayers: 0,
    apiRequests: 0,
    lastUpdate: null
  });

  const SPORT_OPTIONS = [
    { value: 'americanfootball_nfl', label: 'NFL' },
    { value: 'americanfootball_ncaaf', label: 'CFB' },
    { value: 'basketball_nba', label: 'NBA' },
    { value: 'basketball_ncaab', label: 'CBB' },
    { value: 'baseball_mlb', label: 'MLB' },
    { value: 'icehockey_nhl', label: 'NHL' }
  ];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setStats({
        totalGames: 140,
        totalPlayers: 0,
        apiRequests: 0,
        lastUpdate: new Date().toLocaleTimeString()
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAction = async (actionKey, actionName, importPath, params = {}) => {
    setLoading(prev => ({ ...prev, [actionKey]: true }));
    setResults(prev => ({ ...prev, [actionKey]: null }));
    
    try {
      console.log(`Running ${actionName}...`);
      
      const module = await import(`@/api/functions/${importPath}`);
      const func = module.default || module[importPath];
      const result = await func({ ...params, sport_key: selectedSport });
      
      console.log(`${actionName} complete:`, result);
      
      setResults(prev => ({ 
        ...prev, 
        [actionKey]: { success: true, message: result?.message || 'Completed successfully!' }
      }));
      
      setTimeout(() => loadStats(), 1000);
      
    } catch (error) {
      console.error(`${actionName} failed:`, error);
      setResults(prev => ({ 
        ...prev, 
        [actionKey]: { success: false, message: error.message || 'Operation failed' }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [actionKey]: false }));
      
      setTimeout(() => {
        setResults(prev => ({ ...prev, [actionKey]: null }));
      }, 5000);
    }
  };

  const openManualTools = () => {
    window.location.href = '/ManualTools';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Wrench className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Developer Tools</h1>
              <p className="text-gray-400">Administrative tools and performance tracking</p>
            </div>
          </div>
          <a href="/Home?sport=NFL" className="text-gray-400 hover:text-white flex items-center gap-2">
            <X className="w-5 h-5" /> Close
          </a>
        </div>

        <div className="bg-orange-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📋</span>
            <h2 className="text-2xl font-bold text-gray-900">Manual Game Tools</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Search for games, manually enter scores, calculate accuracy, and run on-demand analysis
          </p>
          <button
            onClick={openManualTools}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-semibold transition-colors"
          >
            📋 Open Manual Tools
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎯</span>
            <h2 className="text-2xl font-bold">Sport Selection</h2>
          </div>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {SPORT_OPTIONS.map(sport => (
              <option key={sport.value} value={sport.value}>{sport.label}</option>
            ))}
          </select>
          <p className="text-gray-400 mt-2">Selected: {selectedSport}</p>
        </div>

        {/* Analyzer 10000+ Learning Section */}
        <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🧠</span>
            <span className="text-2xl">⚡</span>
            <h2 className="text-2xl font-bold text-gray-900">Analyzer 10000+ Learning Center</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Runs 10,000+ iterations on each game - Train the AI by entering results and tracking accuracy
          </p>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/MultiSportOdds"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700"
            >
              🧠 Train AI with Game Results
            </a>
            <a
              href="/PredictionHistory"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:from-cyan-700 hover:to-blue-700"
            >
              📊 View Learning Progress
            </a>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">⚡</span>
            <h2 className="text-2xl font-bold">Quick Developer Actions</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => handleAction('testOddsAPI', 'Test Odds API', 'testOddsAPI')}
              disabled={loading.testOddsAPI}
              className="bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {loading.testOddsAPI ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Test Odds API
                </>
              )}
            </button>

            <button
              onClick={() => handleAction('refreshSlate', 'Refresh Full Slate', 'updateMarketCache')}
              disabled={loading.refreshSlate}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {loading.refreshSlate ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Refresh Full Slate
                </>
              )}
            </button>

            <button
              onClick={() => handleAction('clearCacheBtn', 'Clear Cache', 'clearCacheIteratively')}
              disabled={loading.clearCacheBtn}
              className="bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {loading.clearCacheBtn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Clear Cache
                </>
              )}
            </button>

            <button
              onClick={() => handleAction('propsAnalyzerBtn', 'Props Analyzer', 'runAnalyzerPropsV3')}
              disabled={loading.propsAnalyzerBtn}
              className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {loading.propsAnalyzerBtn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <TestTube className="w-5 h-5" />
                  Props Analyzer
                </>
              )}
            </button>

            <button
              onClick={() => handleAction('testSportsbooks', 'Test Sportsbooks', 'testSportsbooks')}
              disabled={loading.testSportsbooks}
              className="bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {loading.testSportsbooks ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <TestTube className="w-5 h-5" />
                  Test Sportsbooks
                </>
              )}
            </button>

            <button
              onClick={() => handleAction('testDraftKings', 'Test DraftKings', 'testDraftKingsNFL')}
              disabled={loading.testDraftKings}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {loading.testDraftKings ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <TestTube className="w-5 h-5" />
                  Test DraftKings
                </>
              )}
            </button>

            <button
              onClick={() => handleAction('reformatOdds', 'Reformat Odds', 'reformatOddsData')}
              disabled={loading.reformatOdds}
              className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {loading.reformatOdds ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Wrench className="w-5 h-5" />
                  Reformat Odds
                </>
              )}
            </button>

            <button
              onClick={() => handleAction('updateRostersBtn', 'Update All Rosters', 'updateAllRosters')}
              disabled={loading.updateRostersBtn}
              className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {loading.updateRostersBtn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  Update All Rosters
                </>
              )}
            </button>
          </div>

          <div className="bg-red-900/20 border border-red-600 rounded-lg p-3 mt-4">
            <p className="text-sm text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>These tools directly modify production data. Use with caution.</span>
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📊</span>
            <h2 className="text-2xl font-bold">Database Tools</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Total Games</div>
              <div className="text-cyan-400 text-3xl font-bold">{stats.totalGames}</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Total Players</div>
              <div className="text-green-400 text-3xl font-bold">{stats.totalPlayers}</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">API Requests</div>
              <div className="text-yellow-400 text-3xl font-bold">{stats.apiRequests}</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Last Update</div>
              <div className="text-purple-400 text-base font-bold">{stats.lastUpdate || 'Never'}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={loadStats}
              disabled={loading.refreshStats}
              className="bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading.refreshStats ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>🔄 Refresh Stats</>
              )}
            </button>
            
            <button
              onClick={() => handleAction('clearCacheDB', 'Clear Cache', 'clearCache')}
              disabled={loading.clearCacheDB}
              className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading.clearCacheDB ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>🗑️ Clear Cache</>
              )}
            </button>
            
            <button
              onClick={() => handleAction('exportPredictions', 'Export Predictions', 'exportPredictions')}
              disabled={loading.exportPredictions}
              className="bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading.exportPredictions ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>💾 Export to CSV</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}