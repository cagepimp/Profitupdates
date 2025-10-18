import { createClientFromRequest } from "npm:@base44/sdk@0.7.1";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sport, gameId, analysisType = 'both' } = body;

    console.log(`🎲 Props Analyzer V3: Starting for ${sport}, type: ${analysisType}`);

    // Fetch game
    const games = await base44.asServiceRole.entities.Game.filter({ id: gameId });
    
    if (!games || games.length === 0) {
      return Response.json({ 
        success: false, 
        message: `Game ${gameId} not found` 
      });
    }

    const game = games[0];
    console.log(`✅ Found game: ${game.away_team} @ ${game.home_team}`);

    const analysis = await analyzeGameProps(base44, game, sport, analysisType);

    console.log(`🏁 Props analysis complete`);

    return Response.json({
      success: true,
      sport,
      analysisType,
      results: [{
        game_id: gameId,
        matchup: `${game.away_team} @ ${game.home_team}`,
        analysis
      }],
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("❌ Props Analyzer V3 error:", err);
    return Response.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
});

async function analyzeGameProps(base44, game, sport, analysisType) {
  const { id, home_team, away_team, game_date, commence_time, markets } = game;
  
  console.log(`🔍 Analyzing props: ${away_team} @ ${home_team}`);

  const gameTime = new Date(commence_time || game_date).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York'
  });

  const oddsContext = formatOddsForPrompt(markets);

  const prompt = buildPropsPrompt({
    sport,
    home_team,
    away_team,
    gameTime,
    oddsContext,
    analysisType
  });

  const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    add_context_from_internet: true,
    response_json_schema: getPropsAnalysisSchema(analysisType)
  });

  console.log(`✅ Props analysis complete for ${away_team} @ ${home_team}`);

  return llmResponse;
}

function buildPropsPrompt({ sport, home_team, away_team, gameTime, oddsContext, analysisType }) {
  const allPlayerPropsTypes = `
**COMPLETE PLAYER PROP TYPES - ANALYZE ALL OF THESE:**

**QUARTERBACK PROPS:**
- Passing Yards (Over/Under)
- Passing Attempts (Over/Under)
- Passing Completions (Over/Under)
- Passing Touchdowns (Over/Under)
- Interceptions Thrown (Over/Under)
- Longest Completion (Over/Under)

**RUNNING BACK / RUSHING PROPS:**
- Rushing Yards (Over/Under)
- Rushing Attempts (Over/Under)
- Rushing Touchdowns (Over/Under)
- Longest Run (Over/Under)

**RECEIVER PROPS (WR / TE / RB):**
- Receiving Yards (Over/Under)
- Receptions (Over/Under)
- Receiving Touchdowns (Over/Under)
- Longest Reception (Over/Under)

**COMBINED PROPS:**
- Total Yards / Scrimmage Yards (Rushing + Receiving combined)
- Anytime Touchdown Scorer (Yes/No)
- Multiple TDs (Over/Under 1.5 or 2+ TDs)

**KICKER / SPECIAL TEAMS PROPS:**
- Field Goals Made (Over/Under)
- Longest Field Goal (Over/Under)
- Extra Points Made (Over/Under)
- Total Kicking Points (Over/Under)

**DEFENSIVE PLAYER PROPS:**
- Sacks by defensive player/edge rusher (Over/Under)
- Tackles + Assists Combined (Over/Under)
- Solo Tackles (Over/Under)
- Assisted Tackles (Over/Under)
- Interceptions by defender (Over/Under or Yes/No)
- Forced Fumbles (Over/Under or Yes/No)
- Fumble Recoveries (Over/Under or Yes/No)
- Defensive Touchdowns (Yes/No)
- Combo Props (e.g., Sack + Interception)
`;

  const allTeamPropsTypes = `
**COMPLETE TEAM PROP TYPES - ANALYZE ALL OF THESE:**

**SCORING PROPS:**
- Team Total Points (Over/Under)
- First Half Points (Over/Under)
- Second Half Points (Over/Under)
- First Quarter Points (Over/Under)
- Second Quarter Points (Over/Under)
- Third Quarter Points (Over/Under)
- Fourth Quarter Points (Over/Under)

**YARDAGE PROPS:**
- Total Rushing Yards (Over/Under)
- Total Passing Yards (Over/Under)
- Total Offensive Yards (Over/Under)
- Longest Reception/Completion (Over/Under)
- Longest Run (Over/Under)

**DEFENSIVE PROPS:**
- Total Sacks (Over/Under)
- Total Turnovers Forced (Over/Under)
- Total Interceptions (Over/Under)
- Total Fumbles Recovered (Over/Under)
- Safety (Yes/No)
- Defensive Touchdowns Scored (Over/Under or Yes/No)

**GAME FLOW PROPS:**
- Time of Possession (Over/Under)
- First Team to Score
- Last Team to Score
- Score in Every Quarter (Yes/No)
- Lead at Halftime (Yes/No)

**SPECIAL TEAMS PROPS:**
- Total Field Goals Made (Over/Under)
- Longest Field Goal (Over/Under)
`;

  const includePlayerProps = analysisType === 'player' || analysisType === 'both';
  const includeTeamProps = analysisType === 'team' || analysisType === 'both';

  return `You are Props Analyzer V3, an elite AI that analyzes EVERY possible prop type to find the absolute best betting edges.

**MATCHUP**: ${away_team} at ${home_team}
**SPORT**: ${sport}
**GAME TIME**: ${gameTime} ET

**BETTING MARKETS**:
${oddsContext}

${includePlayerProps ? allPlayerPropsTypes : ''}
${includeTeamProps ? allTeamPropsTypes : ''}

**YOUR ANALYSIS PROCESS:**
1. **Research each prop type thoroughly** - Consider player matchups, defensive rankings, weather, injuries, recent trends, game script expectations, and historical data
2. **Calculate confidence for each viable prop** - Only props with 50%+ confidence should be considered
3. **Select the TOP 5 HIGHEST CONFIDENCE props** for each sportsbook - These should be your absolute best picks across ALL prop types
4. **Diversify prop types** - Don't just pick 5 passing yards props. Spread across different categories (passing, rushing, receiving, defense, etc.)
5. **Consider line differences** - DraftKings and FanDuel may have different lines for the same prop, creating edges

${includePlayerProps ? `
**DRAFTKINGS PLAYER PROPS - TOP 5 ANALYSIS:**
Review ALL player prop types listed above. For each major player in this game:
- QBs: Analyze all 6 passing prop types
- RBs: Analyze rushing props, receiving props, TD scorer props
- WRs/TEs: Analyze receiving props, TD scorer props
- Kickers: Analyze kicking props
- Defensive stars: Analyze sacks, tackles, INT props

Then select the TOP 5 props with the highest confidence and best edges on DraftKings.

Format:
- player: Full player name
- prop: Specific prop with line (e.g., "Passing Yards - Over 267.5", "Sacks - Over 0.5", "Anytime TD Scorer - Yes")
- confidence: 50-100 (your calculated confidence percentage)
- reasoning: 2-3 sentences explaining WHY this is a top prop (include specific stats, matchup data, trends)

**FANDUEL PLAYER PROPS - TOP 5 ANALYSIS:**
Repeat the same comprehensive analysis process for FanDuel's offerings. Note that FanDuel may have:
- Different lines than DraftKings for the same prop
- Unique prop offerings not on DraftKings
- Different juice/odds

Select the TOP 5 FanDuel player props with highest confidence.
` : ''}

${includeTeamProps ? `
**DRAFTKINGS TEAM PROPS - TOP 5 ANALYSIS:**
Review ALL team prop types listed above. For each team:
- Analyze scoring props (total points, half/quarter scoring)
- Analyze yardage props (rushing, passing, total offense)
- Analyze defensive props (sacks, turnovers, TDs)
- Analyze game flow props (time of possession, scoring patterns)
- Analyze special teams props (field goals, longest FG)

Consider:
- Offensive strength vs defensive weakness matchups
- Weather impact on scoring/play calling
- Pace of play and game script expectations
- Historical trends in this matchup
- Injury impact on team performance

Then select the TOP 5 team props with the highest confidence on DraftKings.

Format:
- team: Full team name
- prop: Specific prop with line (e.g., "Total Points - Over 24.5", "First Half Points - Under 13.5", "Total Sacks - Over 2.5")
- confidence: 50-100
- reasoning: 2-3 sentences with specific matchup analysis

**FANDUEL TEAM PROPS - TOP 5 ANALYSIS:**
Repeat the comprehensive team props analysis for FanDuel, noting any line differences or unique offerings.

Select the TOP 5 FanDuel team props with highest confidence.
` : ''}

**CRITICAL REQUIREMENTS:**
✅ Return EXACTLY 5 props per array (no more, no less)
✅ Only include props with confidence ≥ 50%
✅ Diversify across different prop categories
✅ Provide detailed, data-driven reasoning
✅ Consider both DraftKings and FanDuel line differences
✅ Focus on ACTIONABLE props with clear edges

**CONFIDENCE SCALE:**
- 85-100% = Elite edge, maximum conviction play
- 75-84% = Strong edge, highly recommended
- 65-74% = Good edge, solid play
- 55-64% = Moderate edge, worth considering
- 50-54% = Slight edge, lower confidence

Return comprehensive JSON with the absolute best props from your analysis.`;
}

function getPropsAnalysisSchema(analysisType) {
  const includePlayerProps = analysisType === 'player' || analysisType === 'both';
  const includeTeamProps = analysisType === 'team' || analysisType === 'both';

  const schema = {
    type: "object",
    properties: {},
    required: []
  };

  if (includePlayerProps) {
    schema.properties.top_player_props_draftkings = {
      type: "array",
      description: "Top 5 BEST player props from DraftKings across ALL prop types with highest confidence",
      items: {
        type: "object",
        properties: {
          player: { 
            type: "string", 
            description: "Player full name" 
          },
          prop: { 
            type: "string", 
            description: "Specific prop type and line (e.g., 'Passing Yards - Over 267.5', 'Sacks - Over 0.5', 'Anytime TD - Yes')" 
          },
          confidence: { 
            type: "number", 
            description: "Confidence percentage (50-100)" 
          },
          reasoning: { 
            type: "string", 
            description: "2-3 sentences explaining the edge with specific stats, matchup data, or trends" 
          }
        },
        required: ["player", "prop", "confidence", "reasoning"]
      },
      minItems: 5,
      maxItems: 5
    };

    schema.properties.top_player_props_fanduel = {
      type: "array",
      description: "Top 5 BEST player props from FanDuel across ALL prop types with highest confidence",
      items: {
        type: "object",
        properties: {
          player: { 
            type: "string", 
            description: "Player full name" 
          },
          prop: { 
            type: "string", 
            description: "Specific prop type and line (e.g., 'Receiving Yards - Over 75.5', 'Tackles+Assists - Over 8.5')" 
          },
          confidence: { 
            type: "number", 
            description: "Confidence percentage (50-100)" 
          },
          reasoning: { 
            type: "string", 
            description: "2-3 sentences explaining the edge with specific data" 
          }
        },
        required: ["player", "prop", "confidence", "reasoning"]
      },
      minItems: 5,
      maxItems: 5
    };

    schema.required.push("top_player_props_draftkings", "top_player_props_fanduel");
  }

  if (includeTeamProps) {
    schema.properties.top_team_props_draftkings = {
      type: "array",
      description: "Top 5 BEST team props from DraftKings across ALL prop types with highest confidence",
      items: {
        type: "object",
        properties: {
          team: { 
            type: "string", 
            description: "Full team name" 
          },
          prop: { 
            type: "string", 
            description: "Specific team prop and line (e.g., 'Total Points - Over 24.5', 'Total Sacks - Over 2.5', 'First Half Points - Under 10.5')" 
          },
          confidence: { 
            type: "number", 
            description: "Confidence percentage (50-100)" 
          },
          reasoning: { 
            type: "string", 
            description: "2-3 sentences with matchup analysis and specific data supporting the pick" 
          }
        },
        required: ["team", "prop", "confidence", "reasoning"]
      },
      minItems: 5,
      maxItems: 5
    };

    schema.properties.top_team_props_fanduel = {
      type: "array",
      description: "Top 5 BEST team props from FanDuel across ALL prop types with highest confidence",
      items: {
        type: "object",
        properties: {
          team: { 
            type: "string", 
            description: "Full team name" 
          },
          prop: { 
            type: "string", 
            description: "Specific team prop and line (e.g., 'Total Passing Yards - Over 215.5', '1st Quarter Points - Over 3.5')" 
          },
          confidence: { 
            type: "number", 
            description: "Confidence percentage (50-100)" 
          },
          reasoning: { 
            type: "string", 
            description: "2-3 sentences with detailed matchup analysis" 
          }
        },
        required: ["team", "prop", "confidence", "reasoning"]
      },
      minItems: 5,
      maxItems: 5
    };

    schema.required.push("top_team_props_draftkings", "top_team_props_fanduel");
  }

  return schema;
}

function formatOddsForPrompt(markets) {
  if (!markets || Object.keys(markets).length === 0) {
    return "No odds data available";
  }

  const lines = [];

  if (markets.moneyline && Object.keys(markets.moneyline).length > 0) {
    lines.push("**Moneyline**:");
    for (const [book, outcomes] of Object.entries(markets.moneyline)) {
      if (outcomes?.length > 0) {
        const odds = outcomes
          .map(o => `${o.name}: ${o.price > 0 ? '+' : ''}${o.price}`)
          .join(', ');
        lines.push(`  ${book}: ${odds}`);
      }
    }
  }

  if (markets.spread && Object.keys(markets.spread).length > 0) {
    lines.push("\n**Spread**:");
    for (const [book, outcomes] of Object.entries(markets.spread)) {
      if (outcomes?.length > 0) {
        const odds = outcomes
          .map(o => `${o.name} ${o.point > 0 ? '+' : ''}${o.point} (${o.price > 0 ? '+' : ''}${o.price})`)
          .join(', ');
        lines.push(`  ${book}: ${odds}`);
      }
    }
  }

  if (markets.total && Object.keys(markets.total).length > 0) {
    lines.push("\n**Total (Over/Under)**:");
    for (const [book, outcomes] of Object.entries(markets.total)) {
      if (outcomes?.length > 0) {
        const over = outcomes.find(o => o.name === 'Over');
        const under = outcomes.find(o => o.name === 'Under');
        if (over && under) {
          lines.push(
            `  ${book}: O/U ${over.point} (O: ${over.price > 0 ? '+' : ''}${over.price}, U: ${under.price > 0 ? '+' : ''}${under.price})`
          );
        }
      }
    }
  }

  return lines.length > 0 ? lines.join('\n') : "No odds data available";
}