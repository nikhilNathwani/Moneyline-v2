function queryGames() {
	// Get the values of the Div filters
	const wager = document.getElementById("bet-input").value;
	const team = document.getElementById("team-input").value;
	const outcome =
		document.getElementById("outcome-input").value == "Win every game"
			? "win"
			: "loss";
	const seasonStartYear = document.getElementById("season-input").value;
	console.log(seasonStartYear, typeof seasonStartYear);

	console.log(`/api/games?seasonStart=${seasonStartYear}&team=${team}`);

	fetch(`/api/games?seasonStart=${seasonStartYear}&team=${team}`)
		.then((response) => response.json())
		.then((games) => generateResults(games, outcome, wager))
		.catch((error) => console.error("Error fetching data:", error));
}

function generateResults(games, outcome, wager) {
	console.log("Games:", games);
	const {
		numUnderdogWins,
		underdogWinProfit,
		numUnderdogLosses,
		underdogLossProfit,
		numFavoriteWins,
		favoriteWinProfit,
		numFavoriteLosses,
		favoriteLossProfit,
	} = calcBetResults(games, outcome, wager);
	const numWins = numUnderdogWins + numFavoriteWins;
	const numLosses = numUnderdogLosses + numFavoriteLosses;
	const numGames = numWins + numLosses;
	const totalProfit =
		underdogWinProfit +
		underdogLossProfit +
		favoriteWinProfit +
		favoriteLossProfit;
	makeTotalProfitDiv(totalProfit);
	makeROIDiv(totalProfit, numGames, wager);
	makeWinLossDiv(
		numUnderdogWins,
		underdogWinProfit,
		numUnderdogLosses,
		underdogLossProfit,
		numFavoriteWins,
		favoriteWinProfit,
		numFavoriteLosses,
		favoriteLossProfit
	);
	// makePerGameDiv();
}

function calcBetResults() {
	return {
		numUnderdogWins: 123,
		underdogWinProfit: 123,
		numUnderdogLosses: 123,
		underdogLossProfit: 123,
		numFavoriteWins: 123,
		favoriteWinProfit: 123,
		numFavoriteLosses: 123,
		favoriteLossProfit: 12,
	};
}

function makeTotalProfitDiv() {
	return;
}

function makeROIDiv() {
	return;
}

function makeWinLossDiv() {
	return;
}
