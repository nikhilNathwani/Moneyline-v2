function handleQueryRoute(queryFunction) {
	return async (req, res) => {
		try {
			let { seasonStartYear, team, prediction, wager } = req.body;
			seasonStartYear = parseInt(seasonStartYear, 10);
			const data = await queryFunction(seasonStartYear, team, prediction);
			res.json({ success: true, data });
		} catch (error) {
			console.error("Error in route handler:", error);
			res.status(500).json({ success: false, message: error.message });
		}
	};
}

module.exports = handleQueryRoute;
