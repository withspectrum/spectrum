// @flow
const Queue = require('bull');
import createRedis from './create-redis';
import Raven from 'shared/raven';

const client = createRedis();
const subscriber = createRedis();

function createQueue(name: string, queueOptions?: Object = {}) {
  const queue = new Queue(name, {
    createClient: function(type) {
      switch (type) {
        case 'client':
          return client;
        case 'subscriber':
          return subscriber;
        default:
          return createRedis();
      }
    },
    defaultJobOptions: {
      removeOnComplete: true,
      attempts: 1,
    },
    ...queueOptions,
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
  queue.on('failed', (job, err) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Job#${job.id} failed, with following reason`);
      console.error(err);
      return;
    }
    // In production log failed job to Sentry
    Raven.captureException(err);
  });
  return queue;
}

module.exports = createQueue;
