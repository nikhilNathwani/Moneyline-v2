//Just for error logging purposes
function getCallerFile() {
	let callerFile = "unknown";
	try {
		const parent = module.parent || module; // fallback if undefined
		callerFile = path.basename(parent.filename);
	} catch (_) {}
	return callerFile;
}

module.exports = getCallerFile;
