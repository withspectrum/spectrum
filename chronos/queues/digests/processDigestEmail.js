// @flow
const debug = require('debug')('chronos:queue:process-individual-digest');
import createQueue from 'shared/bull/create-queue';
import getReputationString from './processReputation';
import {
  getUpsellCommunities,
  getIntersectingChannels,
  getEligibleThreadsForUser,
} from './processUsers';
import { getUsersChannelsEligibleForWeeklyDigest } from '../../models/usersChannels';
import type { Timeframe, User, ThreadsWithData, Communities } from './types';
import { SEND_DIGEST_EMAIL } from '../constants';
const sendDigestEmailQueue = createQueue(SEND_DIGEST_EMAIL);

type Job = {
  data: {
    user: User,
    threadsWithData: ThreadsWithData,
    topCommunities: Communities,
    timeframe: Timeframe,
  },
};
export default async (job: Job) => {
  const { user, threadsWithData, topCommunities, timeframe } = job.data;
  debug('\n ⚙️ Starting a new job to process an individual digest');

  const reputationString = await getReputationString(user, timeframe);
  debug('\n ⚙️ Processed reputation string');

  // we upsell communities if the user has joined less than a certain amount
  const recommendedCommunities = await getUpsellCommunities(
    user,
    topCommunities
  );
  debug('\n ⚙️ Processed recommended communities');

  // get all the channels where the user is a member
  const usersChannels = await getUsersChannelsEligibleForWeeklyDigest(
    user.userId
  );
  if (!usersChannels || usersChannels.length === 0) {
    debug('\n ❌  No channels where user is a member');
    return;
  }
  debug('\n ⚙️ Fetched users channels');

  // overlapping channel Ids where the user is a member *and* a thread was posted to for this digest
  const intersectingChannels = await getIntersectingChannels(
    threadsWithData,
    usersChannels
  );
  if (!intersectingChannels || intersectingChannels.length === 0) {
    debug('\n ❌  No intersecting channels found');
    return;
  }
  debug('\n ⚙️ Processed intersecting channels');

  // get the eligible threads for this users digest based on their intersecting channels
  const eligibleThreadsForUser = await getEligibleThreadsForUser(
    threadsWithData,
    intersectingChannels
  );
  if (!eligibleThreadsForUser || eligibleThreadsForUser.length === 0) {
    debug('\n ❌  No eligible threads for users digest');
    return;
  }
  debug('\n ⚙️ Processed eligible threads for user');

  return sendDigestEmailQueue
    .add(
      {
        ...user,
        name: user.firstName || null,
        communities: recommendedCommunities,
        reputationString,
        timeframe,
        threads: eligibleThreadsForUser,
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    )
    .then(() => debug('\n ✅ Sent a daily digest'));
};
