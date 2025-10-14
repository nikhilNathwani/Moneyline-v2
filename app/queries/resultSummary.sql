-- Result Summary Query: 
--      Analyzes betting outcomes with profit/loss calculations
-- Parameters:
--      $1 = seasonStartYear
--      $2 = team
--      $3 = prediction (boolean)
--      $4 = wager

WITH integer_odds AS (
	SELECT 
		team,
		seasonStartYear,
		outcome,
		CAST($3 AS boolean) as prediction,
		CAST($4 AS NUMERIC) AS wager,
		CAST(REPLACE(winOdds,'+','') AS INTEGER) AS winOdds_int,
		CAST(REPLACE(loseOdds,'+','') AS INTEGER) AS loseOdds_int
		FROM games
		WHERE seasonStartYear = CAST($1 AS integer)
			AND team = CAST($2 AS text)
),
label_favorites AS (
	SELECT 
		*,
		CASE 
			WHEN winOdds_int < 0 THEN TRUE
			ELSE FALSE
			END AS is_favorite
		FROM integer_odds
),
odds_of_prediction AS (
	SELECT 
		team,
		seasonStartYear,
		outcome,
		is_favorite,
		prediction,
		wager,
		CASE 
			WHEN prediction = TRUE THEN winOdds_int
			ELSE loseOdds_int
		END AS odds
		FROM label_favorites
),
profit AS (
	SELECT 
		*,
		CASE
		-- Incorrect bet
			WHEN outcome <> prediction THEN -1 * wager
		-- Correct bet, positive odds
			WHEN odds > 0 THEN (wager / 100) * odds
		-- Correct bet, negative odds
			ELSE (wager / (odds * -1)) * 100
		END AS profit_untruncated
	FROM odds_of_prediction
),
payout AS (
	SELECT
		*,
		wager + profit_untruncated AS payout_untruncated
	FROM profit
),
profit_and_payout AS (
	SELECT
		team,
		seasonStartYear,
		outcome, 
		is_favorite,
		odds,
		wager,
		FLOOR(profit_untruncated) AS profit_cents,
		FLOOR(payout_untruncated) AS payout_cents
	FROM payout
)
SELECT
	team,
	seasonStartYear,
	outcome, 
	is_favorite,
	CAST(wager AS integer) AS wager,
	CAST(COUNT(*) AS integer) AS num_games,
	CAST(SUM(profit_cents) AS integer) AS total_profit_cents,
	CAST(SUM(payout_cents) AS integer) AS total_payout_cents
FROM profit_and_payout
GROUP BY team, seasonStartYear, outcome, is_favorite, wager;