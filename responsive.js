/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     VARIABLES                                            */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Breakpoint
const minWidthAdjacentMode = 1000; //px

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

// Buttons
const submitButton = document.getElementById("submit-button");
const filterReturnButton = document.getElementById("return-to-filters");

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     UI TWEAK                                             */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// Shift filter container in initial state to account for scrollbar width when centering it
const scrollbarWidth = appContainer.offsetWidth - appContainer.clientWidth;
filterContainer.style.paddingRight = scrollbarWidth + "px";

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     EVENT HANDLING                                         */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Handle submit
submitButton.addEventListener("click", function () {
	// Undo the UI tweak (adjusting css left property of filterContainer in initial state)
	filterContainer.style.left = "0px";
	filterContainer.style.paddingRight = "0px";

	if (window.innerWidth < minWidthAdjacentMode) {
		setAppState(APP_STATE.STACKED);
		resultContainer.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	} else {
		setAppState(APP_STATE.ADJACENT);
		resultContainer.scrollTo({ top: 0, behavior: "smooth" });
	}
});

// Handle screen resize
window.addEventListener("resize", function () {
	if (appContainer.classList.contains(APP_STATE.INITIAL)) {
		return;
	}
	if (
		window.innerWidth < minWidthAdjacentMode &&
		!appContainer.classList.contains(APP_STATE.STACKED)
	) {
		setAppState(APP_STATE.STACKED);
		resultContainer.scrollIntoView({ block: "start" });
		return;
	}
	if (
		window.innerWidth >= minWidthAdjacentMode &&
		!appContainer.classList.contains(APP_STATE.ADJACENT)
	) {
		setAppState(APP_STATE.ADJACENT);
	}
});

// Handle 'return to filters' button (only shown in stacked mode)
filterReturnButton.addEventListener("click", function () {
	filterContainer.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Show 'return to filters' button (when filters are out of view)
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				// Element is out of view
				filterReturnButton.style.display = "block";
			} else {
				// Element is in view
				filterReturnButton.style.display = "none";
			}
		});
	},
	{
		threshold: 0.5, // Trigger when 50% of the element is out of view
		rootMargin: "-50px 0px 0px 0px", // Adjust this value as needed
	}
);
observer.observe(filterContainer);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     HELPER FUNCTIONS                                        */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function setAppState(state) {
	Object.values(APP_STATE).forEach((state) =>
		appContainer.classList.remove(state)
	); // Remove all possible states
	appContainer.classList.add(state); // Add the desired state
}
