const submitButton = document.getElementById("submit-button");

// Handle submit ('View Results' button)
submitButton.addEventListener("click", function () {
	console.log("submit button clicked");
	//Bring results to foreground by either scrolling down or
	//snapping filters to the left (depending on screen size)
	snapFilterView();

	var timeout = 0;
	if (!appContainer.classList.contains(APP_STATE.INITIAL)) {
		clearExistingResults();
		if (appContainer.classList.contains(APP_STATE.ADJACENT)) {
			timeout = 500; //wait for fade-out of existing results
		} else {
			timeout = 200; //no fade-out of existing results in STACKED mode, so just a short wait
		}
	}

	setTimeout(() => {
		//Generate new results based on filters applied
		generateResults();
	}, timeout);

	setTimeout(() => {
		fadeInResults();
	}, timeout + 500);
});

//Fetch data from api and pass results along to calcBetResults then makeResultDivs
async function generateResults() {
	const { seasonStartYear, team, prediction, wager } = getFilterValues();

	try {
		const response = await fetch("/api/games", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ seasonStartYear, team, prediction, wager }),
		});
		const json = await response.json(); //json is {message:"success", data:[array of games]}
		const games = json.data;
		const { betResults, topThreeBets } = calcBetResults(
			games,
			prediction,
			wager
		);
		renderBetResults(betResults, prediction, wager);
		renderTopBets(topThreeBets, prediction, wager);
	} catch (error) {
		console.error("Error fetching games:", error);
	}

	try {
		const response = await fetch("/api/bet-results", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ seasonStartYear, team, prediction, wager }),
		});
		const json = await response.json(); //json is {message:"success", data:[array of games]}
		const betResults = json.data;
		// renderBetResults(betResults, prediction, wager);
	} catch (error) {
		console.error("Error fetching bet results:", error);
	}

	try {
		const response = await fetch("/api/top-bets", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ seasonStartYear, team, prediction, wager }),
		});
		const json = await response.json(); //json is {message:"success", data:[array of games]}
		const topBets = json.data;
		// renderBetResults(topBets, prediction, wager);
	} catch (error) {
		console.error("Error fetching top bets:", error);
	}
}

function getFilterValues() {
	return {
		seasonStartYear: document.getElementById("season-input").value,
		team: document.getElementById("team-input").value,
		wager: document.getElementById("wager-input").value,
		prediction:
			document.getElementById("outcome-input").value == "Win every game"
				? true
				: false,
	};
}

function calcBetResults(games, prediction, wager) {
	let betResults = {
		numUnderdogWins: 0,
		numUnderdogLosses: 0,
		numFavoriteWins: 0,
		numFavoriteLosses: 0,
		profitUnderdogWins: 0,
		profitUnderdogLosses: 0,
		profitFavoriteWins: 0,
		profitFavoriteLosses: 0,
	};
	let winningBets = [];

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
		const profit = calcProfit(prediction, game.outcome, odds, wager);
		betResults[resultToUpdate.profitSum] += profit;
		betResults[resultToUpdate.gameCount]++;

		if (game.outcome == prediction) {
			winningBets.push({
				gameNumber: game.gamenumber,
				odds: odds,
				profit: profit,
			});
		}
	});

	//Get top 3 highest-earning games
	const sortedByProfit = winningBets.sort((a, b) => b.profit - a.profit);
	const topThreeBets = sortedByProfit.slice(0, 3);

	return { betResults, topThreeBets };
}

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
