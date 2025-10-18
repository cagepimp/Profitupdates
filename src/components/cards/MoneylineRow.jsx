import React from "react";

export default function MoneylineRow({ game }) {
  const ml = game.markets?.moneyline || {};
  const books = ["DraftKings", "FanDuel", "BetMGM"];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2 items-center text-sm font-semibold text-gray-700 border-b pb-2">
        <div>Sportsbook</div>
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
            {ml[b]?.away ?? (ml[b] ? ml[b].away : '-')}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 items-center text-sm">
        <div className="font-medium text-gray-600">
          Home ({game.home})
        </div>
        {books.map(b => (
          <div key={b + "-home"} className="text-center font-mono text-gray-900">
            {ml[b]?.home ?? (ml[b] ? ml[b].home : '-')}
          </div>
        ))}
      </div>
    </div>
  );
}