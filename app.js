const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
	connectionString: process.env.POSTGRES_URL,
});

app.get("/api/games", (req, res) => {
	const { seasonStart, team } = req.query;

	const query = `
    SELECT gameNumber, outcome, winOdds, loseOdds 
    FROM games 
    WHERE seasonStartYear = $1 
      AND team = $2 
  `;

	// Params array to securely pass values into the query
	const params = [
		parseInt(seasonStart, 10),
		team,
		//outcome === "win", // Converts outcome to a boolean (true for "win", false otherwise)
	];

	console.log("Params: ", params, typeof params);

	pool.query(query, params, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
			res.status(500).json({ error: err.message });
			return;
		}
		console.log("Success executing query");
		res.json({
			message: "success",
			data: result.rows,
		});
	});
});

// Example query using the pool
pool.query(
	"SELECT seasonStartYear, team, gameNumber, outcome, winOdds, loseOdds FROM games",
	(err, res) => {
		console.log("in pool");
		if (err) {
			console.error("Error executing query:", err);
		} else {
			console.log("Data:", res);
		}
	}
);

// Serve static files from public directory (like css/js files)
app.use(express.static(path.join(__dirname, "public")));

// Define a route to fetch data from the database
// app.get("/api/games", (req, res) => {
// 	console.log("app " + getFilterValues(req));
// 	res.json({ message: "Nikhil Logging to the console" });
// 	db.all(
// 		"SELECT seasonStartYear, team, gameNumber FROM games",
// 		[],
// 		(err, rows) => {
// 			if (err) {
// 				res.status(500).json({ error: err.message });
// 				return;
// 			}
// 			res.json({
// 				message: "success",
// 				data: rows,
// 			});
// 		}
// 	);
// });

// Fallback to serve index.html for any other route
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// function getFilterValues(req) {
// 	const bet = parseInt(req.query.bet, 10);
// 	const team = req.query.team;
// 	const outcome = req.query.outcome;
// 	const seasonStartYear = parseInt(req.query.seasonStart, 10);
// 	return { bet, team, outcome, seasonStartYear };
// }
