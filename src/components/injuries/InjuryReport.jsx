
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";

export default function InjuryReport({ players, isLoading }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'out': return 'bg-red-500/20 text-red-400';
      case 'doubtful': return 'bg-orange-500/20 text-orange-400';
      case 'questionable': return 'bg-yellow-500/20 text-yellow-400';
      case 'ir': return 'bg-red-600/20 text-red-300';
      case 'pup': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Loading Injury Report...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse bg-slate-800 rounded-md" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Active Injuries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="text-white">Player</TableHead>
              <TableHead className="text-white">Team</TableHead>
              <TableHead className="text-white">Position</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Injury</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.length > 0 ? players.map((player) => (
              <TableRow key={player.id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-medium text-white">{player.player_name}</TableCell>
                <TableCell className="text-slate-300">{player.team}</TableCell>
                <TableCell className="text-slate-300">{player.position || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(player.injury_status)}>
                      {(player.injury_status || 'unknown').toUpperCase()}
                    </Badge>
                    {player.designation && (
                      <Badge variant="outline" className="text-xs">
                        {player.designation}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-slate-300">
                  {player.injury_description || player.prop_type?.replace(/_/g, ' ') || 'Unknown'}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                  No injuries matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
