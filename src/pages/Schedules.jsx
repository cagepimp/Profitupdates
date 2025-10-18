import React, { useState, useEffect } from 'react';
import { fetchESPNSchedule } from '@/api/functions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Tv, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';

const sports = ["CFB", "NFL"];

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

export default function SchedulesPage() {
    const [activeSport, setActiveSport] = useState('CFB');
    const [week, setWeek] = useState(6); // Default to a week with good data
    const [scheduleData, setScheduleData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSchedule = async () => {
            setLoading(true);
            try {
                const response = await fetchESPNSchedule({ sport: activeSport, week: week });
                if (response?.data?.success) {
                    setScheduleData(response.data.data);
                } else {
                    setScheduleData(null);
                }
            } catch (error) {
                console.error(`Error loading ${activeSport} schedule for week ${week}:`, error);
                setScheduleData(null);
            } finally {
                setLoading(false);
            }
        };
        loadSchedule();
    }, [activeSport, week]);

    const formatGameTime = (isoDate) => new Date(isoDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const gamesByDay = scheduleData?.games?.reduce((acc, game) => {
        const day = new Date(game.game_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        if (!acc[day]) acc[day] = [];
        acc[day].push(game);
        return acc;
    }, {});

    return (
        <div className="p-6 text-white">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Weekly Schedules</h1>
                <div className="flex items-center gap-4">
                    <button onClick={() => setWeek(w => w - 1)} className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"><ArrowLeft className="w-5 h-5"/></button>
                    <span className="text-xl font-semibold">Week {week}</span>
                    <button onClick={() => setWeek(w => w + 1)} className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"><ArrowRight className="w-5 h-5"/></button>
                </div>
            </div>
            <SportTabs active={activeSport} onChange={setActiveSport} />
            
            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    <p className="ml-4 text-slate-400">Loading {activeSport} Week {week} schedule...</p>
                </div>
            ) : gamesByDay && Object.keys(gamesByDay).length > 0 ? (
                <div className="space-y-8">
                    {Object.entries(gamesByDay).map(([day, games]) => (
                        <Card key={day} className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-2xl text-cyan-400">{day}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-700">
                                            <TableHead className="text-white">Matchup</TableHead>
                                            <TableHead className="text-white">Time</TableHead>
                                            <TableHead className="text-white">Broadcast</TableHead>
                                            <TableHead className="text-white">Venue</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {games.map((game, idx) => (
                                            <TableRow key={idx} className="border-slate-800">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <span>{game.away_rank && ` #${game.away_rank}`} {game.away_team}</span>
                                                        <span className="text-slate-500">@</span>
                                                        <span>{game.home_rank && ` #${game.home_rank}`} {game.home_team}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{game.game_time_est}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-slate-400"><Tv className="w-4 h-4"/>{game.tv_network}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-slate-400"><MapPin className="w-4 h-4"/>{game.venue}</div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-400">
                    <p>No schedule found for {activeSport} Week {week}.</p>
                </div>
            )}
        </div>
    );
}