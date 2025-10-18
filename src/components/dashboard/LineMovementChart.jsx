import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

const mockData = [
  { time: '10:00', dk: -110, fd: -115 },
  { time: '10:30', dk: -105, fd: -120 },
  { time: '11:00', dk: -108, fd: -118 },
  { time: '11:30', dk: -112, fd: -115 },
  { time: '12:00', dk: -115, fd: -110 },
  { time: '12:30', dk: -118, fd: -108 },
  { time: '13:00', dk: -120, fd: -105 },
];

export default function LineMovementChart({ selectedSport }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Line Movement Tracker</CardTitle>
        <p className="text-slate-400 text-sm">Cowboys vs Eagles - Over/Under</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="dk" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                name="DraftKings"
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="fd" 
                stroke="#06b6d4" 
                strokeWidth={3}
                name="FanDuel"
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}