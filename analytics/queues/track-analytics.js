// @flow
const debug = require('debug')('analytics:queues:track');

const processJob = async (job: Job<TrackAnalyticsData>) => {};

export default async (job: Job<TrackAnalyticsData>) => {
  try {
    await processJob(job);
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
