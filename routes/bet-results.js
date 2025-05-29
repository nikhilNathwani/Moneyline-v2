const express = require("express");
const router = express.Router();
const handleQueryRoute = require("../utils/handleQueryRoute");
const { runBetResultsQuery } = require("../queries");

router.post("/", handleQueryRoute(runBetResultsQuery));

module.exports = router;
