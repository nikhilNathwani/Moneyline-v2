/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     VARIABLES                                            */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
let isAwaitingFirstSubmit = true;
let latestWidescreenStatus = false;

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     EVENT HANDLING                                       */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Manage scroll position of results container when app switches
// from widescreen (adjacent) to narrow (stacked) layout
window.addEventListener("resize", function () {
	if (isAwaitingFirstSubmit) {
		return; //filters are full-screen until first submit
	}
	if (latestWidescreenStatus != isWideScreen()) {
		scrollToTopOfResults((smoothScroll = false));
		latestWidescreenStatus = isWideScreen();
	}
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     HELPER FUNCTIONS                                     */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
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
