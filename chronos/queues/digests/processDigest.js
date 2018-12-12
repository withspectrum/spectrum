// @flow
const debug = require('debug')('chronos:queue:process-digest');
import Raven from 'shared/raven';
import { getUserIdsForDigest } from 'chronos/models/usersSettings';
import type { Timeframe } from 'chronos/types';
import { processIndividualDigestQueue } from 'shared/bull/queues';
import { getTopCommunitiesByMemberCount } from 'shared/db/queries/community';

const processJob = async (timeframe: Timeframe) => {
  debug(`Processing ${timeframe} digest`);

  const topCommunities = await getTopCommunitiesByMemberCount(20);
  const topCommunityIds = topCommunities.map(community => community.id);

  let after = 0;
  let limit = 1000;
  let done = false;

  const createJobs = async (arr: Array<string>) => {
    if (!arr || arr.length === 0) return;

    return Promise.all(
      arr.map(userId => {
        return processIndividualDigestQueue.add({
          userId,
          timeframe,
          topCommunityIds,
        });
      })
    );
  };

  const processUserIds = async (arr: Array<string>) => {
    if (done) {
      return createJobs(arr);
    }

    if (arr.length < limit) {
      done = true;
      return await createJobs(arr);
    }

    return createJobs(arr).then(async () => {
      after = after + limit;
      const nextUserIds = await getUserIdsForDigest(timeframe, after, limit);
      return processUserIds(nextUserIds);
    });
  };

  const initialUserIds = await getUserIdsForDigest(timeframe, after, limit);
  return processUserIds(initialUserIds);
};

export default async (timeframe: Timeframe) => {
  try {
    await processJob(timeframe);
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
