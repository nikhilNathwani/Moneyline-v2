const { db } = require("@vercel/postgres");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { seasonStartYear, team } = req.body;
		seasonStartYear = parseInt(seasonStartYear, 10);
		const topBets = await runTopBetsQuery(seasonStartYear, team);
		res.json({ success: true, topBets });
	} catch (error) {
		console.error("Error fetching top bets:", error);
		res.status(500).json({ success: false, message: error.message });
	}
});

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

	pool.query(query, params, (err, result) => {
		if (err) {
			console.error("Error executing top bets query:", err);
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: "success",
			data: result.rows,
		});
	});
}

module.exports = router;
