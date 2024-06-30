function queryGames() {
	// Get the values of the Div filters
	const wager = document.getElementById("bet-input").value;
	const team = document.getElementById("team-input").value;
	const outcome =
		document.getElementById("outcome-input").value == "Win every game"
			? "win"
			: "loss";
	const seasonStartYear = document.getElementById("season-input").value;

	fetch(`/api/games?seasonStart=${seasonStartYear}&team=${team}`)
		.then((response) => response.json())
		.then((games) => generateResults(games.data, outcome, wager))
		.catch((error) => console.error("Error fetching data:", error));
}

function generateResults(games, prediction, wager) {
	prediction = prediction === "win";
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
	} = calcBetResults(games, prediction, wager);
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
		totalProfit,
		prediction,
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
		let profit = 0;
		if (odds > 0) {
			profit = odds * (wager / 100);
		} else {
			profit = (wager / odds) * -100;
		}
		return Math.floor(profit * 100) / 100; //truncate to 2 decimal places
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
				(prediction
					? odds >= 0
						? "Underdog"
						: "Favorite"
					: odds >= 0
					? "Favorite"
					: "Underdog") +
				(game.outcome ? "Wins" : "Losses"),
			profitSum:
				"profit" +
				(prediction
					? odds >= 0
						? "Underdog"
						: "Favorite"
					: odds >= 0
					? "Favorite"
					: "Underdog") +
				(game.outcome ? "Wins" : "Losses"),
		};
		console.log(
			prediction,
			game.outcome,
			odds,
			wager,
			calcProfit(prediction, game.outcome, odds, wager)
		);
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
