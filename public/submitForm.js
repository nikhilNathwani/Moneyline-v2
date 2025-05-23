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

//Fetch data from api and pass results along to calcBetResults then makeResultDivs
async function generateResults() {
	const { seasonStartYear, team, prediction, wager } = getFilterValues();

	try {
		const response = await fetch("/api/games", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ seasonStartYear, team }),
		});
		const json = await response.json(); //json is {message:"success", data:[array of games]}
		const games = json.data;
		const { betResults, topThreeBets } = calcBetResults(
			games,
			prediction,
			wager
		);
		makeResultDivs(betResults, topThreeBets, prediction, wager);
	} catch (error) {
		console.error("Error fetchung games:", err);
	}
}

function getFilterValues() {
	return {
		seasonStartYear: document.getElementById("season-input").value,
		team: document.getElementById("team-input").value,
		wager: document.getElementById("wager-input").value,
		prediction:
			document.getElementById("outcome-input").value == "Win every game"
				? true
				: false,
	};
}
