import React from "react";
import { hasLiveGames, mockData } from "../utils";

const sports = ["NFL", "CFB", "MLB", "NBA", "Golf", "UFC"];

export default function SportTabs({ active, onChange }) {
  return (
    <div className="flex space-x-1 border-b border-slate-800 mb-6">
      {sports.map((sport) => (
        <button
          key={sport}
          onClick={() => onChange(sport)}
          className={`relative px-4 py-2 font-medium text-sm rounded-t-lg transition-colors focus:outline-none ${
            active === sport
              ? "border-b-2 border-cyan-400 text-white bg-slate-800/50"
              : "text-slate-400 hover:text-white hover:bg-slate-800/30"
          }`}
        >
          {sport}
          {hasLiveGames(mockData[sport]) && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          )}
        </button>
      ))}
    </div>
  );
}