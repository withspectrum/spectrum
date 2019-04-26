// @flow
import Redis from 'ioredis';

const config =
  process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV
    ? {
        port: process.env.REDIS_LABS_JOB_QUEUE_PORT,
        host: process.env.REDIS_LABS_JOB_QUEUE_URL,
        password: process.env.REDIS_LABS_JOB_QUEUE_PASSWORD,
      }
    : undefined; // Use the local instance of Redis in development by not passing any connection string

export default (extraConfig?: Object) =>
  new Redis({
    ...config,
    ...extraConfig,
  });
