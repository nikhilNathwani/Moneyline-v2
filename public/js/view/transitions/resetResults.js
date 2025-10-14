// Upon subsequent submits, reset the results view
function resetResultsUI(isFirstSubmit, isWideScreenLayout) {
	if (isFirstSubmit) return;

	// Scroll to top of results container
	scrollToTopOfResults(isWideScreenLayout);

	// Duration of fading out existing results
	timeout = fadeOutResults();
	return new Promise((resolve) => setTimeout(resolve, timeout));
}
