//
// RESULT CONSTRUCTION
//
function populateResultSummary(resultSummary, prediction, wager) {
	const {
		numUnderdogWins,
		numUnderdogLosses,
		numFavoriteWins,
		numFavoriteLosses,
		profitUnderdogWins,
		profitUnderdogLosses,
		profitFavoriteWins,
		profitFavoriteLosses,
	} = deconstructResultSummary(resultSummary);
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
	populateResultElement({
		element: totalProfitHeader,
		value: `You would've ${totalProfit >= 0 ? "won" : "lost"}`,
		textFormatFn: null,
		applySignAndColor: false,
	});

	const totalProfitValue = totalProfitBanner.querySelector("span");
	populateResultElement({
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
	populateResultElement({
		element: roiSpan,
		value: roi,
		textFormatFn: formatPercent,
		applySignAndColor: true,
	});

	//Make ROI div details
	const roiDetails = document.getElementById("roi-details");
	//
	const roiTotalWagered = roiDetails.querySelector("#totalWagered");
	populateResultElement({
		element: roiTotalWagered,
		value: numGames * wager,
		textFormatFn: formatCentsToDollars,
		applySignAndColor: false,
	});
	//
	const roiTotalPayout = roiDetails.querySelector("#totalPayout");
	populateResultElement({
		element: roiTotalPayout,
		value: totalProfit + numGames * wager,
		textFormatFn: formatCentsToDollars,
		applySignAndColor: false,
	});
	//
	const roiProfit = roiDetails.querySelector("#profit");
	populateResultElement({
		element: roiProfit,
		value: totalProfit,
		textFormatFn: formatCentsToDollars,
		applySignAndColor: true,
	});
	//
	const roiPercentReturn = roiDetails.querySelector("#percentReturn");
	populateResultElement({
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
	const winLossCountValue = prediction
		? totalProfit >= 0
			? numUnderdogWins + numFavoriteWins
			: -numUnderdogLosses - numFavoriteLosses
		: totalProfit >= 0
		? numUnderdogLosses + numFavoriteLosses
		: -numUnderdogWins - numFavoriteWins;
	populateResultElement({
		element: winLossCount,
		value: winLossCountValue,
		textFormatFn: (winLossCountValue) => Math.abs(winLossCountValue),
		applySignAndColor: true,
	});
	winLossCount.classList.add(`${totalProfit >= 0 ? "positive" : "negative"}`);
	const winLossLabel = winLossBanner.querySelector("span:last-child");
	winLossLabel.textContent = `${
		totalProfit >= 0 ? "correct" : "incorrect"
	} bets.`;

	//Make win-loss diverging bar chart
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

	// Scale every bar relative to the single largest magnitude across
	// all 4 categories, so bar lengths are honestly comparable to
	// each other rather than each maxing out its own row.
	const maxAbsProfit = Math.max(
		Math.abs(profitUnderdogWins),
		Math.abs(profitUnderdogLosses),
		Math.abs(profitFavoriteWins),
		Math.abs(profitFavoriteLosses)
	);

	["underdog", "favorite"].forEach((teamState) => {
		["win", "loss"].forEach((outcome) => {
			const prefix = teamState + "-" + outcome + "-";

			const gameCount_label = document.getElementById(
				prefix + "gameCount"
			);
			populateResultElement({
				element: gameCount_label,
				value: chipValues[prefix + "gameCount"] + " games",
				textFormatFn: null,
				applySignAndColor: false,
			});

			const profitValue = chipValues[prefix + "profit"];
			const profit_label = document.getElementById(prefix + "profit");
			populateResultElement({
				element: profit_label,
				value: profitValue,
				textFormatFn: formatCentsToDollars,
				applySignAndColor: true,
			});

			const bar = document.getElementById(prefix + "bar");
			const widthPercent =
				maxAbsProfit === 0
					? 0
					: (Math.abs(profitValue) / maxAbsProfit) * 100;
			bar.style.width = widthPercent + "%";
		});
	});
}
