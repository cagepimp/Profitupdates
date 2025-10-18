import React, { useState, useCallback } from "react";
import { InvokeLLM, UploadFile, ExtractDataFromUploadedFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Zap, BarChart3, AlertTriangle, Database, Upload } from "lucide-react";
import TrendCard from "../components/database/TrendCard";
import { UFCFight } from "@/api/entities"; // Import the new entity
import UFCFightHistoryTable from "../components/database/UFCFightHistoryTable"; // Import the new component

const DATA_SOURCES = {
    "OddsShark": {
        "NFL": "https://www.oddsshark.com/nfl/database",
        "NBA": "https://www.oddsshark.com/nba/database",
        "MLB": "https://www.oddsshark.com/mlb/database",
        "NCAAF": "https://www.oddsshark.com/ncaaf/database",
        "UFC": "https://www.oddsshark.com/ufc/odds"
    },
    "ScoresAndOdds": {
        "NFL": "https://www.scoresandodds.com/nfl",
        "NBA": "https://www.scoresandodds.com/nba",
        "MLB": "https://www.scoresandodds.com/mlb",
        "NCAAF": "https://www.scoresandodds.com/ncaaf",
        "GOLF": "https://www.scoresandodds.com/golf"
    }
};

export default function Databases() {
    const [selectedSport, setSelectedSport] = useState("NFL");
    const [trends, setTrends] = useState({});
    const [loadingSource, setLoadingSource] = useState(null);
    const [error, setError] = useState(null);

    // New state for UFC data upload
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [ufcFights, setUfcFights] = useState([]);

    const fetchTrends = useCallback(async (source) => {
        if (!selectedSport) return;

        setLoadingSource(source);
        setError(null);
        setTrends(prev => ({ ...prev, [source]: [] }));

        const url = DATA_SOURCES[source]?.[selectedSport];
        if (!url) {
            setError(`No URL configured for ${source} and ${selectedSport}`);
            setLoadingSource(null);
            return;
        }

        try {
            const prompt = `Visit the URL ${url} and extract the top 10-15 most interesting and relevant betting trends and statistics. Focus on actionable data like ATS records, Over/Under trends, team performance in specific situations, or notable odds. For each trend, provide a concise description, the record (e.g., '8-2 ATS', '7-3 O/U'), the category of the trend, and the associated team if applicable.`;

            const response = await InvokeLLM({
                prompt: prompt,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        trends: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    description: { type: "string" },
                                    category: { type: "string" },
                                    record: { type: "string" },
                                    team: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            if (response && response.trends) {
                setTrends(prev => ({ ...prev, [source]: response.trends }));
            } else {
                throw new Error("AI did not return the expected trend data.");
            }
        } catch (err) {
            console.error(`Error fetching data from ${source}:`, err);
            setError(`Failed to fetch or parse data from ${source}. The AI may have been unable to access the site. Please try again.`);
        } finally {
            setLoadingSource(null);
        }
    }, [selectedSport]);

    const loadUFCFights = useCallback(async () => {
        try {
            const fights = await UFCFight.list("-event_date", 100); // Get latest 100 fights, sorted by event_date descending
            setUfcFights(fights);
        } catch (err) {
            console.error("Error loading UFC fights:", err);
            setUploadError("Failed to load historical UFC data.");
        }
    }, []);

    const handleUFCUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            // 1. Upload the file
            const { file_url } = await UploadFile({ file });
            if (!file_url) throw new Error("File upload failed.");

            // 2. Extract data from the file
            const schema = UFCFight.schema();
            const extractionResult = await ExtractDataFromUploadedFile({
                file_url: file_url,
                json_schema: { type: "array", items: schema }
            });

            if (extractionResult.status !== 'success' || !extractionResult.output) {
                throw new Error(extractionResult.details || "Failed to extract data from file.");
            }

            // 3. Clear existing data and bulk create new data
            // Fetch all existing fights and delete them
            const existingFights = await UFCFight.list();
            if (existingFights.length > 0) {
                await Promise.all(existingFights.map(f => UFCFight.delete(f.id)));
            }

            await UFCFight.bulkCreate(extractionResult.output);

            // 4. Reload data into the UI
            await loadUFCFights();

        } catch (err) {
            console.error("UFC data upload error:", err);
            setUploadError(err.message || "An unknown error occurred during upload.");
        } finally {
            setIsUploading(false);
            // Clear the file input after upload attempt
            event.target.value = null;
        }
    };

    // Load historical fights on component mount
    React.useEffect(() => {
        loadUFCFights();
    }, [loadUFCFights]);

    const sports = ["NFL", "NBA", "MLB", "NCAAF", "UFC", "GOLF"];

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            Betting Databases
                        </h1>
                        <p className="text-slate-400 mt-2">AI-powered trend extraction and historical data analysis.</p>
                    </div>
                </div>

                {/* UFC Historical Data Section */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-xl flex items-center gap-2">
                            <Database className="w-5 h-5 text-sky-400" />
                            UFC Historical Fight Data
                        </CardTitle>
                        <p className="text-slate-400 text-sm">Upload your `ufc.csv` file to analyze fight history with opening and closing odds.</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                             <Button asChild className="bg-sky-600 hover:bg-sky-700" disabled={isUploading}>
                                <label htmlFor="ufc-upload" className="cursor-pointer flex items-center">
                                    <Upload className="w-4 h-4 mr-2"/>
                                    Upload ufc.csv
                                </label>
                            </Button>
                            <Input id="ufc-upload" type="file" accept=".csv" onChange={handleUFCUpload} className="hidden" disabled={isUploading}/>
                            <p className="text-xs text-slate-500">
                                Required columns include: fighter_1, fighter_2, winner, event_date, opening_odds_fighter_1, closing_odds_fighter_1, etc.
                            </p>
                            {isUploading && (
                                <div className="flex items-center gap-2 text-sky-400">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Processing your file...</span>
                                </div>
                            )}
                        </div>
                        {uploadError && (
                            <div className="text-red-400 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span>{uploadError}</span>
                            </div>
                        )}
                        <UFCFightHistoryTable fights={ufcFights} isLoading={isUploading} />
                    </CardContent>
                </Card>

                <Tabs value={selectedSport} onValueChange={setSelectedSport} className="space-y-6">
                    <TabsList className="bg-slate-800 border border-slate-700 grid grid-cols-6">
                        {sports.map(sport => (
                            <TabsTrigger key={sport} value={sport} className="data-[state=active]:bg-amber-600">
                                {sport}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {sports.map(sport => (
                        <TabsContent key={sport} value={sport} className="space-y-8">
                            {Object.keys(DATA_SOURCES).map(source => {
                                const isAvailable = DATA_SOURCES[source][sport];
                                return (
                                    <Card key={source} className="bg-slate-900 border-slate-800">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-white text-xl">{source} Database</CardTitle>
                                                <p className="text-slate-400 text-sm">Actionable trends for {sport}</p>
                                            </div>
                                            {isAvailable ? (
                                                <Button
                                                    onClick={() => fetchTrends(source)}
                                                    disabled={loadingSource === source}
                                                    className="bg-amber-600 hover:bg-amber-700"
                                                >
                                                    {loadingSource === source ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Zap className="w-4 h-4 mr-2" />
                                                    )}
                                                    Fetch {source} Trends
                                                </Button>
                                            ) : (
                                                <Badge variant="outline" className="text-slate-500 border-slate-700">Not Available for {sport}</Badge>
                                            )}
                                        </CardHeader>
                                        <CardContent>
                                            {loadingSource === source && (
                                                <div className="flex justify-center items-center py-10">
                                                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                                                    <p className="ml-4 text-slate-300">AI is analyzing {source}...</p>
                                                </div>
                                            )}
                                            {error && loadingSource !== source && (
                                                 <div className="text-center py-8 text-red-400 flex items-center justify-center gap-2">
                                                    <AlertTriangle className="w-5 h-5"/> {error}
                                                 </div>
                                            )}
                                            {!loadingSource && trends[source]?.length > 0 && (
                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {trends[source].map((trend, index) => (
                                                        <TrendCard key={index} trend={trend} />
                                                    ))}
                                                </div>
                                            )}
                                            {!loadingSource && (!trends[source] || trends[source]?.length === 0) && (
                                                <div className="text-center py-10 text-slate-500">
                                                    <Database className="w-10 h-10 mx-auto mb-2" />
                                                    Click the fetch button to get the latest trends.
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}