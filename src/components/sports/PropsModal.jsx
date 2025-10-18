import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertTriangle } from "lucide-react";

// Helper to format market keys into readable titles
const formatMarketName = (marketKey) => {
  return marketKey
    .replace('player_', '')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Formats the odds for display, including the line
const formatOdds = (oddsData, type) => {
  if (!oddsData || !oddsData[type]) return "–";
  const price = oddsData[type];
  return price > 0 ? `+${price}` : price;
};

export default function PropsModal({ isOpen, onClose, gameTitle, data, loading, error }) {

  // Create a structured array from the normalized data for easier mapping
  const propsList = React.useMemo(() => {
    if (!data) return [];
    const list = [];
    for (const playerName in data) {
      for (const marketName in data[playerName]) {
        for (const line in data[playerName][marketName]) {
          const books = data[playerName][marketName][line];
          list.push({
            player: playerName,
            market: formatMarketName(marketName),
            line,
            dk_over: formatOdds(books.draftkings, 'Over'),
            dk_under: formatOdds(books.draftkings, 'Under'),
            fd_over: formatOdds(books.fanduel, 'Over'),
            fd_under: formatOdds(books.fanduel, 'Under'),
          });
        }
      }
    }
    // Sort by player name then by market
    return list.sort((a, b) => {
      if (a.player < b.player) return -1;
      if (a.player > b.player) return 1;
      if (a.market < b.market) return -1;
      if (a.market > b.market) return 1;
      return 0;
    });
  }, [data]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-cyan-300">Player Props</DialogTitle>
          <DialogDescription className="text-slate-400">{gameTitle}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {loading && (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              <span className="ml-3 text-slate-300">Fetching live props...</span>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center h-48 bg-red-900/20 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <p className="mt-3 text-red-300">Error loading props</p>
              <p className="text-xs text-red-400 max-w-sm text-center mt-1">{error}</p>
            </div>
          )}
          {!loading && !error && propsList.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-cyan-400">Player</TableHead>
                  <TableHead className="text-cyan-400">Market</TableHead>
                  <TableHead className="text-cyan-400 text-center">Line</TableHead>
                  <TableHead className="text-cyan-400 text-center">DK Over</TableHead>
                  <TableHead className="text-cyan-400 text-center">DK Under</TableHead>
                  <TableHead className="text-cyan-400 text-center">FD Over</TableHead>
                  <TableHead className="text-cyan-400 text-center">FD Under</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propsList.map((prop, index) => (
                  <TableRow key={index} className="border-slate-800 font-mono text-sm">
                    <TableCell className="font-sans text-white">{prop.player}</TableCell>
                    <TableCell className="font-sans text-slate-300">{prop.market}</TableCell>
                    <TableCell className="text-center text-yellow-300">{prop.line}</TableCell>
                    <TableCell className="text-center text-slate-200">{prop.dk_over}</TableCell>
                    <TableCell className="text-center text-slate-200">{prop.dk_under}</TableCell>
                    <TableCell className="text-center text-slate-200">{prop.fd_over}</TableCell>
                    <TableCell className="text-center text-slate-200">{prop.fd_under}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
           {!loading && !error && propsList.length === 0 && (
             <div className="flex items-center justify-center h-48">
                <p className="text-slate-400">No player props available for this game.</p>
             </div>
           )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}