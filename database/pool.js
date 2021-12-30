const debug = require('debug')('api:database:pool');
const Pool = require('pg').Pool;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl:
    process.env.USE_SSL == 1
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

debug(process.env.PG_USER);
debug(process.env.PG_HOST);
debug(process.env.PG_DATABASE);
debug(process.env.PG_PASSWORD);
debug(process.env.PG_PORT);
debug(process.env.USE_SSL);

pool.on('connect', (client) => {
  debug('connected');
});

pool.on('remove', (client) => {
  debug('removed');
});

pool.on('acquire', (client) => {
  debug('acquired');
});

pool.on('error', (err, client) => {
  debug('error: ' + err);
});

module.exports = pool;
