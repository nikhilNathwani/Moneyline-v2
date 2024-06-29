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
	roiProfit.textContent = `${formatCurrency(totalProfit)}`;
	//
	const roiPercentReturn = roiDetails.querySelector("#percentReturn");
	roiPercentReturn.className = `result-chip-value result-chip-value-${
		totalProfit >= 0 ? "positive" : "negative"
	}`;
	roiPercentReturn.textContent = `${formatPercent(roi)}`;
}

function makeWinLossDiv(
	numUnderdogWins,
	numUnderdogLosses,
	numFavoriteWins,
	numFavoriteLosses,
	profitUnderdogWins,
	profitUnderdogLosses,
	profitFavoriteWins,
	profitFavoriteLosses
) {
	return;
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
