// @flow
const CronJob = require('../node_modules/cron').CronJob;
const createQueue = require('../../shared/bull/create-queue');
import Raven from 'raven';

// logging to Sentry for weekly digests
if (process.env.NODE_ENV !== 'development') {
  Raven.config(
    'https://3bd8523edd5d43d7998f9b85562d6924:d391ea04b0dc45b28610e7fad735b0d0@sentry.io/154812',
    {
      environment: process.env.NODE_ENV,
    }
  ).install();
}

export const addQueue = (name: string, data: any) => {
  const worker = createQueue(name);
  return worker.add({ ...data }).catch(err => Raven.captureException(err));
};

export const createJob = (
  name: string, // name of the queue the cron job should trigger
  pattern: string, // cron pattern
  start: boolean // start immediately
) => {
  try {
    const job = new CronJob({
      cronTime: pattern,
      onTick: () => {
        console.log('🕑 New cron job initiated');
        return addQueue(
          name,
          {},
          { removeOnComplete: true, removeOnFail: true }
        );
      },
      start,
      timeZone: 'America/Los_Angeles',
    });

    return job.start();
  } catch (err) {
    console.log('❌ Error processing cron job:\n' + err);
  }
};
