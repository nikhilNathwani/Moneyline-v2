// Narrow-screen only in effect (the CSS this toggles is scoped to
// max-width:999px) — harmless no-op on wide, where the class has no
// matching rule. Default (no class) = expanded, the tall onboarding
// view with title/subtitle; .filters-collapsed = the compact pill bar.
const appEl = document.getElementById("app");
const filtersExpandToggle = document.getElementById("filters-expand-toggle");

filtersExpandToggle.addEventListener("click", function () {
	appEl.classList.toggle("filters-collapsed");
	updateExpandToggleLabel();
});

function updateExpandToggleLabel() {
	const collapsed = appEl.classList.contains("filters-collapsed");
	filtersExpandToggle.setAttribute(
		"aria-label",
		collapsed ? "Show filter details" : "Hide filter details"
	);
}

// Called from handleSubmit.js's click handler — only an actual click
// on "View Results" should collapse the panel, not the automatic
// first-load fetch, so a first-time narrow-screen visitor still gets
// the full-context expanded view before they've touched anything.
function collapseNarrowFilters() {
	appEl.classList.add("filters-collapsed");
	updateExpandToggleLabel();
}
