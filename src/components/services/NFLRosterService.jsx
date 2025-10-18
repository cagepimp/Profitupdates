import { InvokeLLM } from "@/api/integrations";

export class NFLRosterService {
  static async getCurrentRosters() {
    // Return reliable current NFL roster data
    return {
      "Arizona Cardinals": {
        QB: "Kyler Murray",
        RB: "James Conner",
        WR1: "Marvin Harrison Jr.",
        WR2: "Michael Wilson",
        TE: "Trey McBride"
      },
      "Atlanta Falcons": {
        QB: "Kirk Cousins",
        RB: "Bijan Robinson",
        WR1: "Drake London",
        WR2: "Darnell Mooney",
        TE: "Kyle Pitts"
      },
      "Baltimore Ravens": {
        QB: "Lamar Jackson",
        RB: "Derrick Henry",
        WR1: "Zay Flowers",
        WR2: "Rashod Bateman",
        TE: "Mark Andrews"
      },
      "Buffalo Bills": {
        QB: "Josh Allen",
        RB: "James Cook",
        WR1: "Stefon Diggs",
        WR2: "Khalil Shakir",
        TE: "Dawson Knox"
      },
      "Carolina Panthers": {
        QB: "Bryce Young",
        RB: "Chuba Hubbard",
        WR1: "Diontae Johnson",
        WR2: "Adam Thielen",
        TE: "Tommy Tremble"
      },
      "Chicago Bears": {
        QB: "Caleb Williams",
        RB: "D'Andre Swift",
        WR1: "DJ Moore",
        WR2: "Rome Odunze",
        TE: "Cole Kmet"
      },
      "Cincinnati Bengals": {
        QB: "Joe Burrow",
        RB: "Chase Brown",
        WR1: "Ja'Marr Chase",
        WR2: "Tee Higgins",
        TE: "Mike Gesicki"
      },
      "Cleveland Browns": {
        QB: "Deshaun Watson",
        RB: "Nick Chubb",
        WR1: "Amari Cooper",
        WR2: "Jerry Jeudy",
        TE: "David Njoku"
      },
      "Dallas Cowboys": {
        QB: "Dak Prescott",
        RB: "Ezekiel Elliott",
        WR1: "CeeDee Lamb",
        WR2: "Brandin Cooks",
        TE: "Jake Ferguson"
      },
      "Denver Broncos": {
        QB: "Bo Nix",
        RB: "Javonte Williams",
        WR1: "Courtland Sutton",
        WR2: "Jerry Jeudy",
        TE: "Greg Dulcich"
      },
      "Detroit Lions": {
        QB: "Jared Goff",
        RB: "Jahmyr Gibbs",
        WR1: "Amon-Ra St. Brown",
        WR2: "Jameson Williams",
        TE: "Sam LaPorta"
      },
      "Green Bay Packers": {
        QB: "Jordan Love",
        RB: "Josh Jacobs",
        WR1: "Jayden Reed",
        WR2: "Christian Watson",
        TE: "Tucker Kraft"
      },
      "Houston Texans": {
        QB: "C.J. Stroud",
        RB: "Joe Mixon",
        WR1: "Nico Collins",
        WR2: "Stefon Diggs",
        TE: "Dalton Schultz"
      },
      "Indianapolis Colts": {
        QB: "Anthony Richardson",
        RB: "Jonathan Taylor",
        WR1: "Michael Pittman Jr.",
        WR2: "Josh Downs",
        TE: "Mo Alie-Cox"
      },
      "Jacksonville Jaguars": {
        QB: "Trevor Lawrence",
        RB: "Travis Etienne Jr.",
        WR1: "Brian Thomas Jr.",
        WR2: "Christian Kirk",
        TE: "Evan Engram"
      },
      "Kansas City Chiefs": {
        QB: "Patrick Mahomes",
        RB: "Isiah Pacheco",
        WR1: "DeAndre Hopkins",
        WR2: "Xavier Worthy",
        TE: "Travis Kelce"
      },
      "Las Vegas Raiders": {
        QB: "Gardner Minshew",
        RB: "Alexander Mattison",
        WR1: "Davante Adams",
        WR2: "Jakobi Meyers",
        TE: "Brock Bowers"
      },
      "Los Angeles Chargers": {
        QB: "Justin Herbert",
        RB: "J.K. Dobbins",
        WR1: "Ladd McConkey",
        WR2: "Josh Palmer",
        TE: "Will Dissly"
      },
      "Los Angeles Rams": {
        QB: "Matthew Stafford",
        RB: "Kyren Williams",
        WR1: "Cooper Kupp",
        WR2: "Puka Nacua",
        TE: "Tyler Higbee"
      },
      "Miami Dolphins": {
        QB: "Tua Tagovailoa",
        RB: "De'Von Achane",
        WR1: "Tyreek Hill",
        WR2: "Jaylen Waddle",
        TE: "Jonnu Smith"
      },
      "Minnesota Vikings": {
        QB: "Sam Darnold",
        RB: "Aaron Jones",
        WR1: "Justin Jefferson",
        WR2: "Jordan Addison",
        TE: "T.J. Hockenson"
      },
      "New England Patriots": {
        QB: "Drake Maye",
        RB: "Rhamondre Stevenson",
        WR1: "DeMario Douglas",
        WR2: "K.J. Osborn",
        TE: "Hunter Henry"
      },
      "New Orleans Saints": {
        QB: "Derek Carr",
        RB: "Alvin Kamara",
        WR1: "Chris Olave",
        WR2: "Rashid Shaheed",
        TE: "Taysom Hill"
      },
      "New York Giants": {
        QB: "Daniel Jones",
        RB: "Tyrone Tracy Jr.",
        WR1: "Malik Nabers",
        WR2: "Darius Slayton",
        TE: "Theo Johnson"
      },
      "New York Jets": {
        QB: "Aaron Rodgers",
        RB: "Breece Hall",
        WR1: "Garrett Wilson",
        WR2: "Davante Adams",
        TE: "Tyler Conklin"
      },
      "Philadelphia Eagles": {
        QB: "Jalen Hurts",
        RB: "Saquon Barkley",
        WR1: "A.J. Brown",
        WR2: "DeVonta Smith",
        TE: "Dallas Goedert"
      },
      "Pittsburgh Steelers": {
        QB: "Russell Wilson",
        RB: "Najee Harris",
        WR1: "George Pickens",
        WR2: "Calvin Austin III",
        TE: "Pat Freiermuth"
      },
      "San Francisco 49ers": {
        QB: "Brock Purdy",
        RB: "Christian McCaffrey",
        WR1: "Deebo Samuel",
        WR2: "Brandon Aiyuk",
        TE: "George Kittle"
      },
      "Seattle Seahawks": {
        QB: "Geno Smith",
        RB: "Kenneth Walker III",
        WR1: "DK Metcalf",
        WR2: "Tyler Lockett",
        TE: "Noah Fant"
      },
      "Tampa Bay Buccaneers": {
        QB: "Baker Mayfield",
        RB: "Rachaad White",
        WR1: "Mike Evans",
        WR2: "Chris Godwin",
        TE: "Cade Otton"
      },
      "Tennessee Titans": {
        QB: "Will Levis",
        RB: "Tony Pollard",
        WR1: "Calvin Ridley",
        WR2: "DeAndre Hopkins",
        TE: "Chig Okonkwo"
      },
      "Washington Commanders": {
        QB: "Jayden Daniels",
        RB: "Brian Robinson Jr.",
        WR1: "Terry McLaurin",
        WR2: "Noah Brown",
        TE: "Zach Ertz"
      }
    };
  }

  static getRosterForTeam(rosters, teamName) {
    // Try exact match first
    if (rosters[teamName]) {
      return rosters[teamName];
    }

    // Try case insensitive match
    const matchingKey = Object.keys(rosters).find(key => 
      key.toLowerCase() === teamName.toLowerCase()
    );
    
    if (matchingKey) {
      return rosters[matchingKey];
    }

    // Try partial match
    const partialMatch = Object.keys(rosters).find(key => 
      key.toLowerCase().includes(teamName.toLowerCase()) || 
      teamName.toLowerCase().includes(key.toLowerCase())
    );
    
    if (partialMatch) {
      return rosters[partialMatch];
    }

    // Return fallback
    return {
      QB: `${teamName} QB`,
      RB: `${teamName} RB`,
      WR1: `${teamName} WR1`,
      WR2: `${teamName} WR2`,
      TE: `${teamName} TE`
    };
  }
}

export default NFLRosterService;