import React, { useState, useEffect } from "react";
import { Loader2, Users, TrendingUp, ChevronDown, Filter } from "lucide-react";
import { base44 } from '@/api/base44Client';

const SPORT_CONFIG = {
  'NFL': { icon: '🏈', color: 'from-blue-500 to-blue-600' },
  'CFB': { icon: '🏈', color: 'from-yellow-500 to-orange-500' },
  'MLB': { icon: '⚾', color: 'from-red-500 to-red-600' },
  'NBA': { icon: '🏀', color: 'from-orange-500 to-red-500' },
  'UFC': { icon: '🥊', color: 'from-purple-500 to-pink-600' },
  'GOLF': { icon: '⛳', color: 'from-green-500 to-emerald-600' }
};

// Prop categories based on your reference doc
const PROP_CATEGORIES = {
  'All Props': { keywords: [], icon: '📊' },
  
  // Offensive Props
  'Passing': { keywords: ['passing', 'pass', 'completion', 'attempt'], icon: '🎯' },
  'Rushing': { keywords: ['rushing', 'rush', 'carries', 'attempt'], icon: '🏃' },
  'Receiving': { keywords: ['receiving', 'reception', 'catch', 'target'], icon: '🙌' },
  
  // Scoring Props
  'Anytime TD Scorer': { keywords: ['touchdown', 'td scorer', 'anytime td', 'score'], icon: '🔥' },
  'Multiple TDs': { keywords: ['multiple td', '2+ td', 'two touchdown'], icon: '⚡' },
  
  // Combined Stats
  'Scrimmage Yards': { keywords: ['scrimmage', 'total yards', 'rush + rec'], icon: '📏' },
  
  // Special Teams
  'Kicker Props': { keywords: ['field goal', 'fg made', 'kicking points', 'extra point'], icon: '🦵' },
  
  // Defensive Props
  'Defensive - Sacks': { keywords: ['sack'], icon: '💥' },
  'Defensive - Tackles': { keywords: ['tackle', 'assist', 'solo tackle'], icon: '🛡️' },
  'Defensive - Turnovers': { keywords: ['interception', 'int', 'forced fumble', 'fumble recovery'], icon: '🔄' },
  'Defensive - TDs': { keywords: ['defensive touchdown', 'pick six', 'fumble return'], icon: '🏆' },
  'Defensive - Other': { keywords: ['safety', 'defensive'], icon: '⚔️' }
};

const normalizeSport = (sport) => {
  if (!sport) return 'NFL';
  const upper = String(sport).toUpperCase().trim();
  if (upper.includes('NFL') || upper === 'FOOTBALL') return 'NFL';
  if (upper.includes('CFB') || upper === 'COLLEGE FOOTBALL') return 'CFB';
  if (upper.includes('NBA') || upper === 'BASKETBALL') return 'NBA';
  if (upper.includes('MLB') || upper === 'BASEBALL') return 'MLB';
  if (upper.includes('UFC') || upper === 'MMA') return 'UFC';
  if (upper.includes('GOLF') || upper === 'PGA') return 'GOLF';
  return upper;
};

const normalizeBook = (book) => {
  if (!book) return null;
  const lower = String(book).toLowerCase().trim();
  if (lower.includes('draft') || lower === 'dk') return 'DraftKings';
  if (lower.includes('fan') || lower === 'fd') return 'FanDuel';
  return book;
};

const getOdds = (prop) => {
  return prop.odds || prop.dk_odds || prop.fd_odds || prop.price || prop.american_odds || null;
};

// Function to match prop to category
const matchPropCategory = (propMarket) => {
  if (!propMarket) return 'All Props';
  const lowerMarket = propMarket.toLowerCase();
  
  for (const [category, config] of Object.entries(PROP_CATEGORIES)) {
    if (category === 'All Props') continue;
    if (config.keywords.some(keyword => lowerMarket.includes(keyword))) {
      return category;
    }
  }
  return 'All Props';
};

export default function PropsPage() {
    const [props, setProps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSport, setSelectedSport] = useState('NFL');
    const [selectedCategory, setSelectedCategory] = useState('All Props');
    const [selectedBook, setSelectedBook] = useState('All Books');
    const [analyzing, setAnalyzing] = useState(false);

    const loadProps = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log("🔵 Loading props from cache...");
            
            // Try to load cached props first
            const response = await base44.functions.invoke('runAnalyzerProps');
                
                console.log("🟢 Response received:", response);
                const data = response?.data;
                
                // DEBUG: Log the actual response structure
                console.log("🟢 Response.data structure:", JSON.stringify(data, null, 2));
                console.log("🟢 data.success:", data?.success);
                console.log("🟢 data.top_props:", data?.top_props);
                console.log("🟢 data.top_props length:", data?.top_props?.length);
                console.log("🟢 data.message:", data?.message);
                console.log("🟢 data.debug:", data?.debug);
                
                let rawProps = [];
                
                if (data && data.success && Array.isArray(data.top_props)) {
                    rawProps = data.top_props;
                } else if (Array.isArray(data)) {
                    rawProps = data;
                } else if (data && data.props) {
                    rawProps = Array.isArray(data.props) ? data.props : [];
                } else if (data && data.data) {
                    rawProps = Array.isArray(data.data) ? data.data : [];
                }
                
                const normalized = rawProps
                    .filter(p => p && typeof p === 'object')
                    .map(p => {
                        const market = p.market || p.prop_type || p.Market || p.bet_type || 'Unknown Market';
                        return {
                            sport: normalizeSport(p.sport || p.league || p.Sport || p.SPORT),
                            book: normalizeBook(p.book || p.bookmaker || p.sportsbook),
                            player: p.player || p.name || p.player_name || p.Player || 'Unknown',
                            team: p.team || p.Team || '',
                            market: market,
                            category: matchPropCategory(market),
                            game: p.game || p.matchup || p.Game || '',
                            odds: getOdds(p),
                            dk_odds: p.dk_odds || p.draftkings_odds || null,
                            fd_odds: p.fd_odds || p.fanduel_odds || null,
                            edge: parseFloat(p.edge || p.Edge || p.ev || p.expected_value || 0),
                            _original: p
                        };
                    })
                    .filter(p => p.player && p.market && getOdds(p) !== null);
                
                console.log("🟢 Normalized props:", normalized);
                console.log("🟢 Categories found:", [...new Set(normalized.map(p => p.category))]);
                
                setProps(normalized);
            } catch (err) {
                console.error("❌ ERROR loading props:", err);
                setError(err.message);
                setProps([]);
            } finally {
                setLoading(false);
            }
        };
        
    useEffect(() => {
        loadProps();
    }, []);

    const handleAnalyzeAllProps = async () => {
        setAnalyzing(true);
        setError(null);
        
        try {
            console.log(`🎯 Starting bulk props analysis for ${selectedSport}...`);
            
            const response = await base44.functions.invoke('runBulkPropsAnalyzer', {
                sport: selectedSport,
                limit: 20
            });
            
            console.log("✅ Bulk analysis complete:", response);
            
            // Reload props
            await loadProps();
            
        } catch (err) {
            console.error("❌ Failed to analyze props:", err);
            setError(err.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const formatOdds = (odds) => {
        if (!odds && odds !== 0) return '-';
        const num = Number(odds);
        if (isNaN(num)) return '-';
        return num > 0 ? `+${num}` : `${num}`;
    };

    // Get available categories for current sport
    const availableCategories = ['All Props', ...new Set(
        props
            .filter(p => p.sport === selectedSport)
            .map(p => p.category)
            .filter(c => c !== 'All Props')
    )];

    // Filter props
    const filtered = props.filter(p => {
        if (p.sport !== selectedSport) return false;
        if (selectedCategory !== 'All Props' && p.category !== selectedCategory) return false;
        if (selectedBook === 'DraftKings' && p.book !== 'DraftKings') return false;
        if (selectedBook === 'FanDuel' && p.book !== 'FanDuel') return false;
        return true;
    });

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-white">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mb-4" />
                <p className="text-lg">Loading props...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-950 text-white p-6">
                <div className="text-center p-8 bg-red-900/50 rounded-lg border border-red-500/50 max-w-lg">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-red-400 mb-3">Error Loading Props</h2>
                    <p className="text-red-300 mb-4">{error}</p>
                    
                    <div className="bg-slate-900 rounded p-4 mb-4 text-left text-sm">
                        <p className="text-gray-400 mb-2"><strong>Troubleshooting:</strong></p>
                        <ul className="text-gray-500 space-y-1 list-disc list-inside">
                            <li>Make sure <code className="text-cyan-400">runAnalyzerProps</code> function exists in /functions/</li>
                            <li>Check if you have analyzed any games yet</li>
                            <li>Verify the function has proper permissions</li>
                        </ul>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => window.location.href = '/games'}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold"
                        >
                            Go to Games
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (props.length === 0) {
        return (
            <div className="p-6 bg-slate-950 min-h-screen text-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center p-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/50">
                        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-10 h-10 text-purple-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-purple-400 mb-3">No Props Available Yet</h2>
                        <p className="text-gray-300 mb-6 text-lg">
                            Props are generated when you analyze games with the AI analyzer.
                        </p>
                        
                        <div className="bg-slate-900/50 rounded-lg p-6 mb-6 text-left">
                            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                <span className="text-2xl">🎯</span>
                                Generate Props for Parlays:
                            </h3>
                            <p className="text-gray-300 mb-4">
                                Click the button below to analyze all upcoming {selectedSport} games and generate comprehensive player and team props.
                            </p>
                        </div>

                        <button
                            onClick={handleAnalyzeAllProps}
                            disabled={analyzing}
                            className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {analyzing ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Analyzing All {selectedSport} Games...
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-6 h-6" />
                                    Analyze All {selectedSport} Props
                                </>
                            )}
                        </button>

                        <div className="flex gap-3 justify-center mt-4">
                            <button
                                onClick={() => window.location.href = '/games'}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-bold transition-all transform hover:scale-105"
                            >
                                Go to Games Page
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-white">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Top Props</h1>
                            <p className="text-gray-400 text-sm">AI-powered prop recommendations by category</p>
                        </div>
                    </div>
                    <button
                        onClick={handleAnalyzeAllProps}
                        disabled={analyzing}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {analyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <TrendingUp className="w-5 h-5" />
                                Analyze {selectedSport} Props
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-lg font-bold text-white">Filters</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Sport Dropdown */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Sport</label>
                        <div className="relative">
                            <select
                                value={selectedSport}
                                onChange={(e) => {
                                    setSelectedSport(e.target.value);
                                    setSelectedCategory('All Props');
                                }}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold appearance-none cursor-pointer hover:bg-slate-750 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                {Object.keys(SPORT_CONFIG).map(sport => (
                                    <option key={sport} value={sport}>
                                        {SPORT_CONFIG[sport].icon} {sport}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Prop Category Dropdown */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Prop Category</label>
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold appearance-none cursor-pointer hover:bg-slate-750 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                {availableCategories.map(category => (
                                    <option key={category} value={category}>
                                        {PROP_CATEGORIES[category]?.icon || '📊'} {category}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Sportsbook Dropdown */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Sportsbook</label>
                        <div className="relative">
                            <select
                                value={selectedBook}
                                onChange={(e) => setSelectedBook(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold appearance-none cursor-pointer hover:bg-slate-750 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="All Books">📚 All Books</option>
                                <option value="DraftKings">🟢 DraftKings</option>
                                <option value="FanDuel">🔵 FanDuel</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Active Filters Display */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-xs font-semibold text-cyan-400">
                        {SPORT_CONFIG[selectedSport]?.icon} {selectedSport}
                    </span>
                    {selectedCategory !== 'All Props' && (
                        <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs font-semibold text-purple-400">
                            {PROP_CATEGORIES[selectedCategory]?.icon} {selectedCategory}
                        </span>
                    )}
                    {selectedBook !== 'All Books' && (
                        <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-xs font-semibold text-blue-400">
                            {selectedBook === 'DraftKings' ? '🟢' : '🔵'} {selectedBook}
                        </span>
                    )}
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs font-semibold text-green-400">
                        {filtered.length} Props
                    </span>
                </div>
            </div>

            {/* Props Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-400" />
                            <h2 className="text-xl font-bold text-white">
                                {selectedCategory === 'All Props' ? 'All Props' : selectedCategory}
                            </h2>
                        </div>
                        <span className="text-gray-400 text-sm">
                            {filtered.length} {filtered.length === 1 ? 'prop' : 'props'} found
                        </span>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-10 h-10 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg mb-2">
                            No props available for {selectedCategory}
                        </p>
                        <p className="text-gray-500 text-sm">
                            Try selecting a different category or sport
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Book</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Player</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Market</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Game</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Odds</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Edge</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filtered.map((p, i) => {
                                    const isDK = p.book === 'DraftKings';
                                    const edge = parseFloat(p.edge) || 0;

                                    return (
                                        <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${
                                                    isDK 
                                                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                                        : p.book === 'FanDuel'
                                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                                                }`}>
                                                    {isDK ? '🟢 DK' : p.book === 'FanDuel' ? '🔵 FD' : p.book || '?'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white">{p.player}</div>
                                                {p.team && <div className="text-xs text-gray-400 mt-0.5">{p.team}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300">{p.market}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{p.category}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">{p.game || '-'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-mono font-bold text-cyan-400 text-lg">
                                                    {formatOdds(p.odds)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {edge > 0 ? (
                                                    <span className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
                                                        edge >= 5 ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                                                        edge >= 3 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                                                        'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                                                    }`}>
                                                        +{edge.toFixed(1)}%
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-600">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            {filtered.length > 0 && (
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-6 px-6 py-3 bg-slate-900 border border-slate-800 rounded-lg">
                        <div>
                            <div className="text-xs text-gray-400">Total Props</div>
                            <div className="text-lg font-bold text-white">{filtered.length}</div>
                        </div>
                        <div className="w-px h-8 bg-slate-700"></div>
                        <div>
                            <div className="text-xs text-gray-400">Average Edge</div>
                            <div className="text-lg font-bold text-green-400">
                                +{(filtered.reduce((acc, p) => acc + (p.edge || 0), 0) / filtered.length).toFixed(1)}%
                            </div>
                        </div>
                        <div className="w-px h-8 bg-slate-700"></div>
                        <div>
                            <div className="text-xs text-gray-400">Sport</div>
                            <div className="text-lg font-bold text-cyan-400">{selectedSport}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}