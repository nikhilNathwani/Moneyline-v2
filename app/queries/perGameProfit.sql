-- Per-Game Profit Query:
--      Profit/loss for every individual game in a season, in game
--      order — used to plot cumulative profit across the season.
--      Same betting math as resultSummary.sql, minus the final
--      GROUP BY aggregation.
-- Parameters:
--      $1 = seasonStartYear
--      $2 = team
--      $3 = prediction (boolean)
--      $4 = wager
--
-- Sample Output:
--      gamenumber | profit_cents
--      -----------|-------------
--      1          |  4500
--      2          | -5000

WITH integer_odds AS (
	SELECT
		gamenumber,
		outcome,
		CAST($3 AS boolean) as prediction,
		CAST($4 AS NUMERIC) AS wager,
		CAST(REPLACE(winOdds,'+','') AS INTEGER) AS winOdds_int,
		CAST(REPLACE(loseOdds,'+','') AS INTEGER) AS loseOdds_int
		FROM games
		WHERE seasonStartYear = CAST($1 AS integer)
			AND team = CAST($2 AS text)
),
odds_of_prediction AS (
	SELECT
		gamenumber,
		outcome,
		prediction,
		wager,
		CASE
			WHEN prediction = TRUE THEN winOdds_int
			ELSE loseOdds_int
		END AS odds
		FROM integer_odds
)
SELECT
	gamenumber,
	CAST(
		FLOOR(
			CASE
			-- Incorrect bet
				WHEN outcome <> prediction THEN -1 * wager
			-- Correct bet, positive odds
				WHEN odds > 0 THEN (wager / 100) * odds
			-- Correct bet, negative odds
				ELSE (wager / (odds * -1)) * 100
			END
		) AS integer
	) AS profit_cents
FROM odds_of_prediction
ORDER BY gamenumber;
