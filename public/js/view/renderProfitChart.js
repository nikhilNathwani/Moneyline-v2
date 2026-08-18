// Renders a cumulative-profit-across-the-season line chart as inline
// SVG. Hand-rolled (no charting library) to match the rest of this
// vanilla app. viewBox + preserveAspectRatio="none" lets the SVG
// stretch to any container width via CSS; the CSS side pins an
// aspect-ratio matching the viewBox exactly, so width/height always
// scale together — without that, a responsive width against a fixed
// pixel height stretches text and marks non-uniformly.
function renderProfitChart(perGameProfitRows) {
	const container = document.getElementById("profit-chart-container");

	// Cumulative series, starting at 0 before game 1 so the line
	// visibly starts on the zero baseline rather than mid-air.
	const cumulative = [0];
	perGameProfitRows.forEach((row) => {
		cumulative.push(
			cumulative[cumulative.length - 1] + row.profit_cents
		);
	});
	const lastIndex = cumulative.length - 1;

	const width = 600;
	const valueAreaHeight = 140;
	const height = valueAreaHeight;

	// paddingX leaves room for the end/peak/trough dots to render as
	// full circles instead of getting clipped in half at the SVG's
	// edge (a clipped half-circle at the end was the original "stray
	// red dot peeking out" bug). paddingY leaves room for value
	// labels to sit above/below their dots without clipping.
	const paddingX = 12;
	const paddingY = 22;
	const plotWidth = width - paddingX * 2;
	const plotHeight = valueAreaHeight - paddingY * 2;

	const minValue = Math.min(0, ...cumulative);
	const maxValue = Math.max(0, ...cumulative);
	const valueRange = maxValue - minValue || 1; // avoid /0 if flat at exactly 0 all season

	const xScale = (i) => paddingX + (i / lastIndex) * plotWidth;
	const yScale = (value) =>
		paddingY + plotHeight - ((value - minValue) / valueRange) * plotHeight;

	const zeroY = yScale(0);

	const linePath = cumulative
		.map(
			(value, i) =>
				`${i === 0 ? "M" : "L"}${xScale(i).toFixed(2)},${yScale(
					value
				).toFixed(2)}`
		)
		.join(" ");

	const areaPath = `${linePath} L${xScale(lastIndex).toFixed(
		2
	)},${zeroY.toFixed(2)} L${xScale(0).toFixed(2)},${zeroY.toFixed(2)} Z`;

	// Peak and trough — searched over the actual games played
	// (indices 1..lastIndex), excluding the synthetic index-0 "$0
	// before game 1" anchor point, so a season that only ever loses
	// doesn't just re-label its own starting point as the "peak".
	let peakIndex = 1;
	let troughIndex = 1;
	for (let i = 2; i <= lastIndex; i++) {
		if (cumulative[i] > cumulative[peakIndex]) peakIndex = i;
		if (cumulative[i] < cumulative[troughIndex]) troughIndex = i;
	}

	// Keeps labels from clipping off the left/right edge when they
	// land near either end of the chart.
	function anchorFor(x) {
		if (x < width * 0.15) return "start";
		if (x > width * 0.85) return "end";
		return "middle";
	}

	// Position-aware, not direction-hardcoded: a point in the upper
	// half of the value area gets its label BELOW (room to clip
	// against would be above it), a point in the lower half gets its
	// label ABOVE — works the same for a peak, a trough, or the end
	// marker without needing to special-case which is which.
	function labelYFor(y) {
		return y < valueAreaHeight / 2 ? y + 18 : y - 12;
	}

	function pointMarkup(index, radius, labelClassExtra) {
		const x = xScale(index);
		const y = yScale(cumulative[index]);
		const dotClass = cumulative[index] >= 0 ? "positive" : "negative";
		return `
			<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${radius}" class="profit-chart-dot ${dotClass}" />
			<text x="${x.toFixed(2)}" y="${labelYFor(y).toFixed(2)}" text-anchor="${anchorFor(x)}" class="profit-chart-value-label ${labelClassExtra} ${dotClass}">${formatCentsToDollars(cumulative[index], true)}</text>
		`;
	}

	// The end marker (Game N's final cumulative value) always shows,
	// bigger than peak/trough — it's the number the hero banner above
	// is stating, so the chart should visibly connect to it. If the
	// peak or trough happens to BE the final game (a season that ends
	// on its high, say), skip that one's own marker rather than
	// drawing two overlapping dots/labels at the same point.
	const skipPeak = peakIndex === lastIndex;
	const skipTrough = troughIndex === lastIndex;

	// Axis ticks were tried here (a tick dropping from the exact x
	// where the line starts/ends, to visually anchor "Game 1"/"Game N"
	// to the data) but kept reading as detached from the line no
	// matter how they were tuned. Simpler and more honest: state the
	// game range in the title instead of trying to make a tiny
	// in-chart axis carry it.
	container.innerHTML = `
		<div class="profit-chart-title">Cumulative profit across the season (Game 1 through ${perGameProfitRows.length})</div>
		<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" class="profit-chart-svg">
			<defs>
				<clipPath id="profit-chart-clip-above">
					<rect x="0" y="0" width="${width}" height="${zeroY.toFixed(2)}" />
				</clipPath>
				<clipPath id="profit-chart-clip-below">
					<rect x="0" y="${zeroY.toFixed(2)}" width="${width}" height="${(
		valueAreaHeight - zeroY
	).toFixed(2)}" />
				</clipPath>
			</defs>
			<line x1="0" y1="${zeroY.toFixed(2)}" x2="${width}" y2="${zeroY.toFixed(2)}" class="profit-chart-zero-line" />
			<path d="${areaPath}" class="profit-chart-area positive" clip-path="url(#profit-chart-clip-above)" />
			<path d="${areaPath}" class="profit-chart-area negative" clip-path="url(#profit-chart-clip-below)" />
			<path d="${linePath}" class="profit-chart-line" />
			${skipPeak ? "" : pointMarkup(peakIndex, 3, "extreme")}
			${skipTrough ? "" : pointMarkup(troughIndex, 3, "extreme")}
			${pointMarkup(lastIndex, 5, "end")}
		</svg>
	`;
}
