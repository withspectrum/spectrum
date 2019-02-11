// @flow
const Queue = require('bull');
import createRedis from './create-redis';
import Raven from 'shared/raven';
import { statsd } from 'shared/statsd';

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
    console.error(`Job#${job.id} stalled, processing again.`);
    console.error({ job });
    statsd.increment('jobs.active', -1, {
      queue: name,
    });
  });
  queue.on('waiting', () => {
    statsd.increment('jobs.waiting', 1, {
      queue: name,
    });
  });
  queue.on('active', () => {
    statsd.increment('jobs.waiting', -1, {
      queue: name,
    });
    statsd.increment('jobs.active', 1, {
      queue: name,
    });
  });
  queue.on('completed', () => {
    statsd.increment('jobs.active', -1, {
      queue: name,
    });
    statsd.increment('jobs.completed', 1, {
      queue: name,
    });
  });
  queue.on('error', err => {
    console.error('Job errored');
    console.error({ err });
    Raven.captureException(new Error(err));
    statsd.increment('jobs.active', -1, {
      queue: name,
    });
    statsd.increment('jobs.errored', 1, {
      queue: name,
    });
  });
  queue.on('failed', (job, err) => {
    console.error(`Job#${job.id} failed, with following reason`);
    console.error({ job, err });
    Raven.captureException(err);
    statsd.increment('jobs.active', -1, {
      queue: name,
    });
    statsd.increment('jobs.failed', 1, {
      queue: name,
    });
  });
  return queue;
}

module.exports = createQueue;
