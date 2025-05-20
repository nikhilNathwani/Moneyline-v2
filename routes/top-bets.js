const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.json({ message: "top-bets route stub working" });
});

module.exports = router;
