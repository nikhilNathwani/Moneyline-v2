const appContainer = document.getElementById("app");
const submitButton = document.getElementById("submit-button");

// Handle submit ('View Results' button)
submitButton.addEventListener("click", handleSubmit);

function parseTransitionDuration(element) {
	console.log("Parsing transition duration for element:", element);
	const computedStyle = getComputedStyle(element);
	return 1000 * parseFloat(computedStyle.transitionDuration);
}

function scrollToTopOfResults(smoothScroll = true) {
	const resultContainer = document.getElementById("result-container");

	if (isWideScreen()) {
		resultContainer.scrollTo({
			top: 0,
			behavior: smoothScroll ? "smooth" : "auto",
		});
	} else {
		resultContainer.scrollIntoView({
			behavior: smoothScroll ? "smooth" : "auto",
			block: "start",
		});
	}
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
		scrollToTopOfResults();
		// duration of fading out existing results
		timeout = parseTransitionDuration(result);
	}
	return new Promise((resolve) => setTimeout(resolve, timeout));
}

async function handleSubmit() {
	console.log("submit button clicked");
	appContainer.classList.remove("awaitingFirstSubmit");

	// Step 1: Start fetching immediately
	const filterValues = getFilterValues();
	const resultSummaryPromise = fetchResultSummary(filterValues);
	const topBetsPromise = fetchTopBets(filterValues);

	// Step 2: Start collapsing UI and measuring delay
	const uiTransitionPromise = initializeResultsView();

	// Step 3: Wait for data + timeout in parallel
	try {
		const [resultSummary, topBets, _] = await Promise.all([
			resultSummaryPromise,
			topBetsPromise,
			uiTransitionPromise,
		]);

		// Step 4: Render results
		renderResultSummary(
			resultSummary,
			filterValues.prediction,
			filterValues.wager
		);
		renderTopBets(topBets, filterValues.prediction, filterValues.wager);

		// Step 5: Fade in new results
		fadeInResults();
		// setTimeout(fadeInResults, 500);
	} catch (err) {
		console.error("Error fetching results:", err);
	}
}
