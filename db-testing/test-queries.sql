-- NBA Moneyline Test Queries
-- Use SQLTools: Cmd+E Cmd+E to run selected query

-- Check how many games per season
SELECT 
    seasonStartYear,
    COUNT(*) as game_count
FROM games
GROUP BY seasonStartYear
ORDER BY seasonStartYear;

-- Find Lakers games in 2024-25 season
SELECT 
    date,
    team,
    opponent,
    outcome,
    winOdds,
    loseOdds
FROM games
WHERE team = 'Lakers' 
  AND seasonStartYear = 2024
ORDER BY date DESC
LIMIT 10;

-- Check database schema
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Get team win percentages for 2024-25
SELECT 
    team,
    COUNT(*) as total_games,
    SUM(CASE WHEN outcome = true THEN 1 ELSE 0 END) as wins,
    ROUND(100.0 * SUM(CASE WHEN outcome = true THEN 1 ELSE 0 END) / COUNT(*), 1) as win_pct
FROM games
WHERE seasonStartYear = 2024
GROUP BY team
ORDER BY win_pct DESC;
