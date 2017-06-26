const Queue = require('bull');

const redis = process.env.NODE_ENV === 'production'
  ? {
      port: process.env.COMPOSE_REDIS_PORT,
      host: process.env.COMPOSE_REDIS_URL,
      password: process.env.COMPOSE_REDIS_PASSWORD,
    }
  : undefined; // Use the local instance of Redis in development by not passing any connection string

// Leave the options undefined if we're using the default redis connection
const options = redis && { redis };

export default name => new Queue(name, options);
