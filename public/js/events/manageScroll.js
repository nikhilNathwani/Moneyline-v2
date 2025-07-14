/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     VARIABLES                                            */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
let latestWidescreenStatus = isWideScreen();
let latestScrollOffset = 0;
const resultContainer = document.getElementById("result-container");

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     EVENT HANDLING                                       */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// Manage scroll position of results container when app switches
// from widescreen (adjacent) to narrow (stacked) layout
window.addEventListener("resize", () => {
	if (isAwaitingFirstSubmit) return;

	const currentWidescreen = isWideScreen();
	if (currentWidescreen !== latestWidescreenStatus) {
		restoreScrollPosition(currentWidescreen);
		latestWidescreenStatus = currentWidescreen;
	} else {
		saveScrollPosition(currentWidescreen);
	}
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     SCROLL FUNCTIONS                                     */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Scroll to filters
// (used when 'Return to filters' button is clicked)
function scrollToFilters() {
	const filterContainer = document.getElementById("filter-container");
	filterContainer.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Save how far the user has scrolled in the results container
function saveScrollPosition(isWideScreenLayout) {
	const resultTop =
		resultContainer.getBoundingClientRect().top + window.scrollY;

	if (isWideScreenLayout) {
		// Adjacent layout: internal scroll within result container
		latestScrollOffset = resultContainer.scrollTop;
	} else {
		// Stacked layout: window scroll
		latestScrollOffset = window.scrollY - resultTop;
	}
}

// Restore how far the user has scrolled in the results container
// when switching between widescreen and narrow layouts
function restoreScrollPosition(isWideScreenLayout) {
	const resultTop =
		resultContainer.getBoundingClientRect().top + window.scrollY;

	if (isWideScreenLayout) {
		resultContainer.scrollTo({
			top: Math.max(latestScrollOffset, 0),
			behavior: "auto",
		});
	} else {
		window.scrollTo({
			top: resultTop + latestScrollOffset,
			behavior: "auto",
		});
	}
}

// Scroll to the top of the results container
// (used after submitting a new query)
function scrollToTopOfResults(isWideScreenLayout, smoothScroll = true) {
	const scrollBehavior = smoothScroll ? "smooth" : "auto";
	if (isWideScreenLayout) {
		resultContainer.scrollTo({
			top: 0,
			behavior: scrollBehavior,
		});
	} else {
		resultContainer.scrollIntoView({
			behavior: scrollBehavior,
			block: "start",
		});
	}
}
