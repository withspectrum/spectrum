// @flow
const debug = require('debug')('chronos:queue:process-individual-digest');
import Raven from 'shared/raven';
import getReputationString from './getReputationString';
import { getUpsellCommunities } from './getUpsellCommunities';
import { getThreadsInChannelsInTimeframe } from 'chronos/models/thread';
import { getUsersChannelsEligibleForWeeklyDigest } from 'chronos/models/usersChannels';
import { sendDigestEmailQueue } from 'shared/bull/queues';
import { getCommunitiesById } from 'shared/db/queries/community';
import { getUserById } from 'shared/db/queries/user';
import type { Job, ProcessIndividualDigestJobData } from 'shared/bull/types';

import {
  attachMetadataToThreads,
  attachMessageCountStringToThreads,
  attachScoreToThreads,
  cleanThreadData,
} from './processThreads';

const processJob = async (job: Job<ProcessIndividualDigestJobData>) => {
  const { userId, topCommunityIds, timeframe } = job.data;

  debug(`Processing individual digest for ${userId}`);

  const topCommunities = await getCommunitiesById(topCommunityIds);

  debug('Got top communities for digest');

  const [reputationString, communities, usersChannelsIds] = await Promise.all([
    getReputationString(userId, timeframe),
    getUpsellCommunities(userId, topCommunities),
    getUsersChannelsEligibleForWeeklyDigest(userId),
  ]);

  if (!usersChannelsIds || usersChannelsIds.length === 0) {
    debug('User is not a member of any channels');
    return;
  }

  debug('Got reputation string, upsell communities, and eligible channels');

  const threadsInTimeframe = await getThreadsInChannelsInTimeframe(
    timeframe,
    usersChannelsIds
  );

  if (!threadsInTimeframe || threadsInTimeframe.length === 0) {
    debug('No threads available for digest');
    return;
  }

  debug('Got threads in timeframe');

  let hasOverflowThreads = false;
  const threads = await attachMetadataToThreads(threadsInTimeframe, timeframe)
    .then(threads => attachMessageCountStringToThreads(threads))
    .then(threads => attachScoreToThreads(threads))
    .then(threads => cleanThreadData(threads))
    .then(threads => {
      hasOverflowThreads = true;
      return threads.slice(0, 20);
    });

  const user = await getUserById(userId);

  debug('Attached digest data to threads');
  debug(`Sending digest email to ${user.email ? user.email : user.id}`);

  return sendDigestEmailQueue.add({
    email: user.email,
    userId: user.id,
    username: user.username,
    user,
    communities,
    reputationString,
    timeframe,
    threads,
    hasOverflowThreads,
  });
};

export default async (job: Job<ProcessIndividualDigestJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
