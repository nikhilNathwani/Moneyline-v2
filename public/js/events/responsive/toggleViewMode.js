/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     VARIABLES                                            */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

let isAwaitingFirstSubmit = true;
// Layout modes
const LAYOUT_MODE = {
	STACKED: "stackedLayout",
	ADJACENT: "adjacentLayout",
};

function getLayoutMode() {
	if (appContainer.classList.contains(LAYOUT_MODE.STACKED)) {
		return LAYOUT_MODE.STACKED;
	} else if (appContainer.classList.contains(LAYOUT_MODE.ADJACENT)) {
		return LAYOUT_MODE.ADJACENT;
	}
	return null;
}

function setLayoutMode(state, smoothScroll = true) {
	Object.values(LAYOUT_MODE).forEach((state) =>
		appContainer.classList.remove(state)
	);
	appContainer.classList.add(state);

	if (state === LAYOUT_MODE.ADJACENT) {
		resultContainer.scrollTo({
			top: 0,
			behavior: smoothScroll ? "smooth" : "auto",
		});
	}

	if (state === LAYOUT_MODE.STACKED) {
		resultContainer.scrollIntoView({
			behavior: smoothScroll ? "smooth" : "auto",
			block: "start",
		});
	}
}

// Page sections
var appContainer = document.getElementById("app");
var filterContainer = document.getElementById("filter-container");
var resultContainer = document.getElementById("result-container");

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     EVENT HANDLING                                       */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Handle screen resize
window.addEventListener("resize", function () {
	console.log(
		"Window resized, isAwaitingFirstSubmit:",
		isAwaitingFirstSubmit,
		"getLayoutMode:",
		getLayoutMode()
	);
	if (isAwaitingFirstSubmit) {
		return;
	}
	if (isWideScreen()) {
		if (getLayoutMode() != LAYOUT_MODE.ADJACENT) {
			setLayoutMode(LAYOUT_MODE.ADJACENT, (smoothScroll = false));
		}
	} else {
		if (getLayoutMode() != LAYOUT_MODE.STACKED) {
			setLayoutMode(LAYOUT_MODE.STACKED, (smoothScroll = false));
		}
	}
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     HELPER FUNCTIONS                                        */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
