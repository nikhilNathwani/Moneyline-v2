/* External imports */
const express = require("express");
const path = require("path");
const handleQueryRoute = require("./utils/handleQueryRoute");
const { runBetResultsQuery, runTopBetsQuery } = require("./data/queries");

/* App Configurations */
const app = express();

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse request bodies (for POST requests)
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// ^check if i need this

// Use the routes I defined
app.post("/api/bet-results", handleQueryRoute(runBetResultsQuery));
app.post("/api/top-bets", handleQueryRoute(runTopBetsQuery));

// Fallback to serve index.html for any other route
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
