
// Universal Roster Service - Handles rosters across all sports
class UniversalRosterService {

  // Get roster for specific team and sport
  static getRosterForTeam(rostersData, teamName, sport) {
    if (!rostersData || !teamName || !sport) {
      // Original console.log removed as per outline, adding a new one for clarity in this specific fallback path
      console.log(`Input validation failed for getRosterForTeam (rostersData, teamName, or sport missing). Using fallback.`);
      return this.getFallbackRoster(teamName, sport);
    }

    // The outline implies that 'rostersData' itself is the object containing team rosters,
    // not an object with a 'rosters' property like in the original implementation.
    // The original logic for direct vs. partial match is also streamlined into one find operation.
    const teamKey = Object.keys(rostersData).find(key => 
      key.toLowerCase().includes(teamName.toLowerCase()) ||
      teamName.toLowerCase().includes(key.toLowerCase())
    );

    if (teamKey && rostersData[teamKey]) {
      // Original console.log statements for found rosters removed as per outline
      return rostersData[teamKey];
    }

    // If no roster found (after direct and partial match attempts), use fallback
    // Original console.log statements for no roster found removed as per outline
    return this.getFallbackRoster(teamName, sport);
  }

  // Comprehensive fallback rosters for all teams
  static getFallbackRoster(teamName, sport) {
    const fallbackRosters = {
      'NFL': {
        // AFC East
        "Miami Dolphins": { QB: "Tua Tagovailoa", RB: "De'Von Achane", WR1: "Tyreek Hill", WR2: "Jaylen Waddle", TE: "Durham Smythe", DEF: "Miami Defense" },
        "Buffalo Bills": { QB: "Josh Allen", RB: "James Cook", WR1: "Stefon Diggs", WR2: "Gabe Davis", TE: "Dawson Knox", DEF: "Buffalo Defense" },
        "New York Jets": { QB: "Aaron Rodgers", RB: "Breece Hall", WR1: "Garrett Wilson", WR2: "Mike Williams", TE: "Tyler Conklin", DEF: "NY Jets Defense" },
        "New England Patriots": { QB: "Drake Maye", RB: "Rhamondre Stevenson", WR1: "DeMario Douglas", WR2: "Kendrick Bourne", TE: "Hunter Henry", DEF: "New England Defense" },
        
        // AFC North
        "Baltimore Ravens": { QB: "Lamar Jackson", RB: "Derrick Henry", WR1: "Zay Flowers", WR2: "Rashod Bateman", TE: "Mark Andrews", DEF: "Baltimore Defense" },
        "Cincinnati Bengals": { QB: "Joe Burrow", RB: "Chase Brown", WR1: "Ja'Marr Chase", WR2: "Tee Higgins", TE: "Mike Gesicki", DEF: "Cincinnati Defense" },
        "Pittsburgh Steelers": { QB: "Russell Wilson", RB: "Najee Harris", WR1: "George Pickens", WR2: "Calvin Austin III", TE: "Pat Freiermuth", DEF: "Pittsburgh Defense" },
        "Cleveland Browns": { QB: "Jameis Winston", RB: "Nick Chubb", WR1: "Amari Cooper", WR2: "Jerry Jeudy", TE: "David Njoku", DEF: "Cleveland Defense" },
        
        // AFC South
        "Houston Texans": { QB: "C.J. Stroud", RB: "Joe Mixon", WR1: "Nico Collins", WR2: "Stefon Diggs", TE: "Dalton Schultz", DEF: "Houston Defense" },
        "Indianapolis Colts": { QB: "Anthony Richardson", RB: "Jonathan Taylor", WR1: "Michael Pittman Jr.", WR2: "Josh Downs", TE: "Mo Alie-Cox", DEF: "Indianapolis Defense" },
        "Tennessee Titans": { QB: "Will Levis", RB: "Tony Pollard", WR1: "DeAndre Hopkins", WR2: "Calvin Ridley", TE: "Chig Okonkwo", DEF: "Tennessee Defense" },
        "Jacksonville Jaguars": { QB: "Trevor Lawrence", RB: "Travis Etienne Jr.", WR1: "Brian Thomas Jr.", WR2: "Christian Kirk", TE: "Evan Engram", DEF: "Jacksonville Defense" },
        
        // AFC West
        "Kansas City Chiefs": { QB: "Patrick Mahomes", RB: "Isiah Pacheco", WR1: "DeAndre Hopkins", WR2: "Xavier Worthy", TE: "Travis Kelce", DEF: "Kansas City Defense" },
        "Los Angeles Chargers": { QB: "Justin Herbert", RB: "J.K. Dobbins", WR1: "Keenan Allen", WR2: "Quentin Johnston", TE: "Will Dissly", DEF: "LA Chargers Defense" },
        "Denver Broncos": { QB: "Bo Nix", RB: "Javonte Williams", WR1: "Courtland Sutton", WR2: "Jerry Jeudy", TE: "Greg Dulcich", DEF: "Denver Defense" },
        "Las Vegas Raiders": { QB: "Gardner Minshew", RB: "Alexander Mattison", WR1: "Davante Adams", WR2: "Jakobi Meyers", TE: "Brock Bowers", DEF: "Las Vegas Defense" },
        
        // NFC East
        "New York Giants": { QB: "Daniel Jones", RB: "Tyrone Tracy Jr.", WR1: "Malik Nabers", WR2: "Darius Slayton", TE: "Darren Waller", DEF: "NY Giants Defense" },
        "Philadelphia Eagles": { QB: "Jalen Hurts", RB: "Saquon Barkley", WR1: "A.J. Brown", WR2: "DeVonta Smith", TE: "Dallas Goedert", DEF: "Philadelphia Defense" },
        "Dallas Cowboys": { QB: "Dak Prescott", RB: "Rico Dowdle", WR1: "CeeDee Lamb", WR2: "Brandin Cooks", TE: "Jake Ferguson", DEF: "Dallas Defense" },
        "Washington Commanders": { QB: "Jayden Daniels", RB: "Brian Robinson Jr.", WR1: "Terry McLaurin", WR2: "Noah Brown", TE: "Zach Ertz", DEF: "Washington Defense" },
        
        // NFC North
        "Detroit Lions": { QB: "Jared Goff", RB: "Jahmyr Gibbs", WR1: "Amon-Ra St. Brown", WR2: "Jameson Williams", TE: "Sam LaPorta", DEF: "Detroit Defense" },
        "Minnesota Vikings": { QB: "Sam Darnold", RB: "Aaron Jones", WR1: "Justin Jefferson", WR2: "Jordan Addison", TE: "T.J. Hockenson", DEF: "Minnesota Defense" },
        "Green Bay Packers": { QB: "Jordan Love", RB: "Josh Jacobs", WR1: "Jayden Reed", WR2: "Romeo Doubs", TE: "Tucker Kraft", DEF: "Green Bay Defense" },
        "Chicago Bears": { QB: "Caleb Williams", RB: "D'Andre Swift", WR1: "DJ Moore", WR2: "Rome Odunze", TE: "Cole Kmet", DEF: "Chicago Defense" },
        
        // NFC South
        "Atlanta Falcons": { QB: "Kirk Cousins", RB: "Bijan Robinson", WR1: "Drake London", WR2: "Darnell Mooney", TE: "Kyle Pitts", DEF: "Atlanta Defense" },
        "Tampa Bay Buccaneers": { QB: "Baker Mayfield", RB: "Rachaad White", WR1: "Mike Evans", WR2: "Chris Godwin", TE: "Cade Otton", DEF: "Tampa Bay Defense" },
        "New Orleans Saints": { QB: "Derek Carr", RB: "Alvin Kamara", WR1: "Chris Olave", WR2: "Rashid Shaheed", TE: "Juwan Johnson", DEF: "New Orleans Defense" },
        "Carolina Panthers": { QB: "Bryce Young", RB: "Chuba Hubbard", WR1: "Diontae Johnson", WR2: "Xavier Legette", TE: "Ja'Tavion Sanders", DEF: "Carolina Defense" },
        
        // NFC West
        "San Francisco 49ers": { QB: "Brock Purdy", RB: "Jordan Mason", WR1: "Deebo Samuel", WR2: "Brandon Aiyuk", TE: "George Kittle", DEF: "San Francisco Defense" },
        "Seattle Seahawks": { QB: "Geno Smith", RB: "Kenneth Walker III", WR1: "DK Metcalf", WR2: "Tyler Lockett", TE: "Noah Fant", DEF: "Seattle Defense" },
        "Arizona Cardinals": { QB: "Kyler Murray", RB: "James Conner", WR1: "Marvin Harrison Jr.", WR2: "Michael Wilson", TE: "Trey McBride", DEF: "Arizona Defense" },
        "Los Angeles Rams": { QB: "Matthew Stafford", RB: "Kyren Williams", WR1: "Cooper Kupp", WR2: "Puka Nacua", TE: "Tyler Higbee", DEF: "LA Rams Defense" }
      },
      
      'CFB': {
        "Georgia Bulldogs": { QB: "Carson Beck", RB: "Trevor Etienne", WR1: "Ladd McConkey", WR2: "Marcus Rosemy-Jacksaint", TE: "Brock Bowers", DEF_STAR: "Mykel Williams" },
        "Alabama Crimson Tide": { QB: "Jalen Milroe", RB: "Justice Haynes", WR1: "Ryan Williams", WR2: "Germie Bernard", TE: "CJ Dippre", DEF_STAR: "Jihaad Campbell" },
        "Michigan Wolverines": { QB: "Davis Warren", RB: "Kalel Mullings", WR1: "Tyler Morris", WR2: "Semaj Morgan", TE: "Colston Loveland", DEF_STAR: "Mason Graham" },
        "Ohio State Buckeyes": { QB: "Will Howard", RB: "TreVeyon Henderson", WR1: "Jeremiah Smith", WR2: "Emeka Egbuka", TE: "Gee Scott Jr.", DEF_STAR: "Jack Sawyer" },
        "Texas Longhorns": { QB: "Quinn Ewers", RB: "Quintrevion Wisner", WR1: "Isaiah Bond", WR2: "Ryan Wingo", TE: "Gunnar Helm", DEF_STAR: "Jahdae Barron" },
        "Oklahoma Sooners": { QB: "Jackson Arnold", RB: "Jovantae Barnes", WR1: "Deion Burks", WR2: "Jalil Farooq", TE: "Bauer Sharp", DEF_STAR: "R Mason Thomas" }
      },
      
      'NBA': {
        "Los Angeles Lakers": { PG: "D'Angelo Russell", SG: "Austin Reaves", SF: "LeBron James", PF: "Anthony Davis", C: "Christian Wood", SIXTH_MAN: "Rui Hachimura" },
        "Boston Celtics": { PG: "Jrue Holiday", SG: "Derrick White", SF: "Jayson Tatum", PF: "Jaylen Brown", C: "Kristaps Porzingis", SIXTH_MAN: "Payton Pritchard" },
        "Golden State Warriors": { PG: "Stephen Curry", SG: "Klay Thompson", SF: "Andrew Wiggins", PF: "Draymond Green", C: "Trayce Jackson-Davis", SIXTH_MAN: "Chris Paul" },
        "Phoenix Suns": { PG: "Tyus Jones", SG: "Devin Booker", SF: "Kevin Durant", PF: "Ryan Dunn", C: "Jusuf Nurkic", SIXTH_MAN: "Grayson Allen" }
      },

      'MLB': {
        "New York Yankees": { SP: "Gerrit Cole", CP: "Clay Holmes", C: "Austin Wells", "1B": "Anthony Rizzo", "2B": "Gleyber Torres", "3B": "Jazz Chisholm Jr.", SS: "Anthony Volpe", LF: "Alex Verdugo", CF: "Aaron Judge", RF: "Juan Soto", DH: "Giancarlo Stanton" },
        "Los Angeles Dodgers": { SP: "Walker Buehler", CP: "Evan Phillips", C: "Will Smith", "1B": "Freddie Freeman", "2B": "Gavin Lux", "3B": "Max Muncy", SS: "Tommy Edman", LF: "Teoscar Hernandez", CF: "Chris Taylor", RF: "Mookie Betts", DH: "Shohei Ohtani" }
      }
    };

    const roster = fallbackRosters[sport]?.[teamName];
    if (roster) {
      console.log(`✅ Using fallback roster for ${teamName}:`, roster);
      return roster;
    }

    console.log(`❌ No fallback roster available for ${teamName} in ${sport}`);
    // The original switch statement to return default structures based on sport
    // has been removed as per the outline, now always returning an empty object.
    return {};
  }

  // Get all team rosters for a sport
  // Note: Due to changes in getFallbackRoster, this method will now always return an empty object
  // if `teamName` is an empty string, as no specific team roster will be found.
  static getAllRostersForSport(sport) {
    const fallbackRosters = this.getFallbackRoster('', sport);
    return fallbackRosters[sport] || {}; // This will now typically return an empty object {}
  }
}

export default UniversalRosterService;
