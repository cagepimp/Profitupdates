import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Target, Zap, Brain, AlertCircle, Loader2 } from "lucide-react";
import { analyzer10000 } from "@/api/functions";

export default function AlgorithmPredictions({ sport }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      setError(null);
      setPredictions([]);
      try {
        const res = await analyzer10000({ sport });
        if (res.data?.success) {
          setPredictions(res.data.analyzed);
        } else {
          throw new Error(res.data?.message || 'Failed to fetch predictions.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sport) {
      fetchPredictions();
    }
  }, [sport]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 75) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          Multi-Game Analysis - {sport}
          <Badge className="bg-purple-500/20 text-purple-400 ml-2">
            <Zap className="w-3 h-3 mr-1" />
            Full Slate
          </Badge>
        </CardTitle>
        <p className="text-slate-400 text-sm">Aggregated AI predictions for the upcoming week.</p>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <p className="ml-4 text-slate-300">Analyzing {sport} slate...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-64 text-red-400 bg-red-900/20 rounded-lg">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="font-semibold">Error Fetching Predictions</p>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {!loading && !error && predictions.length === 0 && (
           <div className="text-center py-12">
             <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
             <p className="text-slate-400">No predictions available for the current schedule.</p>
             <p className="text-slate-500 text-sm mt-1">Fetch live data to generate new predictions.</p>
           </div>
        )}
        
        {!loading && !error && predictions.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-900">
                  <TableHead className="text-white">Game</TableHead>
                  <TableHead className="text-white text-center">Projected Winner</TableHead>
                  <TableHead className="text-white text-center">Confidence</TableHead>
                  <TableHead className="text-white text-center">Total Prediction</TableHead>
                  <TableHead className="text-white text-center">Weather</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.map((p, index) => (
                  <TableRow key={index} className="border-slate-800">
                    <TableCell className="font-medium text-slate-200">{p.game}</TableCell>
                    <TableCell className="text-center font-semibold text-cyan-400">{p.projectedWinner}</TableCell>
                    <TableCell className={`text-center font-bold ${getConfidenceColor(p.modelConfidence)}`}>
                      {p.modelConfidence}%
                    </TableCell>
                    <TableCell className="text-center">{p.totalPrediction.toFixed(1)}</TableCell>
                    <TableCell className="text-center">{p.weather}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}