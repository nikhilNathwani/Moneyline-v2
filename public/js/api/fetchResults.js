async function fetchResultSummary({
	seasonStartYear,
	team,
	prediction,
	wager,
}) {
	return fetchData(
		"/api/result-summary",
		seasonStartYear,
		team,
		prediction,
		wager
	);
}

async function fetchTopBets({ seasonStartYear, team, prediction, wager }) {
	return fetchData("/api/top-bets", seasonStartYear, team, prediction, wager);
}

async function fetchPerGameProfit({ seasonStartYear, team, prediction, wager }) {
	return fetchData(
		"/api/per-game-profit",
		seasonStartYear,
		team,
		prediction,
		wager
	); // [{ gamenumber, profit_cents }, ...], ordered by gamenumber
}

async function fetchTeamRecords(seasonStartYear) {
	const response = await fetch(
		`/api/team-records?seasonStartYear=${seasonStartYear}`
	);
	const json = await response.json();
	return json.data; // [{ team, wins, losses }, ...]
}

//HELPER FUNCTION
async function fetchData(route, seasonStartYear, team, prediction, wager) {
	const response = await fetch(route, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ seasonStartYear, team, prediction, wager }),
	});
	const json = await response.json(); //json is {message:"success", data:[array of games]}
	return json.data;
}
