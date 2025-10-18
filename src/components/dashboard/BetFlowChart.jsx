import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

const mockData = [
  { game: 'Cowboys vs Eagles', public: 65, sharp: 35 },
  { game: 'Chiefs vs Bills', public: 45, sharp: 55 },
  { game: 'Packers vs Bears', public: 78, sharp: 22 },
  { game: '49ers vs Rams', public: 52, sharp: 48 },
  { game: 'Ravens vs Steelers', public: 38, sharp: 62 },
];

export default function BetFlowChart({ selectedSport }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Public vs Sharp Money Flow</CardTitle>
        <p className="text-slate-400 text-sm">Bet distribution analysis for {selectedSport}</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="game" 
                stroke="#64748b"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Legend />
              <Bar 
                dataKey="public" 
                fill="#ef4444" 
                name="Public Money %"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="sharp" 
                fill="#22c55e" 
                name="Sharp Money %"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}