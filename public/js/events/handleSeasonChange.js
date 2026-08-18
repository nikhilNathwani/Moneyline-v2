const seasonInput = document.getElementById("season-input");
const teamInput = document.getElementById("team-input");

seasonInput.addEventListener("change", refreshTeamRecords);

// Run once on load too, so the default season's records show up
// immediately rather than only after the user touches the dropdown.
refreshTeamRecords();

async function refreshTeamRecords() {
	const records = await fetchTeamRecords(seasonInput.value);
	const recordByTeam = new Map(
		records.map((r) => [r.team, `${r.wins}-${r.losses}`])
	);

	Array.from(teamInput.options).forEach((option) => {
		// Re-derive from option.value (the plain team name) every time,
		// not from the current label — safe to call repeatedly as the
		// season changes without compounding "(W-L) (W-L)" text.
		const record = recordByTeam.get(option.value);
		option.textContent = record
			? `${option.value} (${record})`
			: option.value;
	});
}
