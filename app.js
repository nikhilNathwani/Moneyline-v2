const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

console.log("here in app.js");

const pool = new Pool({
	connectionString: process.env.POSTGRES_URL,
});

// Example query using the pool
pool.query(
	"SELECT seasonStartYear, team, gameNumber FROM games",
	(err, res) => {
		console.log("in pool");
		if (err) {
			console.error("Error executing query:", err);
		} else {
			console.log("First row:", res.rows[0]);
		}
	}
);

// Connect to SQLite database
// const db = new sqlite3.Database("./moneyline.db", (err) => {
// 	if (err) {
// 		console.error("Could not connect to database", err);
// 	} else {
// 		console.log("Connected to SQLite database");
// 	}
// });

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
