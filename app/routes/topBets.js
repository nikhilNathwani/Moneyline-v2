const createQueryRoute = require("../utils/createQueryRoute");
const { topBetsQuery } = require("../utils/parseSQL");

module.exports = createQueryRoute(topBetsQuery);
