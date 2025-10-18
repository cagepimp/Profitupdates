import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function DevPredictionTracker() {
  const [games, setGames] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    correct: 0,
    accuracy: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPredictions();
  }, [selectedSport, filter]);

  const loadPredictions = async () => {
    try {
      // Get all games
      let query = {};
      if (selectedSport !== 'all') {
        query.sport = selectedSport;
      }

      const allGames = await base44.entities.Game.filter(query);
      
      // Filter based on what we want to see
      let filtered = allGames.filter(g => {
        const hasAnalysis = g.analysis && g.analysis.length > 0;
        
        if (filter === 'pending') {
          return hasAnalysis && !g.actual_outcome;
        } else if (filter === 'completed') {
          return hasAnalysis && g.actual_outcome;
        }
        return hasAnalysis; // 'all' with analysis
      });

      // Sort by date
      filtered.sort((a, b) => {
        const dateA = new Date(a.game_date || a.commence_time);
        const dateB = new Date(b.game_date || b.commence_time);
        return dateB - dateA;
      });

      setGames(filtered);
      calculateStats(allGames);
      
    } catch (error) {
      console.error('Error loading predictions:', error);
    }
  };

  const calculateStats = (gamesList) => {
    const withAnalysis = gamesList.filter(g => g.analysis && g.analysis.length > 0);
    const completed = withAnalysis.filter(g => g.actual_outcome);
    const pending = withAnalysis.filter(g => !g.actual_outcome);
    
    let correct = 0;
    completed.forEach(game => {
      const prediction = game.analysis[0]?.predictions?.winner || game.analysis[0]?.prediction;
      const actual = game.actual_outcome?.winner;
      
      if (prediction && actual && prediction === actual) {
        correct++;
      }
    });

    setStats({
      total: withAnalysis.length,
      pending: pending.length,
      completed: completed.length,
      correct: correct,
      accuracy: completed.length > 0 ? ((correct / completed.length) * 100).toFixed(1) : 0
    });
  };

  const handleEnterResult = async (gameId, homeScore, awayScore, homeTeam, awayTeam) => {
    try {
      const winner = parseInt(homeScore) > parseInt(awayScore) ? homeTeam : awayTeam;
      const spread = parseInt(homeScore) - parseInt(awayScore);
      const total = parseInt(homeScore) + parseInt(awayScore);

      await base44.entities.Game.update(gameId, {
        actual_outcome: {
          home_score: parseInt(homeScore),
          away_score: parseInt(awayScore),
          winner: winner,
          final_spread: spread,
          total_points: total
        },
        status: 'completed'
      });

      console.log('✅ Result entered for game:', gameId);
      await loadPredictions();
      
    } catch (error) {
      console.error('Error entering result:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleApplyLearning = async () => {
    if (stats.completed < 5) {
      alert(`Need at least 5 completed predictions to train AI. Currently have ${stats.completed}.`);
      return;
    }

    setLoading(true);
    
    try {
      const sport = selectedSport === 'all' ? 'americanfootball_nfl' : selectedSport;
      
      console.log('🧠 Running learning algorithm...');
      const learningResult = await base44.functions.invoke('learningAlgorithm', {
        sport: sport
      });
      
      console.log('📚 Applying learning to analyzer...');
      const applyResult = await base44.functions.invoke('applyLearning', {
        sport: sport
      });
      
      alert(`✅ AI Training Complete!\n\nProcessed: ${stats.completed} games\nAccuracy: ${stats.accuracy}%\nCorrect: ${stats.correct}/${stats.completed}`);
      
    } catch (error) {
      console.error('❌ Learning failed:', error);
      alert(`Training error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔬 Developer Prediction Tracker</h1>
        <p className="text-gray-400">Track AI predictions, enter results, and train the learning algorithm</p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-gray-400 text-xs mb-1">Total Predictions</div>
          <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-yellow-600">
          <div className="text-gray-400 text-xs mb-1">Pending Results</div>
          <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-green-600">
          <div className="text-gray-400 text-xs mb-1">Completed</div>
          <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-purple-600">
          <div className="text-gray-400 text-xs mb-1">Correct</div>
          <div className="text-3xl font-bold text-purple-400">{stats.correct}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-pink-600">
          <div className="text-gray-400 text-xs mb-1">Accuracy</div>
          <div className="text-3xl font-bold text-pink-400">{stats.accuracy}%</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 flex items-center justify-between gap-4">
        <div className="flex gap-3">
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded border border-gray-600"
          >
            <option value="all">All Sports</option>
            <option value="americanfootball_nfl">NFL</option>
            <option value="americanfootball_ncaaf">CFB</option>
            <option value="basketball_nba">NBA</option>
            <option value="baseball_mlb">MLB</option>
            <option value="icehockey_nhl">NHL</option>
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded border border-gray-600"
          >
            <option value="all">All Predictions</option>
            <option value="pending">Pending Results</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button
          onClick={handleApplyLearning}
          disabled={loading || stats.completed < 5}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Training AI...' : `🧠 Train AI (${stats.completed} results)`}
        </button>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {games.map(game => (
          <PredictionCard 
            key={game.id} 
            game={game} 
            onEnterResult={handleEnterResult}
          />
        ))}

        {games.length === 0 && (
          <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-lg">
            No predictions found for selected filters
          </div>
        )}
      </div>
    </div>
  );
}

function PredictionCard({ game, onEnterResult }) {
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [showForm, setShowForm] = useState(false);

  const analysis = game.analysis?.[0] || {};
  const predictions = analysis.predictions || {};
  const actual = game.actual_outcome;
  
  const predictedWinner = predictions.winner || analysis.prediction;
  const actualWinner = actual?.winner;
  const isCorrect = actualWinner && predictedWinner === actualWinner;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date TBD';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleSubmit = () => {
    if (!homeScore || !awayScore) {
      alert('Enter both scores');
      return;
    }
    onEnterResult(game.id, homeScore, awayScore, game.home_team, game.away_team);
    setHomeScore('');
    setAwayScore('');
    setShowForm(false);
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-5 border-2 ${
      actual ? (isCorrect ? 'border-green-600' : 'border-red-600') : 'border-gray-700'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-blue-600 rounded text-xs font-bold">
            {game.sport}
          </span>
          <span className="text-gray-400 text-sm">{formatDate(game.game_date || game.commence_time)}</span>
        </div>
        
        {actual && (
          <div className={`px-3 py-1 rounded-lg font-bold ${
            isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {isCorrect ? '✅ CORRECT' : '❌ WRONG'}
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="mb-4">
        <div className="text-xl font-bold text-white mb-1">
          {game.away_team} @ {game.home_team}
        </div>
      </div>

      {/* Predictions */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-gray-400 text-xs mb-1">Winner Prediction</div>
            <div className="text-purple-400 font-bold">{predictedWinner || 'N/A'}</div>
            {analysis.confidence && (
              <div className="text-sm text-gray-400">{(analysis.confidence * 100).toFixed(0)}% confidence</div>
            )}
          </div>
          
          {predictions.spread_pick && (
            <div>
              <div className="text-gray-400 text-xs mb-1">Spread Pick</div>
              <div className="text-green-400 font-bold">{predictions.spread_pick}</div>
              {predictions.spread_confidence && (
                <div className="text-sm text-gray-400">{(predictions.spread_confidence * 100).toFixed(0)}%</div>
              )}
            </div>
          )}
          
          {predictions.total_pick && (
            <div>
              <div className="text-gray-400 text-xs mb-1">Total Pick</div>
              <div className="text-orange-400 font-bold">{predictions.total_pick}</div>
              {predictions.total_confidence && (
                <div className="text-sm text-gray-400">{(predictions.total_confidence * 100).toFixed(0)}%</div>
              )}
            </div>
          )}
        </div>

        {analysis.reasoning && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-gray-400 text-xs mb-1">Reasoning</div>
            <div className="text-gray-300 text-sm">{analysis.reasoning}</div>
          </div>
        )}
      </div>

      {/* Actual Result or Enter Form */}
      {actual ? (
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-2">Final Score</div>
          <div className="text-2xl font-bold text-white">
            {game.away_team}: {actual.away_score} - {game.home_team}: {actual.home_score}
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Winner: <span className="text-white font-bold">{actual.winner}</span>
          </div>
        </div>
      ) : (
        <div>
          {showForm ? (
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-600">
              <div className="text-blue-400 font-bold mb-3">Enter Final Score</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{game.away_team}</label>
                  <input
                    type="number"
                    value={awayScore}
                    onChange={(e) => setAwayScore(e.target.value)}
                    className="w-full bg-gray-700 text-white p-2 rounded"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{game.home_team}</label>
                  <input
                    type="number"
                    value={homeScore}
                    onChange={(e) => setHomeScore(e.target.value)}
                    className="w-full bg-gray-700 text-white p-2 rounded"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700"
                >
                  ✅ Submit
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-yellow-600 text-white py-3 rounded-lg font-bold hover:bg-yellow-700"
            >
              📝 Enter Final Score
            </button>
          )}
        </div>
      )}
    </div>
  );
}