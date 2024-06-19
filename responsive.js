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

// Buttons
const submitButton = document.getElementById("submit-button");
const filterReturnButton = document.getElementById("return-to-filters");

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                                                          */
/*     EVENT HANDLING                                         */
/*                                                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Handle submit
submitButton.addEventListener("click", function () {
	if (window.innerWidth < minWidthAdjacentMode) {
		setAppState(APP_STATE.STACKED);
		resultContainer.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	} else {
		if (window.innerHeight >= minHeight) {
			setAppState(APP_STATE.ADJACENT);
			resultContainer.scrollTo({ top: 0, behavior: "smooth" });
		}
	}
});

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
		threshold: 0.0, // Trigger when 0% of the element is out of view
		rootMargin: "-20% 0px 0px 0px", // Adjust this value as needed
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
