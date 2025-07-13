// Show 'Return to filters' button
// (when filters are scrolled out of view in stacked mode)
// Handle 'Return to filters' button
// (only shown in stacked mode when filters are out of view)
const filterContainer = document.getElementById("filter-container");
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
