const submitButton = document.getElementById("submit-button");

// Handle submit ('View Results' button)
submitButton.addEventListener("click", handleSubmit);

async function handleSubmit() {
	console.log("submit button clicked");
	//Bring results to foreground by either scrolling down or
	//snapping filters to the left (depending on screen size)
	collapseFilterView();

	var timeout = 0;
	if (!appContainer.classList.contains(APP_STATE.INITIAL)) {
		clearExistingResults();
		if (appContainer.classList.contains(APP_STATE.ADJACENT)) {
			timeout = 500; //wait for fade-out of existing results
		} else {
			timeout = 200; //no fade-out of existing results in STACKED mode, so just a short wait
		}
	}

	setTimeout(async () => {
		//Generate new results based on filters applied
		const filterValues = getFilterValues();

		//Generate BET RESULTS
		try {
			const resultSummary = await fetchResultSummary(filterValues);
			renderResultSummary(
				resultSummary,
				filterValues.prediction,
				filterValues.wager
			);
		} catch (err) {
			console.error("Error fetching result summary:", err);
		}

		//Generate TOP BETS
		try {
			const topBets = await fetchTopBets(filterValues);
			renderTopBets(topBets, filterValues.prediction, filterValues.wager);
		} catch (err) {
			console.error("Error fetching top bets:", err);
		}
	}, timeout);

	setTimeout(() => {
		fadeInResults();
	}, timeout + 500);
}
