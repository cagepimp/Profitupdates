import React, { useState, useEffect } from 'react';
import { fetchInjuries } from '@/api/functions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShieldAlert, AlertCircle } from 'lucide-react';

const sports = ["NFL", "NBA", "MLB", "CFB"];

const SportTabs = ({ active, onChange }) => (
  <div className="flex space-x-1 border-b border-slate-800 mb-6">
    {sports.map((sport) => (
      <button
        key={sport}
        onClick={() => onChange(sport)}
        className={`relative px-4 py-2 font-medium text-sm rounded-t-lg transition-colors focus:outline-none ${
          active === sport
            ? "border-b-2 border-cyan-400 text-white bg-slate-800/50"
            : "text-slate-400 hover:text-white hover:bg-slate-800/30"
        }`}
      >
        {sport}
      </button>
    ))}
  </div>
);

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'out': return 'text-red-400 bg-red-900/20';
    case 'doubtful': return 'text-orange-400 bg-orange-900/20';
    case 'questionable': return 'text-yellow-400 bg-yellow-900/20';
    case 'probable': return 'text-green-400 bg-green-900/20';
    case 'day to day': return 'text-blue-400 bg-blue-900/20';
    default: return 'text-slate-400 bg-slate-800/20';
  }
};

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
    {status || 'Unknown'}
  </span>
);

export default function InjuriesPage() {
  const [activeSport, setActiveSport] = useState('NFL');
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInjuries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchInjuries({ sport: activeSport });
        console.log(`${activeSport} injury response:`, response);
        
        if (response?.data?.injuries && Array.isArray(response.data.injuries)) {
          setInjuries(response.data.injuries);
          console.log(`Loaded ${response.data.injuries.length} ${activeSport} injuries`);
        } else {
          setInjuries([]);
          setError(`No injury data returned for ${activeSport}`);
        }
      } catch (err) {
        console.error("Error loading injuries:", err);
        setError(err.message || 'Failed to load injury data');
        setInjuries([]);
      } finally {
        setLoading(false);
      }
    };

    loadInjuries();
  }, [activeSport]);

  return (
    <div className="p-6 text-white bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl font-bold">Injury Reports</h1>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Real-time injury updates from official sources (ESPN, NFL.com, NBA.com, MLB.com, NCAA.com)
        </p>
        
        <SportTabs active={activeSport} onChange={setActiveSport} />

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-between">
              <span>{activeSport} Injury Report</span>
              {!loading && injuries.length > 0 && (
                <span className="text-sm font-normal text-slate-400">
                  {injuries.length} injured players
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <p className="ml-4 text-slate-400">Loading {activeSport} injuries...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <p className="text-red-400 font-semibold">{error}</p>
                <p className="text-slate-400 text-sm mt-2">Try refreshing or check back later</p>
              </div>
            ) : injuries.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-white font-semibold">Player</TableHead>
                      <TableHead className="text-white font-semibold">Team</TableHead>
                      <TableHead className="text-white font-semibold">Position</TableHead>
                      <TableHead className="text-white font-semibold">Status</TableHead>
                      <TableHead className="text-white font-semibold">Injury Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {injuries.map((injury, index) => (
                      <TableRow key={index} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-white">
                          {injury.player_name}
                        </TableCell>
                        <TableCell className="text-white">
                          {injury.team_abbr}
                        </TableCell>
                        <TableCell className="text-white">
                          {injury.position || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={injury.injury_status} />
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {injury.injury_description || 'No details available'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ShieldAlert className="w-12 h-12 text-slate-600 mb-4" />
                <p className="text-slate-400">No injury data available for {activeSport}.</p>
                <p className="text-slate-500 text-sm mt-2">All players are healthy! 🎉</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}