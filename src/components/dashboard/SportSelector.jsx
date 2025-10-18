import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sports = [
  { code: "NFL", name: "NFL", icon: "🏈", activeGames: 16 },
  { code: "NBA", name: "NBA", icon: "🏀", activeGames: 12 },
  { code: "MLB", name: "MLB", icon: "⚾", activeGames: 24 },
  { code: "CFB", name: "College FB", icon: "🏟️", activeGames: 45 },
  { code: "GOLF", name: "Golf", icon: "⛳", activeGames: 3 },
  { code: "UFC", name: "UFC", icon: "🥊", activeGames: 1 }
];

export default function SportSelector({ selectedSport, onSportChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {sports.map((sport) => (
        <Button
          key={sport.code}
          variant={selectedSport === sport.code ? "default" : "outline"}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
            selectedSport === sport.code
              ? "bg-white text-blue-900 hover:bg-blue-50 shadow-lg"
              : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30"
          }`}
          onClick={() => onSportChange(sport.code)}
        >
          <span className="text-xl">{sport.icon}</span>
          <span>{sport.name}</span>
          <Badge 
            variant="secondary" 
            className={selectedSport === sport.code 
              ? "bg-blue-100 text-blue-900" 
              : "bg-white/20 text-white"
            }
          >
            {sport.activeGames}
          </Badge>
        </Button>
      ))}
    </div>
  );
}