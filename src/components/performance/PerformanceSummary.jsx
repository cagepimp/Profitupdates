import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, TrendingUp, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color, isLoading }) => (
  <Card className="bg-slate-900 border-slate-800">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color || 'text-slate-400'}`} />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="h-8 bg-slate-700 rounded animate-pulse" />
      ) : (
        <div className={`text-2xl font-bold ${color || 'text-white'}`}>{value}</div>
      )}
    </CardContent>
  </Card>
);

export default function PerformanceSummary({ results, isLoading }) {
  const wins = results.filter(r => r.outcome === 'win').length;
  const losses = results.filter(r => r.outcome === 'loss').length;
  const totalGraded = wins + losses;
  const winRate = totalGraded > 0 ? ((wins / totalGraded) * 100).toFixed(1) : "0.0";

  // Simulate ROI calculation
  const totalWagered = totalGraded * 10; // Assume 10 units per bet
  const profit = (wins * 9.09) - (losses * 10); // Assume avg -110 odds
  const roi = totalWagered > 0 ? ((profit / totalWagered) * 100).toFixed(1) : "0.0";

  const stats = [
    { title: "Win Rate", value: `${winRate}%`, icon: ShieldCheck, color: "text-green-400" },
    { title: "ROI", value: `${roi > 0 ? '+' : ''}${roi}%`, icon: TrendingUp, color: roi > 0 ? "text-green-400" : "text-red-400" },
    { title: "Net Units", value: `${(profit/10).toFixed(2)}`, icon: DollarSign, color: profit > 0 ? "text-green-400" : "text-red-400" },
    { title: "Bets Graded", value: totalGraded, icon: CheckCircle, color: "text-blue-400" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <StatCard key={stat.title} {...stat} isLoading={isLoading} />
      ))}
    </div>
  );
}