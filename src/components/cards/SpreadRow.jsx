import React from "react";

export default function SpreadRow({ game }) {
  const spread = game.markets?.spread || {};
  const books = ["DraftKings", "FanDuel", "BetMGM"];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2 items-center text-sm font-semibold text-gray-700 border-b pb-2">
        <div>Spread</div>
        {books.map(b => (
          <div key={b} className="text-center">{b}</div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 items-center text-sm">
        <div className="font-medium text-gray-600">
          Away ({game.away})
        </div>
        {books.map(b => (
          <div key={b + "-away"} className="text-center font-mono text-gray-900">
            {spread[b]?.away ?? (spread[b] ? spread[b].away : '-')}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 items-center text-sm">
        <div className="font-medium text-gray-600">
          Home ({game.home})
        </div>
        {books.map(b => (
          <div key={b + "-home"} className="text-center font-mono text-gray-900">
            {spread[b]?.home ?? (spread[b] ? spread[b].home : '-')}
          </div>
        ))}
      </div>
    </div>
  );
}