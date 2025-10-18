import React from "react";

export default function TotalRow({ game }) {
  const total = game.markets?.total || {};
  const books = ["DraftKings", "FanDuel", "BetMGM"];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2 items-center text-sm font-semibold text-gray-700 border-b pb-2">
        <div>Total (O/U)</div>
        {books.map(b => (
          <div key={b} className="text-center">{b}</div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 items-center text-sm">
        <div className="font-medium text-gray-600">
          Over
        </div>
        {books.map(b => (
          <div key={b + "-over"} className="text-center font-mono text-gray-900">
            {total[b]?.over ?? (total[b] ? total[b].over : '-')}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 items-center text-sm">
        <div className="font-medium text-gray-600">
          Under
        </div>
        {books.map(b => (
          <div key={b + "-under"} className="text-center font-mono text-gray-900">
            {total[b]?.under ?? (total[b] ? total[b].under : '-')}
          </div>
        ))}
      </div>
    </div>
  );
}