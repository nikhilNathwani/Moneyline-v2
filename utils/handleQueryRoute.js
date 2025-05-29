function handleQueryRoute(queryFunction) {
	return async (req, res) => {
		try {
			let { seasonStartYear, team } = req.body;
			seasonStartYear = parseInt(seasonStartYear, 10);
			const data = await queryFunction(seasonStartYear, team);
			res.json({ success: true, data });
		} catch (error) {
			console.error("Error in route handler:", error);
			res.status(500).json({ success: false, message: error.message });
		}
	};
}

module.exports = handleQueryRoute;
