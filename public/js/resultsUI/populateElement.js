function populateResultElement({
	element,
	value,
	textFormatFn,
	applySignAndColor = true,
}) {
	if (textFormatFn == null) {
		element.textContent = value;
	} else {
		element.textContent = textFormatFn(value, applySignAndColor);
	}

	if (applySignAndColor) {
		element.classList.remove("positive", "negative");
		element.classList.add(value >= 0 ? "positive" : "negative");
	}
}
