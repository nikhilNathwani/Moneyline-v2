function deconstructResultSummary(resultSummary) {
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
