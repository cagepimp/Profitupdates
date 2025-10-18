import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Target, 
  Bell,
  Filter
} from "lucide-react";

const filterOptions = [
  { id: 'all', label: 'All Alerts', icon: Bell },
  { id: 'unread', label: 'Unread', icon: Bell },
  { id: 'critical', label: 'Critical', icon: AlertTriangle },
  { id: 'high', label: 'High Priority', icon: TrendingUp },
  { id: 'line_movement', label: 'Line Movement', icon: TrendingUp },
  { id: 'sharp_action', label: 'Sharp Action', icon: Target }
];

export default function AlertFilters({ currentFilter, onFilterChange, stats }) {
  const getCount = (filterId) => {
    switch(filterId) {
      case 'unread': return stats.total;
      case 'critical': return stats.critical;
      case 'high': return stats.high;
      default: return null;
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <Filter className="w-4 h-4" />
        Filter by:
      </div>
      {filterOptions.map((option) => {
        const count = getCount(option.id);
        const IconComponent = option.icon;
        
        return (
          <Button
            key={option.id}
            variant={currentFilter === option.id ? "default" : "outline"}
            size="sm"
            className={`flex items-center gap-2 ${
              currentFilter === option.id
                ? "bg-sky-600 hover:bg-sky-700 text-white"
                : "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            onClick={() => onFilterChange(option.id)}
          >
            <IconComponent className="w-3 h-3" />
            <span>{option.label}</span>
            {count !== null && count > 0 && (
              <Badge 
                variant="secondary" 
                className={currentFilter === option.id 
                  ? "bg-sky-700 text-white" 
                  : "bg-slate-700 text-slate-300"
                }
              >
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}