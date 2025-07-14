// Breakpoints
const minWidthAdjacentMode = 1000; //px
const minHeight = 600; //px

function isWideScreen() {
	// Check if the screen is wide enough to be in adjacent mode
	// (as opposed to stacked mode)
	return (
		window.innerWidth >= minWidthAdjacentMode &&
		window.innerHeight >= minHeight
	);
}
