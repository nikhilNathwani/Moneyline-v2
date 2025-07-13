function clearExistingResults() {
	const results = document.querySelectorAll(".result");
	results.forEach((result) => {
		result.classList.add("disappear");
	});
}

function initializeResultsView() {
	timeout = 0;
	if (isAwaitingFirstSubmit) {
		latestWidescreenStatus = isWideScreen();
		if (latestWidescreenStatus) {
			// duration of smoothly snapping filters to left
			timeout = parseTransitionDuration(appContainer);
		}
		isAwaitingFirstSubmit = false;
	} else {
		const result = document.querySelector(".result");
		clearExistingResults();
		// duration of fading out existing results
		timeout = parseTransitionDuration(result);
	}
	scrollToTopOfResults();
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
