const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.json({ message: "bet-results route stub working" });
});

module.exports = router;
