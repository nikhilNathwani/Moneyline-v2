function makeTotalProfitDiv(totalProfit) {
	const totalProfitSpan = document.querySelector("#total-profit-banner span");
	totalProfitSpan.className =
		totalProfit > 0 ? "result-banner-positive" : "result-banner-negative";
	totalProfitSpan.textContent = `${formatCurrency(totalProfit)}`;
}

function makeROIDiv(totalProfit, numGames, wager) {
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
