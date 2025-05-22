const submitButton = document.getElementById("submit-button");

// Handle submit ('View Results' button)
submitButton.addEventListener("click", function () {
	console.log("submit button clicked");
	//Bring results to foreground by either scrolling down or
	//snapping filters to the left (depending on screen size)
	snapFilterView();

	var timeout = 0;
	if (!appContainer.classList.contains(APP_STATE.INITIAL)) {
		clearExistingResults();
		if (appContainer.classList.contains(APP_STATE.ADJACENT)) {
			timeout = 500; //wait for fade-out of existing results
		} else {
			timeout = 200; //no fade-out of existing results in STACKED mode, so just a short wait
		}
	}

	setTimeout(() => {
		//Generate new results based on filters applied
		generateResults();
	}, timeout);

	setTimeout(() => {
		fadeInResults();
	}, timeout + 500);
});
