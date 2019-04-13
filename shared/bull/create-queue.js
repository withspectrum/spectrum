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
  queue.on('waiting', jobId => {
    statsd.increment('jobs.waiting', 1, {
      queue: name,
    });
    queue
      .getJob(jobId)
      .then(job => {
        if (!job) return;
        return job.finished();
      })
      .then(() => {
        statsd.increment('jobs.waiting', -1, {
          queue: name,
        });
      })
      .catch(() => {
        statsd.increment('jobs.waiting', -1, {
          queue: name,
        });
      });
  });
  queue.on('active', (jobId: string, jobPromise: Promise<void>) => {
    const startTime = new Date().getTime();
    statsd.increment('jobs.active', 1, {
      queue: name,
    });
    jobPromise
      .then(() => {
        const duration = new Date().getTime() - startTime;
        statsd.timing('jobs.duration', duration, {
          queue: name,
        });
        statsd.increment('jobs.active', -1, {
          queue: name,
        });
        statsd.increment('jobs.completed', 1, {
          queue: name,
        });
      })
      .catch(() => {
        const duration = new Date().getTime() - startTime;
        statsd.timing('jobs.duration', duration);
        statsd.increment('jobs.active', -1, {
          queue: name,
        });
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
