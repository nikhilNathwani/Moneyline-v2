const { db } = require("@vercel/postgres");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { filters } = req.body;
		const betResults = await runBetResultsQuery(filters);
		res.json({ success: true, betResults });
	} catch (error) {
		console.error("Error fetching bet results:", error);
		res.status(500).json({ success: false, message: error.message });
	}
});

async function runBetResultsQuery(filters) {
	console.log("In runBetResultsQuery function");
}

module.exports = router;
