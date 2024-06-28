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
		.then((games) => generateResults(games.data, outcome, wager))
		.catch((error) => console.error("Error fetching data:", error));
}

function generateResults(games, outcome, wager) {
	console.log("Games:", games);
	const {
		numUnderdogWins,
		numUnderdogLosses,
		numFavoriteWins,
		numFavoriteLosses,
		profitUnderdogWins,
		profitUnderdogLosses,
		profitFavoriteWins,
		profitFavoriteLosses,
	} = calcBetResults(games, outcome, wager);
	const numWins = numUnderdogWins + numFavoriteWins;
	const numLosses = numUnderdogLosses + numFavoriteLosses;
	const numGames = numWins + numLosses;
	const totalProfit =
		profitUnderdogWins +
		profitUnderdogLosses +
		profitFavoriteWins +
		profitFavoriteLosses;
	makeTotalProfitDiv(totalProfit);
	makeROIDiv(totalProfit, numGames, wager);
	makeWinLossDiv(
		numUnderdogWins,
		numUnderdogLosses,
		numFavoriteWins,
		numFavoriteLosses,
		profitUnderdogWins,
		profitUnderdogLosses,
		profitFavoriteWins,
		profitFavoriteLosses
	);
	// makePerGameDiv();
}

function calcProfit(prediction, outcome, odds, wager) {
	if (prediction !== outcome) {
		return wager * -1;
	} else {
		if (odds > 0) {
			return odds * (wager / 100);
		} else {
			return (wager / odds) * -100;
		}
	}
}

function calcBetResults(games, prediction, wager) {
	let results = {
		numUnderdogWins: 0,
		numUnderdogLosses: 0,
		numFavoriteWins: 0,
		numFavoriteLosses: 0,
		profitUnderdogWins: 0,
		profitUnderdogLosses: 0,
		profitFavoriteWins: 0,
		profitFavoriteLosses: 0,
	};

	games.forEach((game) => {
		const odds = prediction
			? parseFloat(game.winodds)
			: parseFloat(game.loseodds);

		let resultToUpdate = {
			gameCount:
				"num" +
				(odds > 0 ? "Underdog" : "Favorite") +
				(game.outcome ? "Wins" : "Losses"),
			profitSum:
				"profit" +
				(odds > 0 ? "Underdog" : "Favorite") +
				(game.outcome ? "Wins" : "Losses"),
		};
		console.log(prediction, game.outcome, odds, wager);
		results[resultToUpdate.gameCount]++;
		results[resultToUpdate.profitSum] += calcProfit(
			prediction,
			game.outcome,
			odds,
			wager
		);
	});
	console.log("Results:", results);
	return results;
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
