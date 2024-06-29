function makeTotalProfitDiv(totalProfit) {
	const totalProfitBanner = document.getElementById("total-profit-banner");
	const totalProfitHeader = totalProfitBanner.querySelector("p");
	const totalProfitSpan = totalProfitBanner.querySelector("span");

	totalProfitHeader.textContent = `You would've ${
		totalProfit >= 0 ? "won" : "lost"
	}`;

	totalProfitSpan.className = `result-banner-${
		totalProfit >= 0 ? "positive" : "negative"
	}`;

	totalProfitSpan.textContent = `${
		totalProfit >= 0 ? "+" : ""
	}${formatCurrency(totalProfit)}`;
}

function makeROIDiv(totalProfit, numGames, wager) {
	const roi = (totalProfit * 100) / (numGames * wager);

	//Make ROI div banner
	const roiBanner = document.getElementById("roi-banner");
	const roiSpan = roiBanner.querySelector("span");
	roiSpan.className = `result-banner-${
		totalProfit >= 0 ? "positive" : "negative"
	}`;
	roiSpan.textContent = `${formatPercent(roi)}`;

	//Make ROI div details
	const roiDetails = document.getElementById("roi-details");
	//
	const roiTotalWagered = roiDetails.querySelector("#totalWagered");
	roiTotalWagered.textContent = `${formatCurrency(numGames * wager)}`;
	//
	const roiTotalPayout = roiDetails.querySelector("#totalPayout");
	roiTotalPayout.textContent = `${formatCurrency(
		totalProfit + numGames * wager
	)}`;
	//
	const roiProfit = roiDetails.querySelector("#profit");
	roiProfit.className = `result-chip-value result-chip-value-${
		totalProfit >= 0 ? "positive" : "negative"
	}`;
	roiProfit.textContent = `${totalProfit >= 0 ? "+" : ""}${formatCurrency(
		totalProfit
	)}`;
	//
	const roiPercentReturn = roiDetails.querySelector("#percentReturn");
	roiPercentReturn.className = `result-chip-value result-chip-value-${
		totalProfit >= 0 ? "positive" : "negative"
	}`;
	roiPercentReturn.textContent = `${formatPercent(roi)}`;
}

function makeWinLossDiv(
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
		? numUnderdogWins + numFavoriteWins
		: numUnderdogLosses + numFavoriteLosses;
	winLossCount.className = `result-banner-${
		totalProfit >= 0 ? "positive" : "negative"
	}`;
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
		"underdog-win-payout": profitUnderdogWins,
		"underdog-loss-payout": profitUnderdogLosses,
		"favorite-win-payout": profitFavoriteWins,
		"favorite-loss-payout": profitFavoriteLosses,
	};
	["underdog", "favorite"].forEach((teamState) => {
		["win", "loss"].forEach((outcome) => {
			const prefix = teamState + "-" + outcome + "-";

			const gameCount_chip = document.getElementById(
				prefix + "gameCount"
			);
			gameCount_chip.textContent =
				chipValues[prefix + "gameCount"] + " games";

			const payout_chip = document.getElementById(prefix + "payout");
			payout_chip.textContent = `${
				chipValues[prefix + "payout"] >= 0 ? "+" : ""
			}${formatCurrency(chipValues[prefix + "payout"])}`;
			payout_chip.className = `result-chip-value result-chip-value-${
				chipValues[prefix + "payout"] >= 0 ? "positive" : "negative"
			}`;
		});
	});
}

function formatCurrency(number) {
	// Determine if the number has cents
	let hasCents = number % 1 !== 0;
	let options = {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: hasCents ? 2 : 0,
		maximumFractionDigits: hasCents ? 2 : 0,
	};

	let formatter = new Intl.NumberFormat("en-US", options);
	return formatter.format(number);
}

function formatPercent(number) {
	return `${number >= 0 ? "+" : ""}${number.toPrecision(3)}%`;
}
