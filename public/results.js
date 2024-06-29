function makeTotalProfitDiv(totalProfit) {
	const totalProfitBanner = document.getElementById("total-profit-banner");
	const totalProfitHeader = totalProfitBanner.querySelector("p");
	const totalProfitSpan = totalProfitBanner.querySelector("span");

	totalProfitHeader.textContent = `You would've ${
		totalProfit >= 0 ? "won" : "lost"
	}`;

	totalProfitSpan.className =
		totalProfit >= 0 ? "result-banner-positive" : "result-banner-negative";
	totalProfitSpan.textContent = `${
		totalProfit >= 0 ? "+" : ""
	}${formatCurrency(totalProfit)}`;
}

function makeROIDiv(totalProfit, numGames, wager) {
	//Make ROI div banner
	const roiBanner = document.getElementById("roi-banner");
	const roiSpan = roiBanner.querySelector("span");

	const roi = (totalProfit * 100) / (numGames * wager);
	roiSpan.className =
		totalProfit >= 0 ? "result-banner-positive" : "result-banner-negative";
	roiSpan.textContent = `${totalProfit >= 0 ? "+" : ""}${roi.toPrecision(
		3
	)}%`;

	//Make ROI div details
	return;
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
