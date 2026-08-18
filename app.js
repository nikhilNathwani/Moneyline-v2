/* External imports */
const express = require("express");
const path = require("path");

/* Internal imports */
const resultSummaryRoute = require("./app/routes/resultSummary");
const topBetsRoute = require("./app/routes/topBets");
const teamRecordsRoute = require("./app/routes/teamRecords");
const perGameProfitRoute = require("./app/routes/perGameProfit");

/* App Configuration */
const app = express();

// Middleware to parse request bodies (for POST requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the routes I defined
app.use("/api/result-summary", resultSummaryRoute);
app.use("/api/top-bets", topBetsRoute);
app.use("/api/team-records", teamRecordsRoute);
app.use("/api/per-game-profit", perGameProfitRoute);

// Serve static files from public folder
const staticPathRoot = path.join(__dirname, "public");
app.use(express.static(staticPathRoot));

// Fallback to serve index.html for any other route
app.get("*", (req, res) => {
	res.sendFile(path.join(staticPathRoot, "index.html"));
});

module.exports = app;
