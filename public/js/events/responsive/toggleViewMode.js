/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     VARIABLES                                            */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Breakpoint
const minWidthAdjacentMode = 1000; //px
const minHeight = 600; //px

// App states
const APP_STATE = {
	INITIAL: "initialMode",
	STACKED: "stackedMode",
	ADJACENT: "adjacentMode",
};

// Page sections
var appContainer = document.getElementById("app");
var filterContainer = document.getElementById("filter-container");
var resultContainer = document.getElementById("result-container");

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     EVENT HANDLING                                         */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Handle screen resize
window.addEventListener("resize", function () {
	if (appContainer.classList.contains(APP_STATE.INITIAL)) {
		return;
	}
	if (
		(window.innerWidth < minWidthAdjacentMode ||
			window.innerHeight < minHeight) &&
		!appContainer.classList.contains(APP_STATE.STACKED)
	) {
		setAppState(APP_STATE.STACKED);
		resultContainer.scrollIntoView({ block: "start" });
		return;
	}
	if (
		window.innerWidth >= minWidthAdjacentMode &&
		window.innerHeight >= minHeight &&
		!appContainer.classList.contains(APP_STATE.ADJACENT)
	) {
		setAppState(APP_STATE.ADJACENT);
	}
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     HELPER FUNCTIONS                                        */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function setAppState(state) {
	Object.values(APP_STATE).forEach((state) =>
		appContainer.classList.remove(state)
	);
	appContainer.classList.add(state);
}
