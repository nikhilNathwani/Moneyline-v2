// This module exports a single shared PostgreSQL
// connection pool used by all routes

const { Pool } = require("pg");

const pool = new Pool({
	connectionString: process.env.POSTGRES_URL,
});

module.exports = pool;
