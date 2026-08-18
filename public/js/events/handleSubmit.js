const submitButton = document.getElementById("submit-button");
const resultContainer = document.getElementById("result-container");

let isFirstLoad = true;

submitButton.addEventListener("click", function () {
	// Narrow-screen only in effect — collapses the tall onboarding
	// panel back to the compact pill bar. Only real clicks should do
	// this, not the automatic first-load call below, so a first-time
	// narrow-screen visitor still sees the full expanded view before
	// they've touched anything.
	collapseNarrowFilters();
	updateResults();
});

// Filters and results are always visible together now — run once on
// page load (with the dropdowns' default selections) so results are
// there immediately, instead of starting from an empty state.
updateResults();

async function updateResults() {
	// Step 1: Start fetching immediately
	const filterValues = getFilterValues();
	const resultSummaryPromise = fetchResultSummary(filterValues);
	const topBetsPromise = fetchTopBets(filterValues);
	const perGameProfitPromise = fetchPerGameProfit(filterValues);

	// Step 2: Fade out any previous results (nothing to fade on first load)
	const fadeOutDuration = isFirstLoad ? 0 : fadeOutResults() || 0;
	const transitionPromise = new Promise((resolve) =>
		setTimeout(resolve, fadeOutDuration)
	);

	// Step 3: Wait for data + fade-out in parallel
	try {
		const [resultSummary, topBets, perGameProfit] = await Promise.all([
			resultSummaryPromise,
			topBetsPromise,
			perGameProfitPromise,
			transitionPromise,
		]);

		// Step 4: Populate result elements
		populateResultSummary(
			resultSummary,
			filterValues.prediction,
			filterValues.wager
		);
		populateTopBets(topBets, filterValues.prediction, filterValues.wager);
		renderProfitChart(perGameProfit);

		// Step 5: Scroll to the top of the fresh results (not on first load)
		if (!isFirstLoad) {
			resultContainer.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}

		// Step 6: Fade in new results
		setTimeout(fadeInResults, isFirstLoad ? 0 : 600);

		isFirstLoad = false;
	} catch (err) {
		console.error("Error fetching results:", err);
	}
}
