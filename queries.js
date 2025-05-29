const pool = require("./dbConfig");

async function runBetResultsQuery(seasonStartYear, team) {
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

async function runTopBetsQuery(seasonStartYear, team) {
	console.log("In runTopBetsQuery function");

	const query = `
    SELECT gameNumber, outcome, winOdds, loseOdds 
    FROM games 
    WHERE seasonStartYear = $1 
      AND team = $2 
  `;

	// Params array to securely pass values into the query
	const params = [seasonStartYear, team];
	const result = await pool.query(query, params);
	return result.rows;
}

module.exports = { runBetResultsQuery, runTopBetsQuery };
