const fs = require("fs");
const path = require("path");

// Read SQL query files
const resultSummaryQuery = fs.readFileSync(
	path.join(__dirname, "../queries", "resultSummary.sql"),
	"utf8"
);

const topBetsQuery = fs.readFileSync(
	path.join(__dirname, "../queries", "topBets.sql"),
	"utf8"
);

const teamRecordsQuery = fs.readFileSync(
	path.join(__dirname, "../queries", "teamRecords.sql"),
	"utf8"
);

const perGameProfitQuery = fs.readFileSync(
	path.join(__dirname, "../queries", "perGameProfit.sql"),
	"utf8"
);

module.exports = {
	resultSummaryQuery,
	topBetsQuery,
	teamRecordsQuery,
	perGameProfitQuery,
};
