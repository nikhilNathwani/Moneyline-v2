function getFilterValues() {
	return {
		seasonStartYear: document.getElementById("season-input").value,
		team: document.getElementById("team-input").value,
		wager: parseInt(document.getElementById("wager-input").value, 10) * 100, //convert to cents
		prediction:
			document.getElementById("outcome-input").value == "Win every game"
				? true
				: false,
	};
}
