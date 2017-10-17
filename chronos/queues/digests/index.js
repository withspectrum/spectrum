// @flow
const debug = require('debug')('chronos:queue:send-digest-email');
import createQueue from 'shared/bull/create-queue';
import { PROCESS_INDIVIDUAL_DIGEST } from '../constants';
import { getThreadsForDigest, attachDataToThreads } from './processThreads';
import { getUsersForDigest } from '../../models/usersSettings';
import { getTopCommunities } from '../../models/community';
const digestEmailWorker = createQueue(PROCESS_INDIVIDUAL_DIGEST);

/*
  1. Process threads
  Get all the threads in a given timeframe, get their message counts, and discard any threads that dont meet the minimum thresholds for new/total messages

  2. Process users
  Get all users who are eligible for a daily digest

  3. Query once for top communities - in each downstream worker we'll decide whether or not to show upsells to join more communities to the user

  4. For each user who wants to receive a digest, start a new job containing the user data and full threads data - NOTE: This will create a job *per* user in order to spread out the load on the database over time
*/

type DigestJob = {
  data: {
    timeframe: 'daily' | 'weekly',
  },
  id: string,
};

export default async (job: DigestJob) => {
  const { timeframe } = job.data;
  debug(`\nnew job: ${job.id}`);
  debug(`\nprocessing ${timeframe} digest`);

  // 1
  const threads = await getThreadsForDigest(timeframe);
  if (!threads || threads.length === 0) {
    debug('\n ❌ No threads found for this digest');
    return;
  }
  debug('\n ⚙️ Fetched threads for digest');

  const threadsWithData = await attachDataToThreads(threads);
  if (!threadsWithData || threadsWithData.length === 0) {
    debug('\n ❌ No threads with data eligible for this digest');
    return;
  }
  debug('\n ⚙️ Processed threads with data');

  // 2
  const users = await getUsersForDigest(timeframe);
  if (!users || users.length === 0) {
    debug('\n ❌ No users who want this digest');
    return;
  }
  debug('\n ⚙️ Fetched users who want this digest');

  //3
  const topCommunities = await getTopCommunities(20);
  debug('\n ⚙️ Fetched top communities');

  // 4
  const usersPromises = users.map(user =>
    digestEmailWorker.add(
      { user, threadsWithData, topCommunities, timeframe },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    )
  );

  debug('\n ⚙️ Created individual jobs for each users digest');
  try {
    return Promise.all(usersPromises);
  } catch (err) {
    console.log('Error processing digests:', err);
  }
};
