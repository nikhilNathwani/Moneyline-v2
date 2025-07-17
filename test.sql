SELECT * FROM games
LIMIT 10;


SELECT 
    *,
    CAST(REPLACE(winodds,'+','') AS INTEGER) AS winodds_int
FROM games
WHERE seasonstartyear = '2021'
    AND team = 'Boston Celtics'
    AND outcome = TRUE
ORDER BY winodds_int DESC
LIMIT 3;

SELECT 
    *,
    CAST(REPLACE(winodds,'+','') AS INTEGER) AS winodds_int
FROM games
WHERE seasonstartyear = '2021'
    AND team = 'Atlanta Hawks'
    -- AND outcome = TRUE
ORDER BY gameNumber ASC;
-- LIMIT 3;



WITH params AS (
    SELECT 
        2017 AS param_1,
        'Golden State Warriors' AS param_2,
        TRUE AS param_3,
        50 AS param_4
),
odds_of_prediction AS (
    SELECT 
        gameNumber,
        outcome,
        CASE 
            WHEN (SELECT param_3 FROM params) = TRUE THEN winOdds
            ELSE loseOdds
        END AS odds_string 
        FROM games
        WHERE seasonStartYear = (SELECT param_1 FROM params) 
            AND team = (SELECT param_2 FROM params)
            AND outcome = (SELECT param_3 FROM params)
),
top_bets AS (
    SELECT 
        gameNumber, 
        outcome,
        odds_string,
        CAST(REPLACE(odds_string,'+','') AS INTEGER) AS odds
    FROM odds_of_prediction
    ORDER BY odds DESC
    LIMIT 3 
),
profit_and_payout AS (
    SELECT 
        gameNumber, 
        outcome, 
        odds_string,
        odds,
        CASE 
            WHEN odds > 0 THEN ((SELECT param_4 FROM params) / 100.0) * odds
            ELSE ((SELECT param_4 FROM params)/(odds * -1.0)) * 100.0
        END AS profit_untruncated,
        CASE 
            WHEN odds > 0 THEN (SELECT param_4 FROM params) + ((SELECT param_4 FROM params) / 100.0) * odds
            ELSE (SELECT param_4 FROM params) + ((SELECT param_4 FROM params)/(odds * -1.0)) * 100.0
        END AS payout_untruncated
    FROM top_bets 
)
SELECT
    gameNumber, 
    outcome, 
    odds_string as odds,
    odds as odds_int,
    FLOOR(profit_untruncated * 100.0) / 100 AS profit,
    FLOOR(payout_untruncated * 100.0) / 100 AS payout
FROM profit_and_payout;


WITH params AS (
    SELECT 
        2017 AS param_1,
        'Golden State Warriors' AS param_2,
        TRUE AS param_3,
        50 AS param_4
),
integer_odds AS (
    SELECT 
        team,
        seasonStartYear,
        outcome,
        CAST(REPLACE(winOdds,'+','') AS INTEGER) AS winOdds_int,
        CAST(REPLACE(loseOdds,'+','') AS INTEGER) AS loseOdds_int
        FROM games
        WHERE seasonStartYear = (SELECT param_1 FROM params) 
            AND team = (SELECT param_2 FROM params)
),
label_favorites AS (
    SELECT 
        *,
        CASE 
            WHEN winOdds_int < 0 THEN TRUE
            ELSE FALSE
            END AS isFavorite
        FROM integer_odds
        WHERE seasonStartYear = (SELECT param_1 FROM params) 
            AND team = (SELECT param_2 FROM params)
),
odds_of_prediction AS (
    SELECT 
        team,
        seasonStartYear,
        outcome,
        isFavorite,
        (SELECT param_3 FROM params) AS prediction,
        CASE 
            WHEN (SELECT param_3 FROM params) = TRUE THEN winOdds_int
            ELSE loseOdds_int
        END AS odds
        FROM label_favorites
),
profit AS (
    SELECT 
        *,
        CASE
        -- Incorrect bet
            WHEN outcome <> (SELECT param_3 FROM params) THEN -1.0 * (SELECT param_4 FROM params)
        -- Correct bet, positive odds
            WHEN odds > 0 THEN ((SELECT param_4 FROM params) / 100.0) * odds
        -- Correct bet, negative odds
            ELSE ((SELECT param_4 FROM params)/(odds * -1.0)) * 100.0
        END AS profit_untruncated
    FROM odds_of_prediction
),
payout AS (
    SELECT
        *,
        (SELECT param_4 FROM params) + profit_untruncated AS payout_untruncated
    FROM profit
),
profit_and_payout AS (
    SELECT
        team,
        seasonStartYear,
        outcome, 
        (SELECT param_3 FROM params) AS prediction,
        isFavorite,
        odds,
        FLOOR(profit_untruncated * 100.0) / 100 AS profit,
        FLOOR(payout_untruncated * 100.0) / 100 AS payout
    FROM payout
)
SELECT
    team,
    seasonStartYear,
    outcome, 
    isFavorite,
    COUNT(*) AS num_games,
    SUM(profit) AS total_profit,
    SUM(payout) AS total_payout
FROM profit_and_payout
GROUP BY team, seasonStartYear, outcome, isFavorite;


SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'games' AND column_name = 'outcome';


WITH params AS (
    SELECT 
        2017 AS param_1,
        'Golden State Warriors' AS param_2,
        TRUE AS param_3,
        50 AS param_4
),
integer_odds AS (
    SELECT 
        team,
        seasonStartYear,
        outcome,
        CAST(REPLACE(winOdds,'+','') AS INTEGER) AS winOdds_int,
        CAST(REPLACE(loseOdds,'+','') AS INTEGER) AS loseOdds_int
        FROM games
        WHERE seasonStartYear = (SELECT param_1 FROM params) 
            AND team = (SELECT param_2 FROM params)
),
label_favorites AS (
    SELECT 
        *,
        CASE 
            WHEN winOdds_int < 0 THEN TRUE
            ELSE FALSE
            END AS isFavorite
        FROM integer_odds
        WHERE seasonStartYear = (SELECT param_1 FROM params) 
            AND team = (SELECT param_2 FROM params)
),
odds_of_prediction AS (
    SELECT 
        team,
        seasonStartYear,
        outcome,
        isFavorite,
        winOdds_int,
        (SELECT param_3 FROM params) AS prediction,
        CASE 
            WHEN (SELECT param_3 FROM params) = TRUE THEN winOdds_int
            ELSE loseOdds_int
        END AS odds
        FROM label_favorites
),
profit AS (
    SELECT 
        *,
        CASE
        -- Incorrect bet
            WHEN outcome <> (SELECT param_3 FROM params) THEN -1.0 * (SELECT param_4 FROM params)
        -- Correct bet, positive odds
            WHEN odds > 0 THEN ((SELECT param_4 FROM params) / 100.0) * odds
        -- Correct bet, negative odds
            ELSE ((SELECT param_4 FROM params)/(odds * -1.0)) * 100.0
        END AS profit_untruncated
    FROM odds_of_prediction
),
payout AS (
    SELECT
        *,
        (SELECT param_4 FROM params) + profit_untruncated AS payout_untruncated
    FROM profit
),
profit_and_payout AS (
    SELECT
        team,
        seasonStartYear,
        outcome, 
        (SELECT param_3 FROM params) AS prediction,
        isFavorite,
        odds,
        winOdds_int,
        FLOOR(profit_untruncated * 100.0) / 100 AS profit,
        FLOOR(payout_untruncated * 100.0) / 100 AS payout
    FROM payout
)
SELECT
    team,
    seasonStartYear,
    outcome, 
    isFavorite,
    winOdds_int,
    odds,
    profit
FROM profit_and_payout
WHERE outcome=TRUE AND isfavorite=FALSE;