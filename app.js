/* External imports */
const express = require("express");
const path = require("path");
const { Pool } = require("pg");

/* Internal imports */
const betResultsRouter = require("./routes/bet-results");
const topBetsRouter = require("./routes/top-bets");

/* App Configurations */
const app = express();
const pool = new Pool({
	connectionString: process.env.POSTGRES_URL,
});

console.log("Using POSTGRES_URL:", process.env.POSTGRES_URL);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Use the routes I defined
app.use("/api/bet-results", betResultsRouter);
app.use("/api/top-bets", topBetsRouter);

//Route to fetch raw game data for given team and season
app.get("/api/games", (req, res) => {
	const { seasonStart, team } = req.query;

	const query = `
    SELECT gameNumber, outcome, winOdds, loseOdds 
    FROM games 
    WHERE seasonStartYear = $1 
      AND team = $2 
  `;

	// Params array to securely pass values into the query
	const params = [parseInt(seasonStart, 10), team];

	pool.query(query, params, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: "success",
			data: result.rows,
		});
	});
});

// Fallback to serve index.html for any other route
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
