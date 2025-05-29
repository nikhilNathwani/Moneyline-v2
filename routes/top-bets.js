const express = require("express");
const router = express.Router();
const handleQueryRoute = require("../utils/handleQueryRoute");
const { runTopBetsQuery } = require("../queries");

router.post("/", handleQueryRoute(runTopBetsQuery));

module.exports = router;
