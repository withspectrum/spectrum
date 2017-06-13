// @flow
import Queue from 'bull';

const redis = process.env.NODE_ENV === 'production'
  ? {
      port: process.env.COMPOSE_REDIS_PORT,
      host: process.env.COMPOSE_REDIS_URL,
      password: process.env.COMPOSE_REDIS_PASSWORD,
    }
  : undefined; // Use the local instance of Redis in development by not passing any connection string

// Leave the options undefined if we're using the default redis connection
const options = redis && { redis };

// A small wrapper around bull to have the connection options in a single place
export default (name: string, cb: Function) => {
  console.log(`📥 Processing ${name} queue...`);
  return new Queue(name, options).process(cb);
};
