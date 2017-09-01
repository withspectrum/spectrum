/**
 * Database setup is done here
 */
const fs = require('fs');
const path = require('path');
const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

const DEFAULT_CONFIG = {
  db: 'spectrum',
};

const PRODUCTION_CONFIG = {
  password: process.env.COMPOSE_RETHINKDB_PASSWORD,
  host: process.env.COMPOSE_RETHINKDB_URL,
  port: process.env.COMPOSE_RETHINKDB_PORT,
  ssl: {
    ca: IS_PROD && require('raw-loader!../../cacert'),
  },
};

const config = IS_PROD
  ? {
      ...DEFAULT_CONFIG,
      ...PRODUCTION_CONFIG,
    }
  : {
      ...DEFAULT_CONFIG,
    };

var r = require('rethinkdbdash')(config);

module.exports = { db: r };

// /**
//  * Database setup is done here
//  */
// const fs = require('fs');
// const path = require('path');
// const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';
//
// const DEFAULT_CONFIG = {
//   db: 'spectrum',
// };
//
// // COMPOSE_RETHINKDB_URL="aws-us-east-1-portal.6.dblayer.com"
// // COMPOSE_RETHINKDB_PORT=19241
// // COMPOSE_RETHINKDB_PASSWORD="12460d0b-b1dc-4505-9cd5-7a96e58ad825"
//
// const PRODUCTION_CONFIG = {
//   password: "12460d0b-b1dc-4505-9cd5-7a96e58ad825",
//   host: "aws-us-east-1-portal.6.dblayer.com"  ,
//   port: 19241,
//   ssl: {
//     ca: !IS_PROD && require('raw-loader!../../cacert'),
//   },
// };
//
// const config = !IS_PROD
//   ? {
//       ...DEFAULT_CONFIG,
//       ...PRODUCTION_CONFIG,
//     }
//   : {
//       ...DEFAULT_CONFIG,
//     };
//
// var r = require('rethinkdbdash')(config);
//
// module.exports = { db: r };
