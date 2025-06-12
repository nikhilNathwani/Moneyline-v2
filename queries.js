const pool = require("./dbConfig");

async function runBetResultsQuery(seasonStartYear, team, prediction) {
	console.log("In runBetResultsQuery function");

	const query = `
    SELECT gameNumber, outcome, winOdds, loseOdds 
    FROM games 
    WHERE seasonStartYear = $1 
      AND team = $2 
  `;

	const params = [seasonStartYear, team];
	const result = await pool.query(query, params);
	return result.rows;
}

async function runTopBetsQuery(seasonStartYear, team, prediction) {
	console.log("In runTopBetsQuery function");

	const predictionOddsColumn = `${prediction ? "win" : "lose"}Odds`;
	const query = `
    SELECT gameNumber, outcome, ${predictionOddsColumn},
		CAST(REPLACE(${predictionOddsColumn},'+','') AS INTEGER) AS ${predictionOddsColumn}_int
    FROM games 
    WHERE seasonStartYear = $1 
    	AND team = $2
		AND outcome = $3
	ORDER BY ${predictionOddsColumn}_int DESC
	LIMIT 3; 
  `;

	// Params array to securely pass values into the query
	const params = [seasonStartYear, team, prediction];
	const result = await pool.query(query, params);
	console.log("TOP BETS RESULTS:", result.rows);
	// return result.rows;
}

module.exports = { runBetResultsQuery, runTopBetsQuery };
