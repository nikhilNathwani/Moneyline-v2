//
// RESULT CONSTRUCTION
//
function renderResultSummary(resultSummary, prediction, wager) {
	const {
		numUnderdogWins,
		numUnderdogLosses,
		numFavoriteWins,
		numFavoriteLosses,
		profitUnderdogWins,
		profitUnderdogLosses,
		profitFavoriteWins,
		profitFavoriteLosses,
	} = deconstructBetResultData(resultSummary);
	const numGames =
		numUnderdogWins +
		numFavoriteWins +
		numUnderdogLosses +
		numFavoriteLosses;
	const totalProfit =
		profitUnderdogWins +
		profitUnderdogLosses +
		profitFavoriteWins +
		profitFavoriteLosses;

	// Section 1: Total Profit
	//   -e.g. "You would've won +$325.41 at season's end."
	makeTotalProfitSection(totalProfit);

	// Section 2: ROI
	//   -e.g. "That's a +4.22% return on investment."
	makeROISection(totalProfit, numGames, wager);

	// Section 3: Win/Loss
	//   -e.g. "This comes from 54 correct bets."
	makeWinLossSection(
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
}

// Section 1: Total Profit
//   --e.g. "You would have [won/lost] $XYZ"
function makeTotalProfitSection(totalProfit) {
	const totalProfitBanner = document.getElementById("total-profit-banner");

	const totalProfitHeader = totalProfitBanner.querySelector("p");
	displayResult({
		element: totalProfitHeader,
		value: `You would've ${totalProfit >= 0 ? "won" : "lost"}`,
		textFormatFn: null,
		applySignAndColor: false,
	});

	const totalProfitValue = totalProfitBanner.querySelector("span");
	displayResult({
		element: totalProfitValue,
		value: totalProfit,
		textFormatFn: formatCentsToDollars,
		applySignAndColor: true,
	});
}

// Section 2: ROI
//   --e.g. "That's a XX% return on investment"
function makeROISection(totalProfit, numGames, wager) {
	const roi = (totalProfit * 100) / (numGames * wager);

	//Make ROI div banner
	const roiBanner = document.getElementById("roi-banner");
	const roiSpan = roiBanner.querySelector("span");
	displayResult({
		element: roiSpan,
		value: roi,
		textFormatFn: formatPercent,
		applySignAndColor: true,
	});

	//Make ROI div details
	const roiDetails = document.getElementById("roi-details");
	//
	const roiTotalWagered = roiDetails.querySelector("#totalWagered");
	displayResult({
		element: roiTotalWagered,
		value: numGames * wager,
		textFormatFn: formatCentsToDollars,
		applySignAndColor: false,
	});
	//
	const roiTotalPayout = roiDetails.querySelector("#totalPayout");
	displayResult({
		element: roiTotalPayout,
		value: totalProfit + numGames * wager,
		textFormatFn: formatCentsToDollars,
		applySignAndColor: false,
	});
	//
	const roiProfit = roiDetails.querySelector("#profit");
	displayResult({
		element: roiProfit,
		value: totalProfit,
		textFormatFn: formatCentsToDollars,
		applySignAndColor: true,
	});
	//
	const roiPercentReturn = roiDetails.querySelector("#percentReturn");
	displayResult({
		element: roiPercentReturn,
		value: roi,
		textFormatFn: formatPercent,
		applySignAndColor: true,
	});
}

// Section 3: Win Loss
//   --e.g. "This comes from X [correct/incorrect] guesses"
function makeWinLossSection(
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
) {
	//Make win-loss banner
	const winLossBanner = document.getElementById("win-loss-banner");
	const winLossCount = winLossBanner.querySelector("span");
	winLossCount.textContent = prediction
		? totalProfit >= 0
			? numUnderdogWins + numFavoriteWins
			: numUnderdogLosses + numFavoriteLosses
		: totalProfit >= 0
		? numUnderdogLosses + numFavoriteLosses
		: numUnderdogWins + numFavoriteWins;
	winLossCount.classList.add(`${totalProfit >= 0 ? "positive" : "negative"}`);
	const winLossLabel = winLossBanner.querySelector("span:last-child");
	winLossLabel.textContent = `${
		totalProfit >= 0 ? "correct" : "incorrect"
	} bets.`;

	//Make win-loss details
	const chipValues = {
		"underdog-win-gameCount": numUnderdogWins,
		"underdog-loss-gameCount": numUnderdogLosses,
		"favorite-win-gameCount": numFavoriteWins,
		"favorite-loss-gameCount": numFavoriteLosses,
		"underdog-win-profit": profitUnderdogWins,
		"underdog-loss-profit": profitUnderdogLosses,
		"favorite-win-profit": profitFavoriteWins,
		"favorite-loss-profit": profitFavoriteLosses,
	};
	["underdog", "favorite"].forEach((teamState) => {
		["win", "loss"].forEach((outcome) => {
			const prefix = teamState + "-" + outcome + "-";

			const gameCount_chip = document.getElementById(
				prefix + "gameCount"
			);
			displayResult({
				element: gameCount_chip,
				value: chipValues[prefix + "gameCount"] + " games",
				textFormatFn: null,
				applySignAndColor: false,
			});

			const profit_chip = document.getElementById(prefix + "profit");
			displayResult({
				element: profit_chip,
				value: chipValues[prefix + "profit"],
				textFormatFn: formatCentsToDollars,
				applySignAndColor: true,
			});
		});
	});
}

// Section 4: Top Three Bets
function renderTopBets(topThreeBets, prediction, wager) {
	const topBetsSection = document.getElementById("top-bets-result");
	const topBets = topBetsSection.querySelectorAll(".result-chip");

	topBets.forEach((topBet, index) => {
		//
		// 1) Top Bet Header:
		//
		// E.g.:
		//
		//   Game #24   <-- gameNumberDiv
		//   +$310.56   <-- profitDiv
		//
		const gameNumberDiv = topBet.querySelector(".result-chip-title");
		displayResult({
			element: gameNumberDiv,
			value: `Game #${topThreeBets[index].game_number}`,
			textFormatFn: null,
			applySignAndColor: false,
		});
		const profitDiv = topBet.querySelector(".result-chip-value");
		displayResult({
			element: profitDiv,
			value: topThreeBets[index].profit_cents,
			textFormatFn: formatCentsToDollars,
			applySignAndColor: true,
		});

		//
		// 2) Top Bet Table:
		// E.g.:
		//  ____________________________________
		//  | Outcome             | [Win/Loss] |  <-- Row I)
		//  | Odds to [Win/Lose]  | +480       |  <-- Row II)
		//  | Wager               | $50        |  <-- Row III)
		//  | Payout              | $290       |  <-- Row IV)
		//  ____________________________________
		const gameTable = topBet.querySelector("table");

		// Row I) Outcome
		const gameTableOutcome = gameTable.querySelector(
			"tr.result-chip-table-outcome"
		);
		displayResult({
			element: gameTableOutcome.querySelector("td"),
			value: prediction ? "Win" : "Loss",
			textFormatFn: null,
			applySignAndColor: false,
		});

		// Row II) Odds
		const gameTableOdds = gameTable.querySelector(
			"tr.result-chip-table-odds"
		);
		gameTableOdds.querySelector("th").textContent = prediction
			? "Odds to Win"
			: "Odds to Lose";
		displayResult({
			element: gameTableOdds.querySelector("td"),
			value: topThreeBets[index].odds,
			textFormatFn: null,
			applySignAndColor: false,
		});

		// Row III) Wager
		const gameTableWager = gameTable.querySelector(
			"tr.result-chip-table-wager"
		);
		displayResult({
			element: gameTableWager.querySelector("td"),
			value: wager,
			textFormatFn: formatCentsToDollars,
			applySignAndColor: false,
		});

		// Row IV) Payout
		const gameTablePayout = gameTable.querySelector(
			"tr.result-chip-table-payout"
		);
		displayResult({
			element: gameTablePayout.querySelector("td"),
			value: wager + topThreeBets[index].profit_cents,
			textFormatFn: formatCentsToDollars,
			applySignAndColor: false,
		});
	});
}

//
// HELPER FUNCTIONS
//
function formatCentsToDollars(cents, includePlusSign = false) {
	// Determine if amount has cents when converted to dollars
	let hasCents = cents % 100 !== 0;
	let options = {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: hasCents ? 2 : 0,
		maximumFractionDigits: hasCents ? 2 : 0,
	};

	let formatter = new Intl.NumberFormat("en-US", options);
	const amount = formatter.format(cents / 100);
	if (includePlusSign && cents > 0) {
		return "+" + amount;
	}
	return amount;
}

function formatPercent(number, iscludePlusSign = true) {
	return `${number >= 0 ? "+" : ""}${number.toPrecision(3)}%`;

	// *The below version converts 0.805 to 0.81 instead of keeping 0.805
	// return `${number >= 0 ? "+" : ""}${Number(
	// 	Number(number.toPrecision(3)).toFixed(2)
	// )}%`;
}

function displayResult({
	element,
	value,
	textFormatFn,
	applySignAndColor = true,
}) {
	if (textFormatFn == null) {
		element.textContent = value;
	} else {
		element.textContent = textFormatFn(value, applySignAndColor);
	}

	if (applySignAndColor) {
		element.classList.remove("positive", "negative");
		element.classList.add(value >= 0 ? "positive" : "negative");
	}
}

function deconstructBetResultData(resultSummary) {
	// Initialize
	let numUnderdogWins = 0;
	let numUnderdogLosses = 0;
	let numFavoriteWins = 0;
	let numFavoriteLosses = 0;

	let profitUnderdogWins = 0;
	let profitUnderdogLosses = 0;
	let profitFavoriteWins = 0;
	let profitFavoriteLosses = 0;

	// Assign values
	for (const row of resultSummary) {
		const { is_favorite, outcome, num_games, total_profit_cents } = row;
		if (!is_favorite && outcome) {
			// Underdog win
			numUnderdogWins = num_games;
			profitUnderdogWins = total_profit_cents;
		} else if (!is_favorite && !outcome) {
			// Underdog loss
			numUnderdogLosses = num_games;
			profitUnderdogLosses = total_profit_cents;
		} else if (is_favorite && outcome) {
			// Favorite win
			numFavoriteWins = num_games;
			profitFavoriteWins = total_profit_cents;
		} else if (is_favorite && !outcome) {
			// Favorite loss
			numFavoriteLosses = num_games;
			profitFavoriteLosses = total_profit_cents;
		}
	}
	return {
		numUnderdogWins,
		numUnderdogLosses,
		numFavoriteWins,
		numFavoriteLosses,
		profitUnderdogWins,
		profitUnderdogLosses,
		profitFavoriteWins,
		profitFavoriteLosses,
	};
}
