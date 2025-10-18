import React, { useState, useEffect } from 'react';
import { fetchInjuries } from '@/api/functions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShieldAlert } from 'lucide-react';

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
    case 'out': return 'text-red-400';
    case 'doubtful': return 'text-orange-400';
    case 'questionable': return 'text-yellow-400';
    default: return 'text-slate-400';
  }
};

export default function InjuriesPage() {
  const [activeSport, setActiveSport] = useState('NFL');
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInjuries = async () => {
      setLoading(true);
      try {
        const response = await fetchInjuries({ sport: activeSport });
        if (response && response.data.injuries) {
          setInjuries(response.data.injuries);
        } else {
          setInjuries([]);
        }
      } catch (error) {
        console.error("Error loading injuries:", error);
        setInjuries([]);
      } finally {
        setLoading(false);
      }
    };

    loadInjuries();
  }, [activeSport]);

  return (
    <div className="p-6 text-white bg-slate-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Injury Reports</h1>
      <SportTabs active={activeSport} onChange={setActiveSport} />

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl">{activeSport} Injury List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="ml-4 text-slate-400">Loading {activeSport} injuries...</p>
            </div>
          ) : injuries.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-white">Player</TableHead>
                    <TableHead className="text-white">Team</TableHead>
                    <TableHead className="text-white">Position</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {injuries.map((injury, index) => (
                    <TableRow key={index} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-white">{injury.player_name}</TableCell>
                      <TableCell className="text-white">{injury.team_abbr}</TableCell>
                      <TableCell className="text-white">{injury.position}</TableCell>
                      <TableCell className={`font-semibold ${getStatusColor(injury.injury_status)}`}>
                        {injury.injury_status}
                      </TableCell>
                      <TableCell className="text-slate-300">{injury.injury_description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShieldAlert className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400">No injury data available for {activeSport}.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}