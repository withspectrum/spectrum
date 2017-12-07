// @flow
const debug = require('debug')('chronos:queue:digest-process-user');
import intersection from 'lodash.intersection';
import {
  COMMUNITY_UPSELL_THRESHOLD,
  NEW_MESSAGE_COUNT_WEIGHT,
  TOTAL_MESSAGE_COUNT_WEIGHT,
  MIN_THREADS_REQUIRED_FOR_DIGEST,
  MAX_THREAD_COUNT_PER_DIGEST,
} from '../constants';
import type { User, Community, ThreadsWithData } from './types';
import { getUsersCommunityIds } from '../../models/usersCommunities';

export const getIntersectingChannels = (
  threadsWithData: ThreadsWithData,
  channelIds: Array<string>
) => {
  // get an array of all channels where there are active threads this week
  const threadChannelKeys = Object.keys(threadsWithData);

  // for each user, determine the overlapping channels where they are a member and where active threads occurred this week
  return intersection(channelIds, threadChannelKeys);
};

export const getEligibleThreadsForUser = (
  threadsWithData: ThreadsWithData,
  channelIds: Array<string>
) => {
  let eligibleThreads = [];
  channelIds.map(c => eligibleThreads.push(...threadsWithData[c]));

  if (eligibleThreads.length < MIN_THREADS_REQUIRED_FOR_DIGEST) {
    return null;
  }

  return eligibleThreads
    .map(t => ({
      ...t,
      score:
        t.newMessageCount * NEW_MESSAGE_COUNT_WEIGHT +
        t.totalMessageCount * TOTAL_MESSAGE_COUNT_WEIGHT,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_THREAD_COUNT_PER_DIGEST);
};

export const getUpsellCommunities = async (
  user: User,
  topCommunities: Array<Community>
) => {
  // see what communities the user is in. if they are a member of less than 3 communities, we will upsell communities to join in the digest
  const usersCommunityIds = await getUsersCommunityIds(user.userId);

  // if the user has joined less than the threshold number of communities, take the top communities on Spectrum, remove any that the user has already joined, and slice the first 3 to send into the email template
  return usersCommunityIds.length <= COMMUNITY_UPSELL_THRESHOLD
    ? topCommunities
        .filter(community => usersCommunityIds.indexOf(community.id) <= -1)
        .slice(0, 3)
    : null;
};
