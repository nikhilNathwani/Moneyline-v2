const topBetsQuery = `
    WITH odds_of_prediction AS (
        SELECT 
            gameNumber AS game_number,
            outcome,
            CAST($4 AS NUMERIC) AS wager,
            CASE 
                WHEN CAST($3 AS boolean) = TRUE THEN winOdds
                ELSE loseOdds
            END AS odds_string 
            FROM games
            WHERE seasonStartYear = CAST($1 AS integer) 
                AND team = CAST($2 AS text)
                AND outcome = CAST($3 AS boolean)
    ),
    top_bets AS (
        SELECT 
            game_number, 
            outcome,
            wager,
            odds_string,
            CAST(REPLACE(odds_string,'+','') AS INTEGER) AS odds
        FROM odds_of_prediction
        ORDER BY odds DESC
        LIMIT 3 
    ),
    profit_and_payout AS (
        SELECT 
            game_number, 
            outcome, 
            odds_string,
            odds,
            wager,
            CASE 
                WHEN odds > 0 THEN (wager / 100) * odds
                ELSE (wager/(odds * -1)) * 100
            END AS profit_untruncated,
            CASE 
                WHEN odds > 0 THEN wager + (wager / 100) * odds
                ELSE wager + (wager/(odds * -1)) * 100
            END AS payout_untruncated
        FROM top_bets 
    )
    SELECT
        game_number, 
        outcome, 
        odds_string as odds,
        odds as odds_int,
        CAST(wager AS integer) AS wager,
        CAST(FLOOR(profit_untruncated) AS integer) AS profit_cents,
        CAST(FLOOR(payout_untruncated) AS integer) AS payout_cents
    FROM profit_and_payout
`;
