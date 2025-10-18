import React, { useState, useEffect } from 'react';
import { fetchTopTeamProps } from '@/api/functions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Star, AlertCircle, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function TopTeamPropsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeSport, setActiveSport] = useState("nfl");

  const handleFetchProps = async (sport) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetchTopTeamProps({ sport });
      if (response.data?.success) {
        setData(response.data);
      } else {
        throw new Error(response.data?.error || `Failed to fetch props for ${sport}.`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchProps(activeSport);
  }, [activeSport]);

  return (
    <div className="p-6 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
            <Users className="w-8 h-8 text-yellow-400" />
            <div>
                 <h1 className="text-3xl font-bold">Top 50 Team Props – {activeSport.toUpperCase()}</h1>
                 <p className="text-slate-400">Top team props sorted by implied probability from FanDuel & DraftKings.</p>
            </div>
        </div>

        <Tabs value={activeSport} onValueChange={setActiveSport} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 max-w-sm bg-slate-800 border border-slate-700">
            <TabsTrigger value="nfl" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">NFL</TabsTrigger>
            <TabsTrigger value="nba" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">NBA</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="ml-4 text-lg">Loading team props for {activeSport.toUpperCase()}...</p>
          </div>
        )}

        {error && (
          <Card className="bg-red-900/20 border-red-700">
            <CardHeader className="flex flex-row items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <CardTitle className="text-red-400">Error Fetching Props</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {data && !loading && (
            data.topProps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {(data.topProps || []).map((p, i) => (
                    <div key={i} className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 hover:border-cyan-600 transition-colors">
                        <div className="flex justify-between text-sm text-slate-400">
                        <span>{p.sportsbook}</span>
                        <span className="font-bold text-green-400 flex items-center gap-1"><Star className="w-4 h-4"/>{p.hitChance}</span>
                        </div>
                        <h2 className="text-lg font-semibold mt-2 text-white">{p.team}</h2>
                        <p className="text-slate-300 text-sm truncate">{p.prop}</p>
                        <p className="text-cyan-400 font-medium mt-2 text-xl">{p.line}</p>
                    </div>
                    ))}
                </div>
            ) : (
                <p>No team props available right now for {activeSport.toUpperCase()}.</p>
            )
        )}
      </div>
    </div>
  );
}