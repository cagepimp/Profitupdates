import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const StatCard = ({ icon: Icon, title, value, change, changeType }) => {
  const isPositive = changeType === 'positive';
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <Icon className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">{title}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          </div>
          {change && (
            <div className={`text-sm font-semibold ${changeColor}`}>
              {change}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;