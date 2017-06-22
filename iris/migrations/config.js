const path = require('path');

module.exports = {
  driver: 'rethinkdbdash',
  db: 'spectrum',
  host: 'localhost',
  port: 28015,
  migrationsDirectory: 'iris/migrations',
};
