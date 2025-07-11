function animateFirstCollapse() {
	const app = document.getElementById("app");
	app.classList.add("animatedCollapse");

	function handleTransitionEnd(event) {
		if (
			event.target === app &&
			event.propertyName === "grid-template-columns"
		) {
			app.classList.remove("animatedCollapse");
			app.removeEventListener("transitionend", handleTransitionEnd);
		}
	}

	app.addEventListener("transitionend", handleTransitionEnd);
}

// Collapse filter view and bring results to foreground
// Either by:
//   a) (narrow screen case) Scrolling down & showing 'Return to filters' button
//   b) (wide screen case) Snapping filters to the left
function collapseFilterView() {
	//If screen is sufficiently wide, scroll down to reveal results
	if (isWideScreen()) {
		console.log(
			"Wide screen detected, isAwaitingFirstSubmit:",
			isAwaitingFirstSubmit
		);
		if (isAwaitingFirstSubmit) {
			animateFirstCollapse();
		}
		setLayoutMode(LAYOUT_MODE.ADJACENT);
	}
	//If screen is sufficiently narrow, display results side-by-side with filters
	else {
		setLayoutMode(LAYOUT_MODE.STACKED);
	}
}

// Show 'Return to filters' button
// (when filters are scrolled out of view in stacked mode)
// Handle 'Return to filters' button
// (only shown in stacked mode when filters are out of view)
const filterReturnButton = document.getElementById("return-to-filters");
filterReturnButton.addEventListener("click", function () {
	filterContainer.scrollIntoView({ behavior: "smooth", block: "start" });
});
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				// filterContainer is out of view
				filterReturnButton.style.display = "block";
			} else {
				// filterContainer is in view
				filterReturnButton.style.display = "none";
			}
		});
	},
	{
		threshold: 0.2, // Trigger when <=20% of the element is in view
		// rootMargin: "0% 0px 0px 0px",
	}
);
observer.observe(filterContainer);
