
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, CheckCircle, AlertCircle, Calendar, Orbit, Zap, Star, BookOpen, List, Server, Target, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DebugPage() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    
    const [nflLoading, setNflLoading] = useState(false);
    const [nflResponse, setNflResponse] = useState(null);
    const [nflError, setNflError] = useState(null);

    const [sportsbookLoading, setSportsbookLoading] = useState(false);
    const [sportsbookResponse, setSportsbookResponse] = useState(null);
    const [sportsbookError, setSportsbookError] = useState(null);

    // New state variables for the primary odds fetcher
    const [primaryOddsLoading, setPrimaryOddsLoading] = useState(false);
    const [primaryOddsResponse, setPrimaryOddsResponse] = useState(null);
    const [primaryOddsError, setPrimaryOddsError] = useState(null);

    const [propsLoading, setPropsLoading] = useState(false);
    const [propsResponse, setPropsResponse] = useState(null);
    const [propsError, setErrorProps] = useState(null); // Corrected typo here from the original code (propsError)

    const [multiBookLoading, setMultiBookLoading] = useState(false);
    const [multiBookResponse, setMultiBookResponse] = useState(null);
    const [multiBookError, setMultiBookError] = useState(null);

    const [activeSportsLoading, setActiveSportsLoading] = useState(false);
    const [activeSportsResponse, setActiveSportsResponse] = useState(null);
    const [activeSportsError, setActiveSportsError] = useState(null);

    // New state variables for the deep player props fetcher
    const [playerPropsLoading, setPlayerPropsLoading] = useState(false);
    const [playerPropsResponse, setPlayerPropsResponse] = useState(null);
    const [playerPropsError, setPlayerPropsError] = useState(null);

    // New state for the full prop analysis
    const [propAnalysisLoading, setPropAnalysisLoading] = useState(false);
    const [propAnalysisResponse, setPropAnalysisResponse] = useState(null);
    const [propAnalysisError, setPropAnalysisError] = useState(null);

    const handleScheduleUpdate = async () => {
        setLoading(true);
        setResponse(null);
        setError(null);
        
        try {
            console.log('🚀 Triggering LEGACY multi-sportsbook cache update...');
            const { updateMarketCache } = await import('@/api/functions');
            const res = await updateMarketCache();
            console.log('✅ Response received:', res.data);
            setResponse(res.data);
        } catch (err) {
            console.error('❌ Cache update failed:', err);
            setError(err.message || 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    // New handler function for the primary odds fetcher
    const handlePrimaryOddsUpdate = async () => {
        setPrimaryOddsLoading(true);
        setPrimaryOddsResponse(null);
        setPrimaryOddsError(null);
        
        try {
            console.log('⚡ Triggering Primary Multi-Sport Odds Refresh from the-odds-api...');
            // This now points to the corrected function
            const { updateOddsFromTheOddsAPI } = await import('@/api/functions');
            const res = await updateOddsFromTheOddsAPI();
            console.log('✅ Primary odds response received:', res.data);
            setPrimaryOddsResponse(res.data);
        } catch (err) {
            console.error('❌ Primary odds update failed:', err);
            setPrimaryOddsError(err.message || 'Unknown error occurred');
        } finally {
            setPrimaryOddsLoading(false);
        }
    };

    const handleSportsbookOddsUpdate = async () => {
        setSportsbookLoading(true);
        setSportsbookResponse(null);
        setSportsbookError(null);
        
        try {
            console.log('⚡ Triggering Legacy Multi-Sport Odds Refresh (RapidAPI)...');
            const { updateSportsbookOdds } = await import('@/api/functions');
            const res = await updateSportsbookOdds();
            console.log('✅ Legacy odds response received:', res.data);
            setSportsbookResponse(res.data);
        } catch (err) {
            console.error('❌ Legacy odds update failed:', err);
            setSportsbookError(err.message || 'Unknown error occurred');
        } finally {
            setSportsbookLoading(false);
        }
    };
    
    const handlePropsUpdate = async () => {
        setPropsLoading(true);
        setPropsResponse(null);
        setErrorProps(null); // Corrected typo here
        
        try {
            console.log('✨ Triggering Player Props analysis...');
            const { updateSportsbookProps } = await import('@/api/functions');
            const res = await updateSportsbookProps();
            console.log('✅ Props analysis response:', res.data);
            setPropsResponse(res.data);
        } catch (err) {
            console.error('❌ Props analysis failed:', err);
            setErrorProps(err.message || 'Unknown error occurred'); // Corrected typo here
        } finally {
            setPropsLoading(false);
        }
    };

    const handleNFLUpdate = async () => {
        setNflLoading(true);
        setNflResponse(null);
        setNflError(null);
        
        try {
            console.log('🏈 Triggering NFL weekly schedule update...');
            const { updateNFLWeeklySchedule } = await import('@/api/functions');
            const res = await updateNFLWeeklySchedule();
            console.log('✅ NFL Response received:', res.data);
            setNflResponse(res.data);
        } catch (err) {
            console.error('❌ NFL update failed:', err);
            setNflError(err.message || 'Unknown error occurred');
        } finally {
            setNflLoading(false);
        }
    };

    const handleMultiBookFetch = async () => {
        setMultiBookLoading(true);
        setMultiBookResponse(null);
        setMultiBookError(null);
        try {
            console.log('📚 Triggering Multi-Book fetch from oddsapi.io...');
            const { fetchSportsOdds } = await import('@/api/functions');
            const res = await fetchSportsOdds();
            console.log('✅ Multi-book response received:', res.data);
            setMultiBookResponse(res.data);
        } catch (err) {
            console.error('❌ Multi-book fetch failed:', err);
            setMultiBookError(err.message || 'Unknown error occurred');
        } finally {
            setMultiBookLoading(false);
        }
    };

    const handleCheckActiveSports = async () => {
        setActiveSportsLoading(true);
        setActiveSportsResponse(null);
        setActiveSportsError(null);
        try {
            console.log('📡 Checking active sports from the-odds-api.com...');
            const { checkActiveSports } = await import('@/api/functions');
            const res = await checkActiveSports();
            console.log('✅ Active sports response:', res.data);
            setActiveSportsResponse(res.data);
        } catch (err) {
            console.error('❌ Active sports check failed:', err);
            setActiveSportsError(err.message || 'Unknown error occurred');
        } finally {
            setActiveSportsLoading(false);
        }
    };

    // New handler for the deep prop fetcher
    const handlePlayerPropsFetch = async () => {
        setPlayerPropsLoading(true);
        setPlayerPropsResponse(null);
        setPlayerPropsError(null);
        try {
            console.log('🎯 Triggering Player Props Deep Fetch...');
            const { fetchPlayerProps } = await import('@/api/functions');
            const res = await fetchPlayerProps();
            console.log('✅ Player props response received:', res.data);
            setPlayerPropsResponse(res.data);
        } catch (err) {
            console.error('❌ Player props fetch failed:', err);
            setPlayerPropsError(err.message || 'Unknown error occurred');
        } finally {
            setPlayerPropsLoading(false);
        }
    };

    // New handler for the full prop analysis
    const handleFullPropAnalysis = async () => {
        setPropAnalysisLoading(true);
        setPropAnalysisResponse(null);
        setPropAnalysisError(null);
        try {
            console.log('🔬 Triggering Full Slate Prop Analysis...');
            const { analyzer } = await import('@/api/functions');
            const res = await analyzer({ sport: 'NFL' }); // Example for NFL
            console.log('✅ Full analysis response received:', res.data);
            setPropAnalysisResponse(res.data);
        } catch (err) {
            console.error('❌ Full analysis failed:', err);
            setPropAnalysisError(err.message || 'Unknown error occurred');
        } finally {
            setPropAnalysisLoading(false);
        }
    };

    return (
        <div className="p-6 bg-black text-gray-300 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 text-white">Debug Panel</h1>
                <p className="text-gray-400 mb-6">
                    Manually trigger system processes and view diagnostic information.
                </p>

                {/* API Status Checker */}
                <Card className="bg-slate-900 border-teal-500/50 mb-6 border-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Server className="w-5 h-5 text-teal-400" />
                            Check Active Sports (the-odds-api.com)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">
                            Pulls the list of all sports from the API provider to see which ones are marked as `active: true`.
                        </p>
                        <Button 
                            onClick={handleCheckActiveSports} 
                            disabled={activeSportsLoading}
                            className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-700 w-full sm:w-auto"
                            size="lg"
                        >
                            {activeSportsLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Checking...
                                </>
                            ) : (
                                <>
                                    <List className="mr-2 h-5 w-5" />
                                    Check API Status
                                </>
                            )}
                        </Button>
                        
                        {activeSportsError && (
                            <Alert className="mt-4 bg-red-900/20 border-red-700">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertTitle className="text-red-400">Error</AlertTitle>
                                <AlertDescription className="text-red-300">
                                    {activeSportsError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {activeSportsResponse && activeSportsResponse.success && (
                            <Card className="bg-slate-900 border-slate-700 mt-4">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">Active Sports</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {activeSportsResponse.sports.filter(s => s.active).map(sport => (
                                            <div key={sport.key} className="bg-slate-800 p-3 rounded-md border border-slate-700">
                                                <p className="font-bold text-teal-300">{sport.title}</p>
                                                <p className="text-sm text-slate-400 font-mono">key: {sport.key}</p>
                                                <p className="text-sm text-slate-400">group: {sport.group}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <details className="mt-4">
                                        <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-semibold mb-2 text-sm">
                                            View Full Raw Response
                                        </summary>
                                        <pre className="bg-black p-4 rounded-md text-xs text-green-300 overflow-x-auto border border-slate-700">
                                            {JSON.stringify(activeSportsResponse.sports, null, 2)}
                                        </pre>
                                    </details>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>

                {/* New Player Props Deep Fetch Card */}
                <Card className="bg-slate-900 border-yellow-500/50 mb-6 border-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-yellow-400" />
                            Player Props Deep Fetch
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">
                            Fetches detailed player props (pass/rush/rec yards, TDs) for all games in major sports (NFL, NBA, MLB, CFB) and caches them in the `Game` entity.
                        </p>
                        <Button 
                            onClick={handlePlayerPropsFetch} 
                            disabled={playerPropsLoading}
                            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-700 w-full sm:w-auto"
                            size="lg"
                        >
                            {playerPropsLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Fetching All Props...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5" />
                                    Run Deep Prop Fetch
                                </>
                            )}
                        </Button>
                        
                        {playerPropsLoading && (
                            <Alert className="mt-4 bg-blue-900/20 border-blue-700">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                <AlertTitle className="text-blue-400">Processing...</AlertTitle>
                                <AlertDescription className="text-blue-300">
                                    Fetching detailed player props for all active games. This may take a moment.
                                </AlertDescription>
                            </Alert>
                        )}

                        {playerPropsError && !playerPropsLoading && (
                            <Alert className="mt-4 bg-red-900/20 border-red-700">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertTitle className="text-red-400">Error</AlertTitle>
                                <AlertDescription className="text-red-300">
                                    {playerPropsError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {playerPropsResponse && playerPropsResponse.success && !playerPropsLoading && (
                            <Alert className="mt-4 bg-green-900/20 border-green-700">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <AlertTitle className="text-green-400">Success!</AlertTitle>
                                <AlertDescription className="text-green-300">
                                    {playerPropsResponse.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        {playerPropsResponse && (
                            <details className="mt-4">
                                <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-semibold mb-2 text-sm">
                                    View Full Response JSON
                                </summary>
                                <pre className="bg-black p-4 rounded-md text-xs text-green-300 overflow-x-auto border border-slate-700">
                                    {JSON.stringify(playerPropsResponse, null, 2)}
                                </pre>
                            </details>
                        )}
                    </CardContent>
                </Card>

                {/* New Full Prop Analysis Card */}
                <Card className="bg-slate-900 border-purple-500/50 mb-6 border-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-400" />
                            Run Full Prop Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">
                            Analyzes all cached props for a given sport, compares odds between DraftKings and FanDuel, and calculates edge and confidence.
                        </p>
                        <Button 
                            onClick={handleFullPropAnalysis} 
                            disabled={propAnalysisLoading}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 w-full sm:w-auto"
                            size="lg"
                        >
                            {propAnalysisLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Analyzing Slate...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5" />
                                    Run Full Prop Analysis
                                </>
                            )}
                        </Button>
                        
                        {propAnalysisLoading && (
                            <Alert className="mt-4 bg-blue-900/20 border-blue-700">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                <AlertTitle className="text-blue-400">Processing...</AlertTitle>
                                <AlertDescription className="text-blue-300">
                                    Analyzing all available props. This may take a few seconds.
                                </AlertDescription>
                            </Alert>
                        )}

                        {propAnalysisError && !propAnalysisLoading && (
                            <Alert className="mt-4 bg-red-900/20 border-red-700">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertTitle className="text-red-400">Error</AlertTitle>
                                <AlertDescription className="text-red-300">
                                    {propAnalysisError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {propAnalysisResponse && propAnalysisResponse.success && !propAnalysisLoading && (
                            <Alert className="mt-4 bg-green-900/20 border-green-700">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <AlertTitle className="text-green-400">Success!</AlertTitle>
                                <AlertDescription className="text-green-300">
                                    {propAnalysisResponse.message}. Found {propAnalysisResponse.totalAnalyzed} total props.
                                </AlertDescription>
                            </Alert>
                        )}

                        {propAnalysisResponse && (
                            <details className="mt-4">
                                <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-semibold mb-2 text-sm">
                                    View Full Response JSON
                                </summary>
                                <pre className="bg-black p-4 rounded-md text-xs text-green-300 overflow-x-auto border border-slate-700">
                                    {JSON.stringify(propAnalysisResponse, null, 2)}
                                </pre>
                            </details>
                        )}
                    </CardContent>
                </Card>

                {/* Primary Odds Refresh (the-odds-api.com) - NEW */}
                <Card className="bg-slate-900 border-green-500/50 mb-6 border-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-green-400" />
                            Primary Odds Refresh (the-odds-api.com)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">
                            The main process for fetching all game odds from `the-odds-api.com`. It gets data for all major sports, transforms it, clears the old cache, and saves the new data to the Game entity.
                        </p>
                        <Button 
                            onClick={handlePrimaryOddsUpdate} 
                            disabled={primaryOddsLoading}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-700 w-full sm:w-auto"
                            size="lg"
                        >
                            {primaryOddsLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Refreshing All Sports...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5" />
                                    Run Primary Odds Refresh
                                </>
                            )}
                        </Button>
                        
                        {primaryOddsLoading && (
                            <Alert className="mt-4 bg-blue-900/20 border-blue-700">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                <AlertTitle className="text-blue-400">Processing</AlertTitle>
                                <AlertDescription className="text-blue-300">
                                    Fetching live odds from DraftKings & FanDuel for all sports... This may take a moment.
                                </AlertDescription>
                            </Alert>
                        )}

                        {primaryOddsError && !primaryOddsLoading && (
                            <Alert className="mt-4 bg-red-900/20 border-red-700">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertTitle className="text-red-400">Error</AlertTitle>
                                <AlertDescription className="text-red-300">
                                    {primaryOddsError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {primaryOddsResponse && primaryOddsResponse.success && !primaryOddsLoading && (
                            <Alert className="mt-4 bg-green-900/20 border-green-700">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <AlertTitle className="text-green-400">Success!</AlertTitle>
                                <AlertDescription className="text-green-300">
                                    {primaryOddsResponse.message} - Cached {primaryOddsResponse.total_games_cached} total games.
                                </AlertDescription>
                            </Alert>
                        )}

                        {primaryOddsResponse && (
                            <Card className="bg-slate-900 border-slate-700 mt-4">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">Update Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {primaryOddsResponse.results && primaryOddsResponse.results.length > 0 && (
                                        <div className="space-y-3">
                                            {primaryOddsResponse.results.map((result, idx) => (
                                                <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-white text-lg uppercase">{result.sport}</span>
                                                        {result.success ? (
                                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5 text-red-400" />
                                                        )}
                                                    </div>
                                                    
                                                    {result.success ? (
                                                        <div className="text-sm space-y-1">
                                                            <p className="text-green-400">
                                                                ✅ {result.count} games cached
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-red-400">
                                                            ❌ {result.error || 'Update failed'}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <details className="mt-4">
                                        <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-semibold mb-2 text-sm">
                                            View Full Response JSON
                                        </summary>
                                        <pre className="bg-black p-4 rounded-md text-xs text-green-300 overflow-x-auto border border-slate-700">
                                            {JSON.stringify(primaryOddsResponse, null, 2)}
                                        </pre>
                                    </details>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>

                {/* New Multi-Book Fetcher */}
                <Card className="bg-slate-900 border-blue-500/50 mb-6 border-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                            Multi-Book Odds Fetch (oddsapi.io)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">
                            Fetches odds from the-odds-api.com for DraftKings & FanDuel across all major sports, clears old entries, and caches the new games.
                        </p>
                        <Button 
                            onClick={handleMultiBookFetch} 
                            disabled={multiBookLoading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 w-full sm:w-auto"
                            size="lg"
                        >
                            {multiBookLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Fetching...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5" />
                                    Run oddsapi.io Fetch
                                </>
                            )}
                        </Button>
                        
                        {multiBookLoading && (
                            <Alert className="mt-4 bg-blue-900/20 border-blue-700">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                <AlertTitle className="text-blue-400">Processing</AlertTitle>
                                <AlertDescription className="text-blue-300">
                                    Fetching live odds from the-odds-api.com...
                                </AlertDescription>
                            </Alert>
                        )}

                        {multiBookError && !multiBookLoading && (
                            <Alert className="mt-4 bg-red-900/20 border-red-700">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertTitle className="text-red-400">Error</AlertTitle>
                                <AlertDescription className="text-red-300">
                                    {multiBookError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {multiBookResponse && multiBookResponse.success && !multiBookLoading && (
                            <Alert className="mt-4 bg-green-900/20 border-green-700">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <AlertTitle className="text-green-400">Success!</AlertTitle>
                                <AlertDescription className="text-green-300">
                                    {multiBookResponse.message} - Cached {multiBookResponse.total_games_cached} total games.
                                </AlertDescription>
                            </Alert>
                        )}

                        {multiBookResponse && (
                            <Card className="bg-slate-900 border-slate-700 mt-4">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">Update Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {multiBookResponse.results && multiBookResponse.results.length > 0 && (
                                        <div className="space-y-3">
                                            {multiBookResponse.results.map((result, idx) => (
                                                <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-white text-lg uppercase">{result.sport}</span>
                                                        {result.success ? (
                                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5 text-red-400" />
                                                        )}
                                                    </div>
                                                    
                                                    {result.success ? (
                                                        <p className="text-sm text-green-400">✅ {result.count} games cached</p>
                                                    ) : (
                                                        <p className="text-sm text-red-400">❌ {result.error || 'Update failed'}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <details className="mt-4">
                                        <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-semibold mb-2 text-sm">
                                            View Full Response JSON
                                        </summary>
                                        <pre className="bg-black p-4 rounded-md text-xs text-green-300 overflow-x-auto border border-slate-700">
                                            {JSON.stringify(multiBookResponse, null, 2)}
                                        </pre>
                                    </details>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>

                {/* Legacy RapidAPI Fetcher - Renamed from Primary Odds Refresh (All Sports) */}
                <Card className="bg-slate-900 border-slate-700 mb-6">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Orbit className="w-5 h-5 text-slate-400" />
                            Legacy Odds Refresh (RapidAPI)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">
                            This uses the `sportsbook-api2` RapidAPI (v2 endpoint) to get data. This is a fallback and not the primary method.
                        </p>
                        <Button 
                            onClick={handleSportsbookOddsUpdate} 
                            disabled={sportsbookLoading}
                            className="bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 w-full sm:w-auto"
                            size="lg"
                        >
                            {sportsbookLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Refreshing Legacy Odds...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5" />
                                    Run Legacy Refresh
                                </>
                            )}
                        </Button>

                        {sportsbookLoading && (
                            <Alert className="mt-4 bg-blue-900/20 border-blue-700">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                <AlertTitle className="text-blue-400">Processing</AlertTitle>
                                <AlertDescription className="text-blue-300">
                                    Fetching live odds from DraftKings & FanDuel for all sports... This may take a moment.
                                </AlertDescription>
                            </Alert>
                        )}

                        {sportsbookError && !sportsbookLoading && (
                            <Alert className="mt-4 bg-red-900/20 border-red-700">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertTitle className="text-red-400">Error</AlertTitle>
                                <AlertDescription className="text-red-300">
                                    {sportsbookError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {sportsbookResponse && sportsbookResponse.success && !sportsbookLoading && (
                            <Alert className="mt-4 bg-green-900/20 border-green-700">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <AlertTitle className="text-green-400">Success!</AlertTitle>
                                <AlertDescription className="text-green-300">
                                    {sportsbookResponse.message} - Cached {sportsbookResponse.total_games_cached} total games.
                                </AlertDescription>
                            </Alert>
                        )}

                        {sportsbookResponse && (
                             <details className="mt-4">
                                <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-semibold mb-2 text-sm">
                                    View Full Response JSON
                                </summary>
                                <pre className="bg-black p-4 rounded-md text-xs text-green-300 overflow-x-auto border border-slate-700">
                                    {JSON.stringify(sportsbookResponse, null, 2)}
                                </pre>
                            </details>
                        )}
                    </CardContent>
                </Card>

                {/* Player Props Analysis Card */}
                <Card className="bg-slate-900 border-yellow-500/50 mb-6 border-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            Player Prop Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">
                            Fetches and analyzes player props from all available games for NFL, NBA, MLB, and CFB. Ranks them by a confidence score and caches the results in the `AnalyzerProps` entity.
                        </p>
                        <Button 
                            onClick={handlePropsUpdate} 
                            disabled={propsLoading}
                            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-700 w-full sm:w-auto"
                            size="lg"
                        >
                            {propsLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Analyzing Player Props...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5" />
                                    Run Prop Analysis
                                </>
                            )}
                        </Button>
                        
                        {propsLoading && (
                            <Alert className="mt-4 bg-blue-900/20 border-blue-700">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                <AlertTitle className="text-blue-400">Processing</AlertTitle>
                                <AlertDescription className="text-blue-300">
                                    Fetching and analyzing thousands of player props... This can take a few moments.
                                </AlertDescription>
                            </Alert>
                        )}

                        {propsError && !propsLoading && (
                            <Alert className="mt-4 bg-red-900/20 border-red-700">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertTitle className="text-red-400">Error</AlertTitle>
                                <AlertDescription className="text-red-300">
                                    {propsError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {propsResponse && propsResponse.success && !propsLoading && (
                            <Alert className="mt-4 bg-green-900/20 border-green-700">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <AlertTitle className="text-green-400">Success!</AlertTitle>
                                <AlertDescription className="text-green-300">
                                    {propsResponse.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        {propsResponse && (
                            <Card className="bg-slate-900 border-slate-700 mt-4">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">Analysis Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {propsResponse.results && propsResponse.results.length > 0 && (
                                        <div className="space-y-3">
                                            {propsResponse.results.map((result, idx) => (
                                                <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-white text-lg uppercase">{result.sport}</span>
                                                        {result.success ? (
                                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5 text-red-400" />
                                                        )}
                                                    </div>
                                                    
                                                    {result.success ? (
                                                        <p className="text-sm text-green-400">
                                                            ✅ Analyzed and cached {result.count} props.
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-red-400">
                                                            ❌ {result.error || 'Update failed'}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <details className="mt-4">
                                        <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-semibold mb-2 text-sm">
                                            View Full Response JSON
                                        </summary>
                                        <pre className="bg-black p-4 rounded-md text-xs text-green-300 overflow-x-auto border border-slate-700">
                                            {JSON.stringify(propsResponse, null, 2)}
                                        </pre>
                                    </details>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>

                {/* NFL Weekly Schedule Update Card */}
                <Card className="bg-slate-900 border-slate-700 mb-6">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Orbit className="w-5 h-5 text-orange-400" />
                            NFL Weekly Schedule (Sunday → Tuesday)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">
                            Fetch NFL games from ESPN for current week (Sunday through Tuesday after Monday Night Football).
                            Includes live odds from DraftKings.
                        </p>
                        <p className="text-xs text-slate-500 mb-4">
                            📅 <strong>Window:</strong> Sunday 12:00 AM → Tuesday 11:59 PM
                        </p>
                        <Button 
                            onClick={handleNFLUpdate} 
                            disabled={nflLoading}
                            className="bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 w-full sm:w-auto"
                            size="lg"
                        >
                            {nflLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Updating NFL Schedule...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5" />
                                    Update NFL Week Now
                                </>
                            )}
                        </Button>
                        
                        {nflLoading && (
                            <Alert className="mt-4 bg-blue-900/20 border-blue-700">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                <AlertTitle className="text-blue-400">Processing</AlertTitle>
                                <AlertDescription className="text-blue-300">
                                    Fetching NFL schedule from ESPN and odds from DraftKings...
                                </AlertDescription>
                            </Alert>
                        )}

                        {nflError && !nflLoading && (
                            <Alert className="mt-4 bg-red-900/20 border-red-700">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertTitle className="text-red-400">Error</AlertTitle>
                                <AlertDescription className="text-red-300">
                                    {nflError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {nflResponse && nflResponse.success && !nflLoading && (
                            <Alert className="mt-4 bg-green-900/20 border-green-700">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <AlertTitle className="text-green-400">Success!</AlertTitle>
                                <AlertDescription className="text-green-300">
                                    {nflResponse.message}
                                    <div className="mt-2 text-sm">
                                        📊 {nflResponse.count} games cached
                                        {nflResponse.gamesWithOdds !== undefined && (
                                            <span> ({nflResponse.gamesWithOdds} with odds)</span>
                                        )}
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {nflResponse && (
                            <details className="mt-4">
                                <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-semibold mb-2 text-sm">
                                    View Full Response JSON
                                </summary>
                                <pre className="bg-black p-4 rounded-md text-xs text-green-300 overflow-x-auto border border-slate-700">
                                    {JSON.stringify(nflResponse, null, 2)}
                                </pre>
                            </details>
                        )}
                    </CardContent>
                </Card>

                {/* Full Cache Refresh Card (Legacy) */}
                <Card className="bg-slate-900 border-slate-700 mb-6">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            Full Cache Refresh (Legacy the-odds-api)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">
                           This is a legacy process that fetches odds from The Odds API for a limited set of sports. Use the primary refresh instead.
                        </p>
                        <p className="text-xs text-slate-500 mb-4">
                            🔄 <strong>Process:</strong> Deletes old games, fetches new ones, and populates the cache.
                        </p>
                        <Button 
                            onClick={handleScheduleUpdate} 
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 w-full sm:w-auto"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Refreshing Full Cache...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5" />
                                    Trigger Full Cache Refresh
                                </>
                            )}
                        </Button>
                        
                        {loading && (
                            <Alert className="mt-4 bg-blue-900/20 border-blue-700">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                <AlertTitle className="text-blue-400">Processing</AlertTitle>
                                <AlertDescription className="text-blue-300">
                                    Fetching live odds from multiple sportsbooks...
                                </AlertDescription>
                            </Alert>
                        )}

                        {error && !loading && (
                            <Alert className="mt-4 bg-red-900/20 border-red-700">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertTitle className="text-red-400">Error</AlertTitle>
                                <AlertDescription className="text-red-300">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {response && response.success && !loading && (
                            <Alert className="mt-4 bg-green-900/20 border-green-700">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <AlertTitle className="text-green-400">Success!</AlertTitle>
                                <AlertDescription className="text-green-300">
                                    {response.message || 'Successfully updated schedules for all sports.'}
                                </AlertDescription>
                            </Alert>
                        )}

                        {response && (
                            <Card className="bg-slate-900 border-slate-700 mt-4">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">Update Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {response.results && response.results.length > 0 && (
                                        <div className="space-y-3">
                                            {response.results.map((result, idx) => (
                                                <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-white text-lg">{result.sport}</span>
                                                        {result.success ? (
                                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5 text-red-400" />
                                                        )}
                                                    </div>
                                                    
                                                    {result.success ? (
                                                        <div className="text-sm space-y-1">
                                                            <p className="text-green-400">
                                                                ✅ {result.count} games cached
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-red-400">
                                                            ❌ {result.error || 'Update failed'}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <details className="mt-4">
                                        <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-semibold mb-2 text-sm">
                                            View Full Response JSON
                                        </summary>
                                        <pre className="bg-black p-4 rounded-md text-xs text-green-300 overflow-x-auto border border-slate-700">
                                            {JSON.stringify(response, null, 2)}
                                        </pre>
                                    </details>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>

                {/* Instructions */}
                {!response && !loading && !sportsbookResponse && !sportsbookLoading && !nflResponse && !nflLoading && !propsResponse && !propsLoading && !multiBookResponse && !multiBookLoading && !activeSportsResponse && !activeSportsLoading && !primaryOddsResponse && !primaryOddsLoading && !playerPropsResponse && !playerPropsLoading && !propAnalysisResponse && !propAnalysisLoading && (
                    <Card className="bg-slate-900 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white">How It Works</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-400 space-y-3">
                            <div>
                                <p className="font-semibold text-white mb-1">📡 Check Active Sports (the-odds-api.com):</p>
                                <p>The <strong className="text-teal-400">"Check API Status"</strong> button queries the-odds-api.com directly to see which sports they currently mark as 'active'. Useful for debugging why certain sports might not be showing up.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white mb-1">🎯 Player Props Deep Fetch:</p>
                                <p>The <strong className="text-yellow-400">"Run Deep Prop Fetch"</strong> button retrieves detailed player prop data (like passing/rushing/receiving yards, TDs) for major sports and stores it in the `Game` entity.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white mb-1">🔬 Run Full Prop Analysis:</p>
                                <p>The <strong className="text-purple-400">"Run Full Prop Analysis"</strong> button analyzes all currently cached player props for a selected sport, comparing odds and identifying value bets.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white mb-1">⚡ Primary Odds Refresh (the-odds-api.com):</p>
                                <p>The <strong className="text-green-400">"Run Primary Odds Refresh"</strong> button is the main way to update all odds data. It uses your `the-odds-api.com` key.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white mb-1">📚 Multi-Book Odds Fetch (oddsapi.io):</p>
                                <p>The <strong className="text-blue-400">"Run oddsapi.io Fetch"</strong> button fetches odds from the-odds-api.com for DraftKings & FanDuel, clears existing entries for these games, and caches new ones. This is intended to eventually replace the legacy Full Cache Refresh.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white mb-1">✨ Player Prop Analysis:</p>
                                <p>The <strong className="text-yellow-400">"Run Prop Analysis"</strong> button fetches player props for NFL, NBA, MLB, and CFB, analyzes them for value, and caches the best bets in the `AnalyzerProps` entity.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white mb-1">🔄 Legacy Refresh (RapidAPI):</p>
                                <p>The <strong className="text-slate-400">"Run Legacy Refresh"</strong> button uses the older RapidAPI endpoint and is kept as a fallback.</p>
                            </div>
                            
                            <div>
                                <p className="font-semibold text-white mb-1">🎯 Process (Legacy):</p>
                                <p>For each sport, it fetches data from <strong className="text-cyan-400">DraftKings & FanDuel</strong>, merges them, and saves to the `Game` entity.</p>
                            </div>
                            
                            <div>
                                <p className="font-semibold text-white mb-1">🏈 Sports Covered:</p>
                                <p>NFL, CFB, NBA, MLB, UFC, and Golf.</p>
                            </div>
                            
                            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3 mt-4">
                                <p className="text-blue-300 text-xs">
                                    💡 <strong>Tip:</strong> The home page reads from the cache populated by this process. If data is stale, run the refresh.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
