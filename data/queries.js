const pool = require("./dbConfig");

async function runResultSummaryQuery(seasonStartYear, team, prediction, wager) {
	console.log("In runResultSummaryQuery function");

	const query = `
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
  `;

	const params = [seasonStartYear, team, prediction, wager];
	// console.log("Params bet results:", params);
	const result = await pool.query(query, params);
	console.log("BETS RESULTS:", result.rows);
	return result.rows;
}

async function runTopBetsQuery(seasonStartYear, team, prediction, wager) {
	console.log("In runTopBetsQuery function");

	const query = `
		WITH odds_of_prediction AS (
			SELECT 
				gameNumber AS game_number,
				outcome,
				CAST($4 AS NUMERIC) AS wager,
				CASE 
					WHEN $3 = TRUE THEN winOdds
					ELSE loseOdds
				END AS odds_string 
				FROM games
				WHERE seasonStartYear = $1 
					AND team = $2
					AND outcome = $3
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

	// Params array to securely pass values into the query
	const params = [seasonStartYear, team, prediction, wager];
	const result = await pool.query(query, params);
	console.log("Params top bets:", params);
	console.log("TOP BETS RESULTS:", result.rows);
	return result.rows;
}

module.exports = { runResultSummaryQuery, runTopBetsQuery };
