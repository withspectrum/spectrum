// @flow
const debug = require('debug')('analytics:queues:identify');
import Raven from 'shared/raven';
import type { Job, IdentifyAnalyticsData } from 'shared/bull/types';
import { getUserById } from 'shared/db/queries/user';
import { identify, transformations } from '../utils';

const processJob = async (job: Job<IdentifyAnalyticsData>) => {
  const { userId } = job.data;

  if (!userId) return;

  const user = await getUserById(userId);

  if (!user) return;

  const analyticsUser = transformations.analyticsUser(user);
  return await identify(userId, analyticsUser);
};

export default async (job: Job<IdentifyAnalyticsData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
