const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to SQLite database
const db = new sqlite3.Database("./moneyline.db", (err) => {
	if (err) {
		console.error("Could not connect to database", err);
	} else {
		console.log("Connected to SQLite database");
	}
});

// Serve static files from the root directory
console.log(__dirname);
app.use(express.static(path.join(__dirname)));
console.log("hi");

// Define a route to fetch data from the database
app.get("/api/games", (req, res) => {
	db.all(
		"SELECT seasonStartYear, team, gameNumber FROM games",
		[],
		(err, rows) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.json({
				message: "success",
				data: rows,
			});
		}
	);
});

// Fallback to serve index.html for any other route
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
