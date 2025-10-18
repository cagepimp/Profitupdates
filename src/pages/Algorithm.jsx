import React, { useState, useEffect } from 'react';
import { fetchAnalyzerData } from '@/api/functions';
import { Loader2, TrendingUp, Shield, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AlgorithmPage() {
    const [loading, setLoading] = useState(true);
    const [analyzedGames, setAnalyzedGames] = useState([]);
    const [error, setError] = useState('');
    const [sport, setSport] = useState('nfl');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetchAnalyzerData({ sport });
                if (response.data.success) {
                    setAnalyzedGames(response.data.analyzed);
                } else {
                    setError(response.data.message || 'Failed to fetch analysis.');
                }
            } catch (err) {
                setError(err.message || 'An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [sport]);

    const SportSelector = () => (
        <div className="flex gap-2 mb-6">
            {['nfl', 'nba', 'mlb', 'cfb'].map(s => (
                <button
                    key={s}
                    onClick={() => setSport(s)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${sport === s ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                    {s.toUpperCase()}
                </button>
            ))}
        </div>
    );

    return (
        <main className="flex-1 p-6 bg-slate-950 text-white">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-cyan-400">Algorithm Insights</h1>
                <p className="text-sm text-slate-400">Daily Game Predictions & Prop Analysis</p>
            </div>
            
            <SportSelector />

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                    <p className="ml-3 text-slate-300">Running analysis...</p>
                </div>
            ) : error ? (
                <div className="text-center p-8 bg-red-900/20 rounded-lg">
                    <p className="text-red-400 font-semibold">Error Loading Data</p>
                    <p className="text-slate-400 mt-2">{error}</p>
                </div>
            ) : analyzedGames.length === 0 ? (
                <div className="text-center p-8 bg-slate-800 rounded-lg">
                    <p className="text-slate-300 font-semibold">No Games Analyzed</p>
                    <p className="text-slate-400 mt-2">There are no upcoming games in the cache for {sport.toUpperCase()}. The daily refresh may not have run yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {analyzedGames.map((game, index) => (
                        <Card key={index} className="bg-slate-900 border-slate-700 text-white">
                            <CardHeader>
                                <CardTitle className="text-lg text-cyan-300">{game.game}</CardTitle>
                                <CardDescription className="text-slate-400">{game.weather}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-yellow-400" />
                                        <span className="font-semibold">Projected Winner</span>
                                    </div>
                                    <Badge className="text-base bg-yellow-500/20 text-yellow-300 border-yellow-400">{game.projectedWinner}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm">Model Confidence</span>
                                    </div>
                                    <span className="font-mono text-lg">{game.modelConfidence}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm">Projected Total</span>
                                    </div>
                                    <span className="font-mono text-lg">{game.totalPrediction}</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-cyan-400 mb-2 mt-4">Top Player Props</h4>
                                    <div className="space-y-2 text-sm">
                                        {game.topPlayerProps.slice(0, 3).map((prop, p_index) => (
                                            <div key={p_index} className="flex justify-between p-2 bg-slate-800/50 rounded-md">
                                                <span className="text-slate-300">{prop.name}</span>
                                                <span className="text-green-400 font-semibold">{prop.hitChance}</span>
                                            </div>
                                        ))}
                                        {game.topPlayerProps.length === 0 && <p className="text-xs text-slate-500">No props analyzed for this game.</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}