const createQueryRoute = require("../utils/createQueryRoute");
const resultSummaryQuery = require("../queries/resultSummarySQL");

module.exports = createQueryRoute(resultSummaryQuery);
