
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Download, RefreshCw, Target, CheckCircle, Clock, Brain } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function MultiSportOdds() {
  const [selectedSport, setSelectedSport] = useState('NFL');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [training, setTraining] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    predictions: 0,
    completed: 0,
    winnerAccuracy: 0,
    spreadAccuracy: 0
  });

  useEffect(() => {
    fetchGames();
  }, [selectedSport]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const gamesData = await base44.entities.Game.filter(
        { sport: selectedSport, status: { $ne: 'completed' } },
        '-game_date',
        50
      );
      setGames(gamesData);
      calculateStats(gamesData);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (gamesData) => {
    const predictions = gamesData.filter(g => g.analysis).length;
    setStats({ predictions, completed: 0, winnerAccuracy: 0, spreadAccuracy: 0 });
  };

  const handleAnalyzeGame = async (gameId) => {
    try {
      setAnalyzing(true);
      const game = games.find(g => g.id === gameId);
      
      const result = await base44.functions.invoke('analyzerV3', {
        sport: game.sport,
        away_team: game.away_team,
        home_team: game.home_team,
        game_date: game.game_date,
        odds: game.odds || {}
      });

      if (result.success) {
        await base44.entities.Game.update(gameId, {
          analysis: result.analysis,
          analyzed_at: new Date().toISOString()
        });
        await fetchGames();
        alert('Game analyzed successfully!');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing game');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleScoreUpdate = (gameId, field, value) => {
    setGames(games.map(game => 
      game.id === gameId ? {
        ...game,
        temp_scores: { ...game.temp_scores, [field]: parseInt(value) || 0 }
      } : game
    ));
  };

  const handleTrainAI = async (gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game?.temp_scores?.away_score && !game?.temp_scores?.home_score) {
      alert('Please enter both scores');
      return;
    }

    try {
      setTraining(true);
      
      const awayScore = game.temp_scores.away_score;
      const homeScore = game.temp_scores.home_score;
      const actualWinner = awayScore > homeScore ? game.away_team : game.home_team;
      
      const predictedWinner = game.analysis?.prediction?.winner;
      const winnerCorrect = predictedWinner === actualWinner;
      
      const actualSpread = awayScore - homeScore;
      const predictedSpread = game.analysis?.prediction?.predictedSpread || 0;
      const spreadCorrect = Math.abs(actualSpread - predictedSpread) <= 3;
      
      const actualTotal = awayScore + homeScore;
      const predictedTotal = game.analysis?.prediction?.predictedTotal || 0;
      const totalCorrect = Math.abs(actualTotal - predictedTotal) <= 3;

      let correctCount = 0;
      if (winnerCorrect) correctCount++;
      if (spreadCorrect) correctCount++;
      if (totalCorrect) correctCount++;
      const accuracyPercentage = Math.round((correctCount / 3) * 100);

      let grade = 'F';
      if (accuracyPercentage >= 90) grade = 'A';
      else if (accuracyPercentage >= 75) grade = 'B';
      else if (accuracyPercentage >= 60) grade = 'C';
      else if (accuracyPercentage >= 50) grade = 'D';

      await base44.entities.Game.update(gameId, {
        away_score: awayScore,
        home_score: homeScore,
        status: 'completed',
        accuracy: {
          winner_correct: winnerCorrect,
          spread_correct: spreadCorrect,
          total_correct: totalCorrect,
          accuracy_percentage: accuracyPercentage,
          grade: grade
        },
        verified_at: new Date().toISOString()
      });

      try {
        const learningResult = await base44.functions.invoke('learningAlgorithm', {
          sport: selectedSport,
          minSampleSize: 1
        });

        if (learningResult.success) {
          await base44.functions.invoke('applyLearning', {
            sport: selectedSport
          });
        }
      } catch (learningError) {
        console.error('Learning error:', learningError);
      }

      await fetchGames();
      alert(`AI Training Complete!\n\nAccuracy: ${accuracyPercentage}% (Grade: ${grade})\nWinner: ${winnerCorrect ? 'Correct' : 'Incorrect'}\nSpread: ${spreadCorrect ? 'Correct' : 'Incorrect'}\nTotal: ${totalCorrect ? 'Correct' : 'Incorrect'}\n\nAnalyzer 10000+ updated!`);

    } catch (error) {
      console.error('Error training AI:', error);
      alert('Error training AI');
    } finally {
      setTraining(false);
    }
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.away_team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.home_team?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-6xl mb-4">⚡</div>
        <div className="text-2xl font-bold">Loading games...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">🍎 Sports AI Training Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-600 rounded-lg p-6">
          <div className="text-sm mb-1">Predictions</div>
          <div className="text-4xl font-bold">{stats.predictions}</div>
        </div>
        <div className="bg-orange-600 rounded-lg p-6">
          <div className="text-sm mb-1">Completed</div>
          <div className="text-4xl font-bold">{stats.completed}</div>
        </div>
        <div className="bg-green-600 rounded-lg p-6">
          <div className="text-sm mb-1">Winner Accuracy</div>
          <div className="text-4xl font-bold">{stats.winnerAccuracy}%</div>
        </div>
        <div className="bg-purple-600 rounded-lg p-6">
          <div className="text-sm mb-1">Spread Accuracy</div>
          <div className="text-4xl font-bold">{stats.spreadAccuracy}%</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['NFL', 'CFB', 'NBA', 'MLB', 'UFC', 'Golf'].map(sport => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-6 py-3 rounded-lg font-semibold ${
              selectedSport === sport ? 'bg-purple-600' : 'bg-purple-900/50'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      <div className="bg-purple-900/50 rounded-lg p-4 mb-6">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white"
        />
      </div>

      <div className="space-y-6">
        {filteredGames.map(game => (
          <div key={game.id} className="bg-purple-900/30 rounded-lg p-6 border-2 border-purple-700">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">{game.away_team} @ {game.home_team}</h3>
                <p className="text-sm text-purple-300">{game.sport} • {game.game_date}</p>
              </div>
              {game.analysis ? (
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 flex items-center gap-2">
                  <CheckCircle size={16} /> Analyzed
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 flex items-center gap-2">
                  <Clock size={16} /> Not Analyzed
                </div>
              )}
            </div>

            {game.analysis && (
              <>
                <div className="bg-purple-600/40 rounded-lg p-5 mb-4">
                  <div className="text-sm font-bold mb-3">🤖 AI PREDICTION</div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs mb-1">Winner</div>
                      <div className="text-lg font-bold">{game.analysis.prediction?.winner}</div>
                    </div>
                    <div>
                      <div className="text-xs mb-1">Confidence</div>
                      <div className="text-lg font-bold">{game.analysis.prediction?.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-xs mb-1">Spread</div>
                      <div className="text-lg font-bold">{game.analysis.prediction?.predictedSpread}</div>
                    </div>
                    <div>
                      <div className="text-xs mb-1">Total</div>
                      <div className="text-lg font-bold">{game.analysis.prediction?.predictedTotal}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-800/30 rounded-lg p-4 mb-4">
                  <div className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Brain size={20} className="text-green-400" />
                    ENTER SCORES TO TRAIN AI
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs block mb-1">{game.away_team} Score</label>
                      <input
                        type="number"
                        value={game.temp_scores?.away_score || ''}
                        onChange={(e) => handleScoreUpdate(game.id, 'away_score', e.target.value)}
                        className="w-full px-4 py-2 bg-purple-700/50 border border-purple-600 rounded-lg text-white text-lg font-bold"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs block mb-1">{game.home_team} Score</label>
                      <input
                        type="number"
                        value={game.temp_scores?.home_score || ''}
                        onChange={(e) => handleScoreUpdate(game.id, 'home_score', e.target.value)}
                        className="w-full px-4 py-2 bg-purple-700/50 border border-purple-600 rounded-lg text-white text-lg font-bold"
                      />
                    </div>
                    <button
                      onClick={() => handleTrainAI(game.id)}
                      disabled={training}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                      <Brain size={20} /> {training ? 'Training...' : 'Train AI'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {!game.analysis && (
              <button 
                onClick={() => handleAnalyzeGame(game.id)}
                disabled={analyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg py-4 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Target size={24} /> {analyzing ? 'Analyzing...' : 'Analyze Game'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
