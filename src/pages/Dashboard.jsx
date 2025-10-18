import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function DeveloperTools() {
  const [selectedSport, setSelectedSport] = useState('americanfootball_nfl');
  const [loading, setLoading] = useState({});
  const [actionResults, setActionResults] = useState({});
  const [stats, setStats] = useState({
    totalGames: 0,
    totalPlayers: 0,
    apiRequests: 0,
    lastUpdate: null
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const games = await base44.entities.Game.list();
      const players = await base44.entities.Player?.list?.() || [];
      
      setStats({
        totalGames: games.length,
        totalPlayers: players.length,
        apiRequests: 0,
        lastUpdate: new Date().toLocaleTimeString()
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAction = async (actionName, functionName, params = {}) => {
    setLoading(prev => ({ ...prev, [actionName]: true }));
    setActionResults(prev => ({ ...prev, [actionName]: null }));
    
    try {
      console.log(`🚀 Running ${actionName}...`);
      
      const result = await base44.functions.invoke(functionName, params);
      
      console.log(`✅ ${actionName} complete:`, result);
      
      setActionResults(prev => ({ 
        ...prev, 
        [actionName]: { success: true, message: 'Completed successfully!' }
      }));
      
      // Auto-refresh stats after action completes
      setTimeout(() => loadStats(), 1000);
      
    } catch (error) {
      console.error(`❌ ${actionName} failed:`, error);
      setActionResults(prev => ({ 
        ...prev, 
        [actionName]: { success: false, message: error.message }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [actionName]: false }));
      
      // Clear result after 5 seconds
      setTimeout(() => {
        setActionResults(prev => ({ ...prev, [actionName]: null }));
      }, 5000);
    }
  };

  const ActionButton = ({ actionName, functionName, params, className, children, variant = 'default' }) => {
    const isLoading = loading[actionName];
    const result = actionResults[actionName];
    
    const baseClass = "w-full py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2";
    
    const variants = {
      default: "bg-blue-600 hover:bg-blue-700 text-white",
      success: "bg-green-600 hover:bg-green-700 text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
      purple: "bg-purple-600 hover:bg-purple-700 text-white",
      teal: "bg-teal-600 hover:bg-teal-700 text-white",
      gradient: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
      orange: "bg-orange-600 hover:bg-orange-700 text-white"
    };
    
    return (
      <div className="relative mb-8">
        <button
          onClick={() => handleAction(actionName, functionName, params)}
          disabled={isLoading}
          className={`${baseClass} ${variants[variant] || className}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Running...
            </>
          ) : (
            children
          )}
        </button>
        
        {result && (
          <div className={`absolute -bottom-6 left-0 right-0 text-sm flex items-center justify-center gap-1 ${
            result.success ? 'text-green-400' : 'text-red-400'
          }`}>
            {result.success ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {result.message}
          </div>
        )}
      </div>
    );
  };

  const openManualTools = () => {
    // Replace with your routing solution:
    // For React Router: navigate('/ManualTools')
    // For Next.js: router.push('/ManualTools')
    window.location.href = '/ManualTools';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🔧</span>
          <div>
            <h1 className="text-3xl font-bold">Developer Tools</h1>
            <p className="text-gray-400">Administrative tools and performance tracking</p>
          </div>
        </div>

        {/* Manual Game Tools */}
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

        {/* Sport Selection */}
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
            <option value="americanfootball_nfl">NFL</option>
            <option value="americanfootball_ncaaf">CFB</option>
            <option value="basketball_nba">NBA</option>
            <option value="basketball_ncaab">CBB</option>
            <option value="baseball_mlb">MLB</option>
            <option value="icehockey_nhl">NHL</option>
          </select>
          <p className="text-gray-400 mt-2">Selected: {selectedSport}</p>
        </div>

        {/* Analyzer 10000+ */}
        <div className="bg-purple-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚡</span>
            <span className="text-2xl">🏆</span>
            <h2 className="text-2xl font-bold text-gray-900">Analyzer 10000+ Performance Tracker</h2>
          </div>
          
          <ActionButton
            actionName="Complete Automation"
            functionName="autoAnalyzeAndVerify"
            params={{ sport: selectedSport }}
            variant="gradient"
          >
            ⚡ Run Complete Automation
          </ActionButton>

          <ActionButton
            actionName="Update Scores & Verify"
            functionName="verifyAnalyzer10000Plus"
            params={{ sport: selectedSport }}
            variant="success"
          >
            🔄 Update All Scores & Verify Accuracy
          </ActionButton>

          <p className="text-gray-600 text-sm mt-2">
            Analyzes all games with Analyzer 10000+, verifies completed predictions, calculates accuracy
          </p>
        </div>

        {/* Roster Management */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">👥</span>
            <h2 className="text-2xl font-bold">Roster Management</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ActionButton
              actionName="Update All Rosters"
              functionName="updateAllRosters"
              variant="default"
            >
              👥 Update ALL Rosters
            </ActionButton>
            <ActionButton
              actionName="Update NFL Only"
              functionName="updateNFLRoster"
              variant="default"
            >
              🏈 Update NFL Only
            </ActionButton>
          </div>
        </div>

        {/* Odds Cache Management */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔄</span>
            <h2 className="text-2xl font-bold">Odds Cache Management</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ActionButton
              actionName="Refresh Full Slate"
              functionName="refreshFullSlate"
              variant="success"
            >
              🔄 Refresh Full Slate
            </ActionButton>
            <ActionButton
              actionName="Test Odds API"
              functionName="testOddsAPI"
              variant="success"
            >
              🧪 Test Odds API
            </ActionButton>
          </div>
        </div>

        {/* Refresh All Sports */}
        <div className="bg-teal-100 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🌊</span>
            <span className="text-2xl">🔄</span>
            <h2 className="text-2xl font-bold text-gray-900">Refresh All Sports Odds</h2>
          </div>
          <ActionButton
            actionName="Refresh All Sports"
            functionName="refreshFullSlateAllSports"
            variant="teal"
          >
            ⚡ Refresh NFL, CFB, NBA, MLB, NHL, UFC
          </ActionButton>
          <p className="text-gray-600 text-sm mt-2">
            Fetches latest odds from sportsbooks for all 6 sports simultaneously
          </p>
        </div>

        {/* Refresh All Sports */}
        <div className="bg-teal-100 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🌊</span>
            <span className="text-2xl">🔄</span>
            <h2 className="text-2xl font-bold text-gray-900">Refresh All Sports Odds</h2>
          </div>
          <ActionButton
            actionName="Refresh All Sports"
            functionName="refreshFullSlateAllSports"
            variant="teal"
          >
            ⚡ Refresh NFL, CFB, NBA, MLB, NHL, UFC
          </ActionButton>
          <p className="text-gray-600 text-sm mt-2">
            Fetches latest odds from sportsbooks for all 6 sports simultaneously
          </p>
        </div>

        {/* Props Analyzer */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎲</span>
            <h2 className="text-2xl font-bold">Props Analyzer</h2>
          </div>
          <ActionButton
            actionName="Run Props Analyzer"
            functionName="analyzeProps"
            params={{ sport: selectedSport }}
            variant="purple"
          >
            🎲 Run Props Analyzer
          </ActionButton>
        </div>

        {/* Database Tools */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📊</span>
            <h2 className="text-2xl font-bold">Database Tools</h2>
          </div>

          {/* Stats Display */}
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

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={loadStats}
              disabled={loading['Refresh Stats']}
              className="bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading['Refresh Stats'] ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>🔄 Refresh Stats</>
              )}
            </button>
            <ActionButton
              actionName="Clear Cache"
              functionName="clearCache"
              variant="danger"
            >
              🗑️ Clear Cache
            </ActionButton>
            <ActionButton
              actionName="Export Predictions"
              functionName="exportPredictions"
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              💾 Export to CSV
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}