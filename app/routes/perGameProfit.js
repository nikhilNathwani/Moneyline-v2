const createQueryRoute = require("../utils/createQueryRoute");
const { perGameProfitQuery } = require("../utils/parseSQL");

module.exports = createQueryRoute(perGameProfitQuery);
