import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function InjuryFilters({ onFilterChange, currentFilters }) {
  const sports = ["NFL", "CFB", "NBA", "MLB"];
  const statuses = ['all', 'questionable', 'doubtful', 'out'];

  const handleFilter = (key, value) => {
    onFilterChange(prev => ({...prev, [key]: value}));
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Select value={currentFilters.sport} onValueChange={(v) => handleFilter('sport', v)}>
        <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sports.map(sport => (
            <SelectItem key={sport} value={sport}>{sport}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentFilters.status} onValueChange={(v) => handleFilter('status', v)}>
        <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
          <SelectValue placeholder="Injury Status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map(status => (
            <SelectItem key={status} value={status} className="capitalize">
              {status === 'all' ? 'All Statuses' : status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search player or team..."
          value={currentFilters.search}
          onChange={(e) => handleFilter('search', e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>
    </div>
  );
}