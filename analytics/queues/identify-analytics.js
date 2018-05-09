// @flow
const debug = require('debug')('analytics:queues:identify');
import Raven from 'shared/raven';
import type { Job, IdentifyAnalyticsData } from 'shared/bull/types';
import { getUserById } from '../models/user';
import { identify, transformations, hash } from '../utils';

const processJob = async (job: Job<IdentifyAnalyticsData>) => {
  const { userId } = job.data;
  const user = await getUserById(userId);
  const analyticsUser = transformations.analyticsUser(user);

  return await identify(hash(userId), analyticsUser);
};

export default async (job: Job<IdentifyAnalyticsData>) => {
  try {
    await processJob(job);
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
