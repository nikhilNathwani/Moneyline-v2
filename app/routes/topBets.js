const createQueryRoute = require("../utils/createQueryRoute");
const topBetsQuery = require("../queries/topBetsSQL");

module.exports = createQueryRoute(topBetsQuery);
