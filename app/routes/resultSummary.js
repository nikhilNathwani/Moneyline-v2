const createQueryRoute = require("../utils/createQueryRoute");
const { resultSummaryQuery } = require("../utils/parseSQL");

module.exports = createQueryRoute(resultSummaryQuery);
