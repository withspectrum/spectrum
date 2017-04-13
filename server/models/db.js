/**
 * Database setup is done here
 */
var r = require('rethinkdbdash')({
  db: 'spectrum',
});

module.exports = { db: r };
