/**
 * Database setup is done here
 */
const fs = require('fs');
const path = require('path');
const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

const config = {
  db: 'spectrum',
  password: 'V3GyuVa4JdKFcMwinfff4FAhRubFJKLNiZFcwg4s6NuRxao2hyhcB2Vbrb4Y',
  host: 'ec2-54-161-144-68.compute-1.amazonaws.com',
  // port: process.env.COMPOSE_RETHINKDB_PORT,
};

var r = require('rethinkdbdash')(config);

module.exports = { db: r };
