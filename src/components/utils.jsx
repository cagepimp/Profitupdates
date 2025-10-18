
export function hasLiveGames(games) {
  // A simple check for now, can be replaced with real logic later
  return games && games.length > 0;
}

export const mockData = {
  NFL: [
    {
      home: "Chiefs",
      away: "Bills",
      startTime: "Sun 8:20 PM",
      spread: "-3.5",
      total: "52.5",
      moneyline: "-160",
      playerProps: [
        { player: "Patrick Mahomes", market: "Pass Yards O/U 285.5", odds: "-110" },
      ],
    },
  ],
  CFB: [
    {
      home: "Alabama",
      away: "Georgia",
      startTime: "Sat 7:00 PM",
      spread: "-2.5",
      total: "49.5",
      moneyline: "-130",
      playerProps: [],
    },
  ],
  MLB: [],
  NBA: [],
  Golf: [],
  UFC: [],
};
