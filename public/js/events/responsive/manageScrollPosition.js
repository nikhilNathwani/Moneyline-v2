/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     VARIABLES                                            */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
let latestWidescreenStatus = isWideScreen();
let latestScrollOffset = 0;

const resultContainer = document.getElementById("result-container");

function saveScrollPosition(isWideScreenLayout) {
	console.log("Saving scroll position...");
	const resultTop =
		resultContainer.getBoundingClientRect().top + window.scrollY;

	if (isWideScreenLayout) {
		// Adjacent layout: internal scroll
		latestScrollOffset = resultContainer.scrollTop;
	} else {
		// Stacked layout: window scroll
		latestScrollOffset = window.scrollY - resultTop;
	}
	console.log("Latest scroll offset:", latestScrollOffset);
}

function restoreScrollPosition(isWideScreenLayout) {
	console.log("Restoring scroll position...");
	const resultTop =
		resultContainer.getBoundingClientRect().top + window.scrollY;

	if (isWideScreenLayout) {
		resultContainer.scrollTo({
			top: Math.max(latestScrollOffset, 0),
			behavior: "auto",
		});
		console.log(
			"Widescreen: restored scroll to:",
			Math.max(latestScrollOffset, 0)
		);
	} else {
		window.scrollTo({
			top: resultTop + latestScrollOffset,
			behavior: "auto",
		});
		console.log("Narrowscreen: restored scroll to:", latestScrollOffset);
	}
}

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
/*     HELPER FUNCTIONS                                     */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function scrollToTopOfResults(isWideScreenLayout, smoothScroll = true) {
	if (isWideScreenLayout) {
		resultContainer.scrollTo({
			top: 0,
			behavior: smoothScroll ? "smooth" : "auto",
		});
	} else {
		console.log(
			"Scrolling to top of results container...smooth=",
			smoothScroll
		);
		resultContainer.scrollIntoView({
			behavior: smoothScroll ? "smooth" : "auto",
			block: "start",
		});
	}
}
