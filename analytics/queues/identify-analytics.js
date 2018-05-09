// @flow
const debug = require('debug')('analytics:queues:track');

const processJob = async (job: Job<IdentifyAnalyticsData>) => {};

export default async (job: Job<IdentifyAnalyticsData>) => {
  try {
    await processJob(job);
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
