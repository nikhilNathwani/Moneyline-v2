const express = require("express");
const pool = require("../utils/dbConfig");
const { teamRecordsQuery } = require("../utils/parseSQL");

// Doesn't fit createQueryRoute's (team, prediction, wager) POST-body
// signature — this only ever needs a season, and it's a plain lookup
// (not tied to a specific bet), so it's a GET with a query param.
const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const { seasonStartYear } = req.query;
		const { rows } = await pool.query(teamRecordsQuery, [seasonStartYear]);
		res.json({ success: true, data: rows });
	} catch (error) {
		console.error("Error in teamRecords route handler:", error);
		res.status(500).json({ success: false, message: error.message });
	}
});

module.exports = router;
