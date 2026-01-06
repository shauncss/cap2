require('dotenv').config(); // Load the .env file

const knex = require('knex');

const db = knex({
  client: 'pg', // Ensure this says 'pg' for PostgreSQL
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
  },
  pool: { min: 0, max: 7 } // Helpful for 'acquire connection' errors
});

module.exports = db;