function generateResults() {
	const { seasonStartYear, team, prediction, wager } = getFilterValues();
	fetch(`/api/games?seasonStart=${seasonStartYear}&team=${team}`)
		.then((response) => response.json())
		.then((games) => {
			console.log("Games:", games);
			const betResults = calcBetResults(games.data, prediction, wager);
			makeResultDivs(betResults, prediction, wager);
		})
		.catch((error) => console.error("Error fetching data:", error));
}

function makeResultDivs(betResults, prediction, wager) {
	const {
		numUnderdogWins,
		numUnderdogLosses,
		numFavoriteWins,
		numFavoriteLosses,
		profitUnderdogWins,
		profitUnderdogLosses,
		profitFavoriteWins,
		profitFavoriteLosses,
	} = betResults;
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

//HELPER FUNCTIONS
//
//Calculates profit given odds, wager, and bet outcome
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
