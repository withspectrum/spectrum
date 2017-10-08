// @flow
/**
 * Our PubSub instance
 */
import { RedisPubSub } from 'graphql-redis-subscriptions';

const connection =
  process.env.NODE_ENV === 'production'
    ? {
        port: process.env.COMPOSE_REDIS_PORT,
        host: process.env.COMPOSE_REDIS_URL,
        password: process.env.COMPOSE_REDIS_PASSWORD,
      }
    : undefined; // Use the local instance of Redis in development by not passing any connection string

module.exports = new RedisPubSub({
  connection,
});
