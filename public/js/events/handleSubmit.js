const submitButton = document.getElementById("submit-button");

// Handle submit ('View Results' button)
submitButton.addEventListener("click", handleSubmit);

function parseTransitionDuration(element) {
	console.log("Parsing transition duration for element:", element);
	const computedStyle = getComputedStyle(element);
	return 1000 * parseFloat(computedStyle.transitionDuration);
}

function getTransitionDuration() {
	let timeout = 0;

	//If results are already present, need to delay the rendering
	// of new results (to account for the fade-out of prior results,
	// and the potential collapsing of the filter view)
	if (!isAwaitingFirstSubmit) {
		//account for fade-out of existing results
		const result = document.querySelector(".result");
		console.log("Found result to fade out:", result);
		timeout = parseTransitionDuration(result);
		if (appContainer.classList.contains(LAYOUT_MODE.ADJACENT)) {
			//account for filter section collapsing to left
			console.log("ptd:", appContainer);
			timeout = Math.max(timeout, parseTransitionDuration(appContainer));
		}
	}
	return timeout;
}

async function handleSubmit() {
	console.log("submit button clicked");

	// Step 1: Start fetching immediately
	const filterValues = getFilterValues();
	const resultSummaryPromise = fetchResultSummary(filterValues);
	const topBetsPromise = fetchTopBets(filterValues);

	// Step 2: Start collapsing UI and measuring delay
	collapseFilterView();

	let timeout = 0;
	timeout = getTransitionDuration();
	if (!isAwaitingFirstSubmit) {
		clearExistingResults();
	}

	const timeoutPromise = new Promise((resolve) =>
		setTimeout(resolve, timeout)
	);

	if (isAwaitingFirstSubmit) {
		isAwaitingFirstSubmit = false;
	}

	// Step 3: Wait for data + timeout in parallel
	try {
		const [resultSummary, topBets, _] = await Promise.all([
			resultSummaryPromise,
			topBetsPromise,
			timeoutPromise,
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
