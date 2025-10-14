function fadeOutResults() {
	const results = document.querySelectorAll(".result");
	if (results.length == 0) return;
	results.forEach((result) => {
		result.classList.add("disappear");
	});
	// Use the first result to get the transition duration
	return getTransitionDuration(results[0]);
}

function fadeInResults() {
	const results = document.querySelectorAll(".result");
	results.forEach((result, index) => {
		setTimeout(() => {
			result.classList.remove("disappear");
		}, index * 500);
	});
}
