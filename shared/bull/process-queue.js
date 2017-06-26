// @flow
var Queue = require('bull');

var redis = process.env.NODE_ENV === 'production'
  ? {
      port: process.env.COMPOSE_REDIS_PORT,
      host: process.env.COMPOSE_REDIS_URL,
      password: process.env.COMPOSE_REDIS_PASSWORD,
    }
  : undefined; // Use the local instance of Redis in development by not passing any connection string

// Leave the options undefined if we're using the default redis connection
var options = redis && { redis: redis };

// A small wrapper around bull to have the connection options in a single place
function processQueue(name /*: string*/, cb /*: Function*/) {
  console.log(`📥 Processing ${name} queue...`);
  return new Queue(name, options).process(cb);
}

module.exports = processQueue;
