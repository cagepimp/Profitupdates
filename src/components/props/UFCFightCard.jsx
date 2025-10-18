import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const getBestOddsClass = (currentOdds, allOdds) => {
    if (!currentOdds) return "";
    const numericOdds = allOdds.filter(o => o).map(o => parseInt(o.oddsAmerican, 10));
    if (numericOdds.length < 2) return "";
    const best = Math.max(...numericOdds);
    if (parseInt(currentOdds.oddsAmerican, 10) === best) {
        return "bg-green-500/20 text-green-300 font-bold";
    }
    return "";
};

const PropMarketTable = ({ marketName, props }) => {
    // Collect all odds to find the best value
    const allOddsForMarket = props.flatMap(p => [p.draftkings, p.fanduel].filter(Boolean));

    return (
        <div className="mt-4">
            <h4 className="font-semibold text-slate-300 mb-2">{marketName}</h4>
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                        <TableHead className="text-white">Selection</TableHead>
                        <TableHead className="text-white text-center">DraftKings</TableHead>
                        <TableHead className="text-white text-center">FanDuel</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {props.map((prop, index) => (
                        <TableRow key={index} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell className="font-medium">{prop.prop}{prop.line ? ` (${prop.line})` : ''}</TableCell>
                            <TableCell className={`text-center ${getBestOddsClass(prop.draftkings, allOddsForMarket)}`}>
                                {prop.draftkings?.oddsAmerican || '-'}
                            </TableCell>
                            <TableCell className={`text-center ${getBestOddsClass(prop.fanduel, allOddsForMarket)}`}>
                                {prop.fanduel?.oddsAmerican || '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default function UFCFightCard({ fight }) {
    return (
        <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
                <CardTitle className="text-xl text-white">{fight.fight_name}</CardTitle>
            </CardHeader>
            <CardContent>
                {Object.entries(fight.markets).map(([marketName, props]) => (
                    <PropMarketTable key={marketName} marketName={marketName} props={props} />
                ))}
            </CardContent>
        </Card>
    );
}