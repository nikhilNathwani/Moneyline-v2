const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { filters } = req.body;
		const topBets = await runTopBetsQuery(filters);
		res.json({ success: true, topBets });
	} catch (error) {
		console.error("Error fetching top bets:", error);
		res.status(500).json({ success: false, message: error.message });
	}
});

async function runTopBetsQuery(filters) {
	console.log("In runTopBetsQuery function");
}

module.exports = router;
