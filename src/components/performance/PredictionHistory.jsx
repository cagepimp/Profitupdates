import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';

export default function PredictionHistory({ title, results, isLoading }) {
  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'win': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'loss': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <MinusCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-800 rounded animate-pulse" />
            ))
          ) : results.length > 0 ? (
            results.slice(0, 20).map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-medium">{item.description}</p>
                  <p className="text-slate-400 text-sm">
                    Prediction: <span className="text-purple-400">{item.prediction.selection}</span> ({item.prediction.odds})
                  </p>
                </div>
                <div className="flex items-center gap-4 w-1/3 justify-end">
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Actual</p>
                    <p className="text-white font-mono">{item.result}</p>
                  </div>
                  {getOutcomeIcon(item.outcome)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">No prediction history found.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}