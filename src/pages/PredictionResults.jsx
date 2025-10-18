import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Download, Filter, CheckCircle, XCircle, Award } from 'lucide-react';
import base44 from '@/api/base44Client';

export default function PredictionHistory() {
  const [selectedSport, setSelectedSport] = useState('NFL');
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('stats'); // 'stats', 'games', 'insights'

  useEffect(() => {
    loadHistory();
  }, [selectedSport]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      console.log(`📊 Loading prediction history for ${selectedSport}...`);
      
      const response = await base44.functions.invoke('predictionHistory', {
        action: 'getHistory',
        sport: selectedSport,
        limit: 100,
        includeAccuracy: true
      });

      if (response.data?.success) {
        setHistoryData(response.data);
        console.log('✅ History loaded:', response.data);
      } else {
        throw new Error(response.data?.message || 'Failed to load history');
      }
    } catch (error) {
      console.error('❌ Error loading history:', error);
      alert(`Error loading history: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      setLoading(true);
      const response = await base44.functions.invoke('predictionHistory', {
        action: 'getTrends',
        sport: selectedSport
      });

      if (response.data?.success) {
        console.log('📈 Insights loaded:', response.data);
        return response.data.trends;
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!historyData?.history) {
      alert('No data to export');
      return;
    }

    try {
      const headers = ['Date', 'Matchup', 'Sport', 'Predicted Winner', 'Actual Winner', 'Confidence', 'Accuracy %', 'Grade'];
      const rows = historyData.history.map(game => [
        game.game_date,
        game.matchup,
        game.sport,
        game.prediction?.winner || 'N/A',
        game.actual_result?.winner || 'Pending',
        game.prediction?.confidence || '',
        game.accuracy?.accuracy_percentage || '',
        game.accuracy?.grade || ''
      ]);

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prediction_history_${selectedSport}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      console.log('✅ CSV exported');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white p-6">
      {/* Loading Indicator */}
      {loading && (
        <div className="fixed top-4 right-4 bg-purple-600 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <TrendingUp className="animate-spin" size={16} />
          Loading...
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/MultiSportOdds'}
            className="bg-purple-700 hover:bg-purple-600 p-2 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold">📊 Prediction History</h1>
            <p className="text-purple-200 mt-1">Training Data • Accuracy Stats • Learning Insights</p>
          </div>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
        >
          <Download size={20} /> Export CSV
        </button>
      </div>

      {/* Sport Tabs */}
      <div className="flex gap-2 mb-6">
        {['NFL', 'CFB', 'NBA', 'MLB', 'UFC', 'Golf'].map(sport => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              selectedSport === sport
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('stats')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            view === 'stats'
              ? 'bg-indigo-600 text-white'
              : 'bg-indigo-900/50 text-indigo-300'
          }`}
        >
          📈 Stats Overview
        </button>
        <button
          onClick={() => setView('games')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            view === 'games'
              ? 'bg-indigo-600 text-white'
              : 'bg-indigo-900/50 text-indigo-300'
          }`}
        >
          🎮 Games History
        </button>
        <button
          onClick={() => { setView('insights'); loadInsights(); }}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            view === 'insights'
              ? 'bg-indigo-600 text-white'
              : 'bg-indigo-900/50 text-indigo-300'
          }`}
        >
          🎓 Learning Insights
        </button>
      </div>

      {/* Stats View */}
      {view === 'stats' && historyData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-600 rounded-lg p-6">
              <div className="text-blue-100 text-sm mb-1">Total Predictions</div>
              <div className="text-4xl font-bold">{historyData.summary.total_predictions}</div>
            </div>
            <div className="bg-green-600 rounded-lg p-6">
              <div className="text-green-100 text-sm mb-1">Overall Accuracy</div>
              <div className="text-4xl font-bold">{historyData.summary.overall_accuracy}%</div>
            </div>
            <div className="bg-purple-600 rounded-lg p-6">
              <div className="text-purple-100 text-sm mb-1">Winner Accuracy</div>
              <div className="text-4xl font-bold">{historyData.summary.winner_accuracy}%</div>
            </div>
            <div className="bg-orange-600 rounded-lg p-6">
              <div className="text-orange-100 text-sm mb-1">Spread Accuracy</div>
              <div className="text-4xl font-bold">{historyData.summary.spread_accuracy}%</div>
            </div>
          </div>

          {/* Completed vs Pending */}
          <div className="bg-indigo-900/40 rounded-lg p-6 border border-indigo-700">
            <div className="text-lg font-bold text-indigo-200 mb-4">Completed vs Pending</div>
            <div className="flex gap-4">
              <div className="flex-1 bg-green-600 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-1">{historyData.summary.completed_games}</div>
                <div className="text-sm">Completed & Verified</div>
              </div>
              <div className="flex-1 bg-yellow-600 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-1">{historyData.summary.pending_games}</div>
                <div className="text-sm">Pending Results</div>
              </div>
            </div>
          </div>

          {/* Accuracy Breakdown */}
          <div className="bg-purple-900/40 rounded-lg p-6 border border-purple-700">
            <div className="text-lg font-bold text-purple-200 mb-4">Accuracy by Bet Type</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-800/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">{historyData.summary.winner_accuracy}%</div>
                <div className="text-sm text-purple-300">Winner Picks</div>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">{historyData.summary.spread_accuracy}%</div>
                <div className="text-sm text-purple-300">Spread Picks</div>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">{historyData.summary.total_accuracy}%</div>
                <div className="text-sm text-purple-300">Total Picks</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Games View */}
      {view === 'games' && historyData && (
        <div className="space-y-4">
          {historyData.history.length === 0 ? (
            <div className="text-center py-12 text-purple-300">
              <Award size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No completed predictions yet.</p>
              <p className="text-sm mt-2">Analyze games and verify results to build your history!</p>
            </div>
          ) : (
            historyData.history.map((game, idx) => (
              <div key={idx} className="bg-purple-900/30 rounded-lg p-6 border-2 border-purple-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{game.matchup}</h3>
                    <p className="text-purple-300 text-sm">{game.sport} • {game.game_date}</p>
                    <p className="text-purple-400 text-xs mt-1">
                      {game.status === 'completed' ? 'Completed' : 'Pending'} • 
                      Analyzed: {new Date(game.analyzed_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {game.accuracy && (
                    <div className="flex items-center gap-2">
                      <div className={`px-4 py-2 rounded-lg text-lg font-bold ${
                        game.accuracy.grade === 'A' ? 'bg-green-600' :
                        game.accuracy.grade === 'B' ? 'bg-blue-600' :
                        game.accuracy.grade === 'C' ? 'bg-yellow-600' :
                        game.accuracy.grade === 'D' ? 'bg-orange-600' :
                        'bg-red-600'
                      }`}>
                        Grade: {game.accuracy.grade}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{game.accuracy.accuracy_percentage}%</div>
                        <div className="text-xs text-purple-300">Accuracy</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Prediction */}
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <div className="text-purple-300 text-xs font-semibold mb-2">AI PREDICTION</div>
                    <div className="space-y-1">
                      {game.prediction?.winner && (
                        <div className="text-sm">Winner: <span className="text-cyan-400 font-bold">{game.prediction.winner}</span></div>
                      )}
                      {game.prediction?.confidence && (
                        <div className="text-sm">Confidence: <span className="text-green-400 font-bold">{game.prediction.confidence}%</span></div>
                      )}
                      {game.prediction?.spread && (
                        <div className="text-sm">Spread: <span className="text-cyan-400 font-bold">{game.prediction.spread}</span></div>
                      )}
                      {game.prediction?.total && (
                        <div className="text-sm">Total: <span className="text-cyan-400 font-bold">{game.prediction.total}</span></div>
                      )}
                    </div>
                  </div>

                  {/* Actual Result */}
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <div className="text-purple-300 text-xs font-semibold mb-2">ACTUAL RESULT</div>
                    {game.actual_result ? (
                      <div className="space-y-1">
                        <div className="text-sm">Winner: <span className="text-cyan-400 font-bold">{game.actual_result.winner}</span></div>
                        <div className="text-sm">Score: <span className="text-white font-bold">{game.actual_result.away_score} - {game.actual_result.home_score}</span></div>
                      </div>
                    ) : (
                      <div className="text-yellow-400 text-sm">Pending</div>
                    )}
                  </div>
                </div>

                {/* Accuracy Breakdown */}
                {game.accuracy && (
                  <div className="flex gap-2">
                    <div className={`flex-1 text-center py-2 rounded text-sm font-semibold ${
                      game.accuracy.winner_correct ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'
                    }`}>
                      Winner {game.accuracy.winner_correct ? '✓' : '✗'}
                    </div>
                    <div className={`flex-1 text-center py-2 rounded text-sm font-semibold ${
                      game.accuracy.spread_correct ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'
                    }`}>
                      Spread {game.accuracy.spread_correct ? '✓' : '✗'}
                    </div>
                    <div className={`flex-1 text-center py-2 rounded text-sm font-semibold ${
                      game.accuracy.total_correct ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'
                    }`}>
                      Total {game.accuracy.total_correct ? '✓' : '✗'}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Insights View */}
      {view === 'insights' && (
        <div className="bg-indigo-900/40 rounded-lg p-8 border border-indigo-700 text-center">
          <TrendingUp size={64} className="mx-auto mb-4 text-indigo-400 opacity-50" />
          <h3 className="text-xl font-bold mb-2">Learning Insights</h3>
          <p className="text-indigo-300 mb-4">
            Run the Learning Algorithm from the Multi-Sport Odds page (need 5+ verified games)
          </p>
          <button
            onClick={() => window.location.href = '/MultiSportOdds'}
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-semibold transition"
          >
            Go to Analysis Page
          </button>
        </div>
      )}

      {!historyData && !loading && (
        <div className="text-center py-12 text-purple-300">
          <p className="text-lg">Loading prediction history...</p>
        </div>
      )}
    </div>
  );
}