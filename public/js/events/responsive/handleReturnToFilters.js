const filterContainer = document.getElementById("filter-container");
const filterReturnButton = document.getElementById("return-to-filters");

// Show 'Return to filters' button when:
// 1. in stacked mode, and
// 2. filters are scrolled out of view (i.e. only 20% or less is visible)
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

// Scroll to filterContainer when 'Return to filters' button is clicked
filterReturnButton.addEventListener("click", function () {
	filterContainer.scrollIntoView({ behavior: "smooth", block: "start" });
});
