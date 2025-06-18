function clearExistingResults() {
	const results = document.querySelectorAll(".result");
	results.forEach((result) => {
		result.classList.add("disappear");
	});
}

function fadeInResults() {
	const results = document.querySelectorAll(".result");
	results.forEach((result, index) => {
		setTimeout(() => {
			result.classList.remove("disappear");
		}, index * 500);
	});
}
