import { createClientFromRequest } from "npm:@base44/sdk@0.7.1";

/**
 * Analyzer 10000+ - LLM-Powered Qualitative Game Analysis
 * Complements the mathematical Model v1.0 with contextual insights,
 * trends, key players, and narrative analysis.
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sport, gameId, limit = 10 } = body;

    console.log(`🧠 Analyzer 10000+: Starting analysis for ${sport} game ${gameId || 'all'}`);

    // Fetch game(s) from database
    let games = [];
    if (gameId) {
      const game = await base44.asServiceRole.entities.Game.filter({ id: gameId });
      games = game;
    } else {
      // Get games sorted by date, limit to avoid timeout
      const allGames = await base44.asServiceRole.entities.Game.filter({ sport }, 'game_date');
      games = allGames.slice(0, limit);
    }

    if (!games || games.length === 0) {
      console.warn(`⚠️ No games found for ${sport}`);
      return Response.json({ 
        success: false, 
        message: `No ${sport} games found in database` 
      });
    }

    console.log(`✅ Found ${games.length} games to analyze (limited to ${limit})`);

    const results = [];

    for (const game of games) {
      const { home_team, away_team, game_date, markets, commence_time } = game;
      const location = game.venue || home_team || 'Unknown';
      
      // Format game time
      const gameTime = new Date(commence_time || game_date).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/New_York'
      });

      console.log(`🔍 Analyzing: ${away_team} @ ${home_team}`);

      // Extract odds data for better context
      const oddsContext = formatOddsForPrompt(markets);

      // Build comprehensive prompt for LLM
      const prompt = `You are Analyzer 10000+, an elite sports betting analysis AI with a track record of 67% accuracy on spread picks and 71% on totals.

**MATCHUP**: ${away_team} at ${home_team}
**SPORT**: ${sport}
**GAME TIME**: ${gameTime} ET
**LOCATION**: ${location}

**CURRENT BETTING MARKETS**:
${oddsContext}

**YOUR MISSION**:
Provide sharp, actionable betting analysis. Focus on EDGE and VALUE, not general predictions.

**ANALYZE THESE KEY FACTORS**:

1. **Recent Form & Momentum** (Last 5 games)
   - Win/loss streaks, scoring trends
   - Performance vs spread (ATS records)
   - Home/away splits

2. **Head-to-Head History**
   - Last 3 meetings, outcomes, scoring
   - Does one team have a stylistic advantage?

3. **Injury & Roster Impact**
   - Key players out/questionable
   - Quantify the impact (e.g., "Star QB out = -6 points")

4. **Situational Edges**
   - Rest advantage (days off)
   - Travel distance (cross-country vs divisional)
   - Schedule spot (trap game, lookahead, revenge)
   - Motivation factors (playoff race, rivalry)

5. **Weather Conditions** (for outdoor sports)
   - Temperature, wind speed, precipitation
   - Historical total impacts (e.g., "Wind >15mph = Under 78%")

6. **Line Movement & Betting Trends**
   - Sharp money indicators
   - Public betting percentages
   - Reverse line movement (RLM)

7. **Statistical Edges**
   - Pace, efficiency ratings, defensive matchups
   - Specific advantages (e.g., "Pass defense vs pass-heavy offense")

**CRITICAL**: 
- Be specific with numbers and statistics
- Identify CONTRARIAN opportunities (when to fade the public)
- Note any "too good to be true" lines (potential traps)
- Assign confidence levels based on edge strength

Return structured JSON analysis.`;

      try {
        const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              prediction: {
                type: "object",
                properties: {
                  winner: { type: "string", description: "Team name" },
                  spread_pick: { type: "string", description: "Team and spread (e.g., 'Away +3.5')" },
                  spread_confidence: { type: "number", description: "0-100 confidence" },
                  total_pick: { type: "string", description: "Over or Under with number" },
                  total_confidence: { type: "number", description: "0-100 confidence" },
                  moneyline_value: { type: "string", description: "Best ML value if any" }
                },
                required: ["winner", "spread_pick", "spread_confidence", "total_pick", "total_confidence"]
              },
              edge_summary: { 
                type: "string", 
                description: "One sentence explaining the biggest edge in this game"
              },
              key_trends: { 
                type: "array", 
                items: { type: "string" },
                description: "Specific betting trends with stats",
                minItems: 3,
                maxItems: 5
              },
              key_players: { 
                type: "array", 
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    impact: { type: "string", description: "How they'll affect the game" }
                  }
                },
                minItems: 3,
                maxItems: 5
              },
              recommended_bets: { 
                type: "array", 
                items: {
                  type: "object",
                  properties: {
                    bet: { type: "string", description: "Specific bet (e.g., 'Lakers -5.5')" },
                    book: { type: "string", description: "Best book for this line" },
                    reasoning: { type: "string" },
                    confidence: { type: "number", description: "0-100" },
                    units: { type: "number", description: "Recommended unit size (0.5-3)" }
                  },
                  required: ["bet", "reasoning", "confidence", "units"]
                },
                minItems: 1,
                maxItems: 3
              },
              sharp_indicators: { 
                type: "object",
                properties: {
                  sharp_side: { type: "string" },
                  public_side: { type: "string" },
                  line_movement: { type: "string" },
                  reverse_line_movement: { type: "boolean" }
                }
              },
              weather_impact: { 
                type: "string",
                description: "Weather conditions and betting impact (if outdoor sport)"
              },
              injuries: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    player: { type: "string" },
                    status: { type: "string" },
                    impact: { type: "string" }
                  }
                }
              },
              contrarian_opportunity: {
                type: "boolean",
                description: "Is this a fade-the-public spot?"
              },
              trap_game_warning: {
                type: "boolean",
                description: "Could this line be a trap?"
              }
            },
            required: ["prediction", "edge_summary", "key_trends", "key_players", "recommended_bets", "sharp_indicators"]
          }
        });

        console.log(`✅ Analysis complete for ${away_team} @ ${home_team}`);

        results.push({
          id: game.id,
          sport,
          home: home_team,
          away: away_team,
          startTime: commence_time || game_date,
          game_date,
          markets,
          analysis: response,
          generated_at: new Date().toISOString()
        });

      } catch (error) {
        console.error(`❌ LLM analysis failed for ${away_team} @ ${home_team}:`, error.message);
        results.push({
          id: game.id,
          sport,
          home: home_team,
          away: away_team,
          startTime: commence_time || game_date,
          error: error.message,
          error_details: error.stack
        });
      }
    }

    console.log(`🏁 Analyzer 10000+ complete: ${results.length} games analyzed`);

    return Response.json({
      success: true,
      model: "Analyzer 10000+ v2.0",
      sport,
      results,
      count: results.length,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("❌ Analyzer 10000+ critical error:", err);
    return Response.json({ 
      success: false, 
      error: err.message,
      stack: err.stack
    }, { status: 500 });
  }
});

// Helper function to format odds for the LLM prompt
function formatOddsForPrompt(markets) {
  if (!markets || Object.keys(markets).length === 0) {
    return "No odds data available";
  }

  let formatted = [];

  // Moneyline
  if (markets.moneyline && Object.keys(markets.moneyline).length > 0) {
    formatted.push("**Moneyline**:");
    for (const [book, outcomes] of Object.entries(markets.moneyline)) {
      if (outcomes && outcomes.length > 0) {
        const oddsStr = outcomes.map(o => `${o.name}: ${o.price > 0 ? '+' : ''}${o.price}`).join(', ');
        formatted.push(`  ${book}: ${oddsStr}`);
      }
    }
  }

  // Spread
  if (markets.spread && Object.keys(markets.spread).length > 0) {
    formatted.push("\n**Spread**:");
    for (const [book, outcomes] of Object.entries(markets.spread)) {
      if (outcomes && outcomes.length > 0) {
        const oddsStr = outcomes.map(o => `${o.name} ${o.point > 0 ? '+' : ''}${o.point} (${o.price > 0 ? '+' : ''}${o.price})`).join(', ');
        formatted.push(`  ${book}: ${oddsStr}`);
      }
    }
  }

  // Total
  if (markets.total && Object.keys(markets.total).length > 0) {
    formatted.push("\n**Total**:");
    for (const [book, outcomes] of Object.entries(markets.total)) {
      if (outcomes && outcomes.length > 0) {
        const over = outcomes.find(o => o.name === 'Over');
        const under = outcomes.find(o => o.name === 'Under');
        if (over && under) {
          formatted.push(`  ${book}: O/U ${over.point} (O: ${over.price > 0 ? '+' : ''}${over.price}, U: ${under.price > 0 ? '+' : ''}${under.price})`);
        }
      }
    }
  }

  return formatted.length > 0 ? formatted.join('\n') : "No odds data available";
}