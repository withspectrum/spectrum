// @flow
const Queue = require('bull');
// $FlowFixMe
const Redis = require('ioredis');
const Raven = require('raven');

if (process.env.NODE_ENV !== 'development') {
  Raven.config(
    'https://3bd8523edd5d43d7998f9b85562d6924:d391ea04b0dc45b28610e7fad735b0d0@sentry.io/154812',
    {
      environment: process.env.NODE_ENV,
    }
  ).install();
}

const redis =
  process.env.NODE_ENV === 'production'
    ? {
        port: process.env.COMPOSE_REDIS_PORT,
        host: process.env.COMPOSE_REDIS_URL,
        password: process.env.COMPOSE_REDIS_PASSWORD,
      }
    : undefined; // Use the local instance of Redis in development by not passing any connection string

const client = new Redis(redis);
const subscriber = new Redis(redis);

function createQueue(name /*: string */) {
  const queue = new Queue(name, {
    createClient: function(type) {
      switch (type) {
        case 'client':
          return client;
        case 'subscriber':
          return subscriber;
        default:
          return new Redis(redis);
      }
    },
  });
  // NOTE(@mxstbr): This logs a "Possible event emitter memory leak" warning,
  // but that's a bug upstream in bull. Reference: OptimalBits/bull#503
  queue.on('stalled', job => {
    const message = `Job#${job.id} stalled, processing again.`;
    if (process.env.NODE_ENV !== 'production') {
      console.error(message);
      return;
    }
    // In production log stalled job to Sentry
    Raven.captureException(new Error(message));
  });
  return queue;
}

module.exports = createQueue;
