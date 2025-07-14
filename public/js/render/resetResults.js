function clearExistingResults() {
	const results = document.querySelectorAll(".result");
	// Use the first one to get the transition duration
	if (results.length == 0) return;
	results.forEach((result) => {
		result.classList.add("disappear");
	});
	return parseTransitionDuration(results[0]);
}

function showResultsView(isFirstSubmit, isWideScreenLayout) {
	if (!isFirstSubmit) return;
	appContainer.classList.remove("awaitingFirstSubmit");
	isAwaitingFirstSubmit = false;
	if (!isWideScreenLayout) {
		scrollToTopOfResults(isWideScreenLayout);
	}
	timeout = parseTransitionDuration(appContainer);
	console.log("isAwaitingFirstSubmit:", isAwaitingFirstSubmit);
	return new Promise((resolve) => setTimeout(resolve, timeout));
}

function resetResultsView(isFirstSubmit, isWideScreenLayout) {
	if (isFirstSubmit) return;
	scrollToTopOfResults(isWideScreenLayout);
	// duration of fading out existing results
	timeout = clearExistingResults();
	return new Promise((resolve) => setTimeout(resolve, timeout));
}

function fadeInResults() {
	const results = document.querySelectorAll(".result");
	results.forEach((result, index) => {
		setTimeout(() => {
			result.classList.remove("disappear");
		}, index * 500);
	});
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     HELPER FUNCTIONS                                     */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function parseTransitionDuration(element) {
	console.log("Parsing transition duration for element:", element);
	const computedStyle = getComputedStyle(element);
	return 1000 * parseFloat(computedStyle.transitionDuration);
}
