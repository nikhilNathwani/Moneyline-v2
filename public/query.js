function queryGames() {
	console.log("here");

	// Get the values of the Div filters
	const bet = document.getElementById("bet-input").value;
	const team = document.getElementById("team-input").value;
	const outcome =
		document.getElementById("outcome-input").value == "Win every game"
			? "win"
			: "loss";
	const seasonStartYear = document.getElementById("season-input").value;

	console.log(
		`/api/games?bet=seasonStart=${seasonStartYear}&team=${team}&outcome=${outcome}&${bet}`
	);

	fetch(
		`/api/games?bet=seasonStart=${seasonStartYear}&team=${team}&outcome=${outcome}&${bet}`
	)
		.then((response) => response.json())
		.then((response) => console.log(response));
}

function queryGames2() {
	// Get the values of the Div filters
	const bet = document.getElementById("bet-input").value;
	const team = document.getElementById("team-input").value;
	const outcome =
		document.getElementById("outcome-input").value == "Win every game"
			? "win"
			: "loss";
	const seasonStartYear = document.getElementById("season-input").value;

	// Make a request to the /api/games route, passing the filters as parameters
	// Then use the query response data to generate the data visualizations
	fetch(
		`/api/games?bet=${bet}&team=${team}&outcome=${outcome}&seasonStart=${seasonStartYear}`
	)
		.then((response) => response.json())
		.then((response) => {
			makeTotalProfitDiv(response.profit);
			makeROIDiv(
				response.totalWagered,
				response.totalPayout,
				response.profit,
				response.percentReturn
			);
			makeWinLossDiv(
				team,
				outcome,
				response.underdogWinCount,
				response.underdogLossCount,
				response.favoriteWinCount,
				response.favoriteLossCount,
				response.underdogWinPayout,
				response.underdogLossPayout,
				response.favoriteWinPayout,
				response.favoriteLossPayout
			);
			makeRawDataBox(response.games);
			console.log("Test", response.underdogWinCount);
		});
}
