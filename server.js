require("dotenv").config(); // Load env vars first (local-only since .env.development.local isn't tracked in git)
const app = require("./app");
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
	if (process.env.NODE_ENV === "production") {
		console.log(`Server running on port ${PORT}`);
	} else {
		console.log(`Server running on http://localhost:${PORT}`);
	}
});
