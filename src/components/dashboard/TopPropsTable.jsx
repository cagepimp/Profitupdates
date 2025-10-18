import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Activity, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopPropsTable({ playerProps, isLoading }) {
  const getInjuryStatusColor = (status) => {
    switch(status) {
      case 'healthy': return 'bg-green-500/20 text-green-400';
      case 'questionable': return 'bg-yellow-500/20 text-yellow-400';
      case 'doubtful': return 'bg-orange-500/20 text-orange-400';
      case 'out': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Top Player Props
          <Badge className="bg-cyan-500/20 text-cyan-400">
            <Activity className="w-3 h-3 mr-1" />
            Live Analysis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-400">Player</TableHead>
                <TableHead className="text-slate-400">Prop</TableHead>
                <TableHead className="text-slate-400">Line</TableHead>
                <TableHead className="text-slate-400">DK Odds</TableHead>
                <TableHead className="text-slate-400">FD Odds</TableHead>
                <TableHead className="text-slate-400">Public %</TableHead>
                <TableHead className="text-slate-400">Confidence</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-slate-800">
                    <TableCell><Skeleton className="h-4 w-24 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 bg-slate-800" /></TableCell>
                  </TableRow>
                ))
              ) : (
                playerProps.slice(0, 10).map((prop) => (
                  <TableRow key={prop.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-white font-medium">
                      <div>
                        <div>{prop.player_name}</div>
                        <div className="text-slate-400 text-sm">{prop.team}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{prop.prop_type}</TableCell>
                    <TableCell className="text-white font-medium">{prop.prop_line}</TableCell>
                    <TableCell className="text-sky-400">
                      O: {prop.dk_over_odds > 0 ? '+' : ''}{prop.dk_over_odds}<br/>
                      <span className="text-slate-400">U: {prop.dk_under_odds > 0 ? '+' : ''}{prop.dk_under_odds}</span>
                    </TableCell>
                    <TableCell className="text-cyan-400">
                      O: {prop.fd_over_odds > 0 ? '+' : ''}{prop.fd_over_odds}<br/>
                      <span className="text-slate-400">U: {prop.fd_under_odds > 0 ? '+' : ''}{prop.fd_under_odds}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-white">{prop.public_bet_percentage_over}%</div>
                      <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                        <div 
                          className="bg-gradient-to-r from-sky-500 to-cyan-500 h-1 rounded-full"
                          style={{ width: `${prop.public_bet_percentage_over}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className={getConfidenceColor(prop.algorithm_confidence)}>
                      {prop.algorithm_confidence}%
                    </TableCell>
                    <TableCell>
                      <Badge className={getInjuryStatusColor(prop.injury_status)}>
                        {prop.injury_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}