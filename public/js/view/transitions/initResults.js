// Unhide results view upon submitting form for first time
function unhideResultsUI(isFirstSubmit, isWideScreenLayout) {
	if (!isFirstSubmit) return;

	// Remove the awaitingFirstSubmit class initiate UI changes:
	// - Change resultContainer to visible
	// - (widescreen-only) Snap filters to left side
	const appContainer = document.getElementById("app");
	appContainer.classList.remove("awaitingFirstSubmit");

	// Scroll to top of results container
	if (!isWideScreenLayout) {
		scrollToTopOfResults(isWideScreenLayout);
	}
	// Duration of snapping filters to left side
	timeout = getTransitionDuration(appContainer);
	return new Promise((resolve) => setTimeout(resolve, timeout));
}
