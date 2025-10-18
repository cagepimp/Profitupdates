import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formatOdds = (odds) => {
  if (odds === null || odds === undefined) return "N/A";
  return odds > 0 ? `+${odds}` : odds.toString();
};

export default function UFCFightHistoryTable({ fights, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFights = fights.filter(fight => 
    fight.fighter_1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fight.fighter_2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fight.event_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input 
        placeholder="Search by fighter or event..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm bg-slate-800 border-slate-700"
      />
      
      <div className="rounded-lg border border-slate-700 max-h-[600px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-800 z-10">
            <TableRow>
              <TableHead className="text-white">Event</TableHead>
              <TableHead className="text-white">Fighters</TableHead>
              <TableHead className="text-white">Weight Class</TableHead>
              <TableHead className="text-white text-center">Opening Odds</TableHead>
              <TableHead className="text-white text-center">Closing Odds</TableHead>
              <TableHead className="text-white">Method</TableHead>
              <TableHead className="text-white text-center">Round</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin"/>
                    Loading fight data...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredFights.length > 0 ? (
              filteredFights.map(fight => {
                const isFighter1Winner = fight.winner === fight.fighter_1;
                
                return (
                  <TableRow key={fight.id} className="hover:bg-slate-800/50">
                    <TableCell className="font-medium text-slate-300">
                      <div>{fight.event_name}</div>
                      <div className="text-xs text-slate-500">{fight.event_date}</div>
                    </TableCell>
                    <TableCell>
                      <div className={isFighter1Winner ? "font-bold text-green-400" : "text-red-400"}>{fight.fighter_1}</div>
                      <div className={!isFighter1Winner ? "font-bold text-green-400" : "text-red-400"}>{fight.fighter_2}</div>
                    </TableCell>
                    <TableCell className="text-slate-400">{fight.weight_class}</TableCell>
                    <TableCell className="text-center font-mono text-sm">
                      <div className={isFighter1Winner ? "text-green-400" : "text-red-400"}>{formatOdds(fight.opening_odds_fighter_1)}</div>
                      <div className={!isFighter1Winner ? "text-green-400" : "text-red-400"}>{formatOdds(fight.opening_odds_fighter_2)}</div>
                    </TableCell>
                     <TableCell className="text-center font-mono text-sm">
                      <div className={isFighter1Winner ? "text-green-400" : "text-red-400"}>{formatOdds(fight.closing_odds_fighter_1)}</div>
                      <div className={!isFighter1Winner ? "text-green-400" : "text-red-400"}>{formatOdds(fight.closing_odds_fighter_2)}</div>
                    </TableCell>
                    <TableCell className="text-slate-400">{fight.method} ({fight.time})</TableCell>
                    <TableCell className="text-slate-400 text-center">{fight.round}</TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-slate-500">
                  No historical UFC fight data found. Please upload your `ufc.csv` file.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}