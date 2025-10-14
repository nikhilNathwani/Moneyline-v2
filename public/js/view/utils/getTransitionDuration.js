function getTransitionDuration(element) {
	const computedStyle = getComputedStyle(element);
	return 1000 * parseFloat(computedStyle.transitionDuration);
}
