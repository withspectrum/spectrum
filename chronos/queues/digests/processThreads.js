// @flow
const debug = require('debug')('chronos:queue:digest-process-threads');
import { getTotalMessageCount, getNewMessageCount } from '../../models/message';
import { getActiveThreadsInTimeframe } from '../../models/thread';
import { MIN_TOTAL_MESSAGE_COUNT, MIN_NEW_MESSAGE_COUNT } from '../constants';
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import type { Timeframe, Thread, Threads, ThreadsWithData } from './types';

export const getThreadsForDigest = async (timeframe: Timeframe) => {
  // returns array of thread ids
  const threadIds = await getActiveThreadsInTimeframe(timeframe);

  // if no threadIds, escape
  if (!threadIds || threadIds.length === 0) {
    return null;
  }

  // for each thread that was active in the last week, return a new array containing a record for each thread with the thread data and the message count
  const messageCountPromises = threadIds.map(
    async ({ communityId, channelId, id, content, ...thread }) => ({
      communityId,
      channelId,
      id,
      title: content.title,
      newMessageCount: await getNewMessageCount(id, timeframe),
      totalMessageCount: await getTotalMessageCount(id),
    })
  );

  const messageCounts = await Promise.all(messageCountPromises);

  // remove any threads where the total message count is less than 10
  const filteredTopThreads = messageCounts
    .filter(thread => thread.totalMessageCount >= MIN_TOTAL_MESSAGE_COUNT)
    .filter(thread => thread.newMessageCount >= MIN_NEW_MESSAGE_COUNT);

  if (!filteredTopThreads || filteredTopThreads.length === 0) {
    return null;
  }

  // returns an array of threads that are active in the last week and have the minimum required message count to be considered valuable
  return filteredTopThreads;
};

export const attachDataToThreads = async (threads: Threads) => {
  // create an empty object for the final output
  let obj = {};

  const getCommunity = id => getCommunityById(id);
  const getChannel = id => getChannelById(id);

  // for each thread, get the community data that we'll need when rendering an email
  const topThreadsWithDataPromises = threads.map(async thread => {
    const community = await getCommunity(thread.communityId);
    const channel = await getChannel(thread.channelId);

    // if the thread was created in the timeframe being evaluated, it's dumb to say: 10 messages (10 new!) - so here we're composing a string that will be passed to the email that determines what we should show for the message count. If all 10 messages are new, it will simply say '10 new!'
    const messageCountString =
      thread.newMessageCount === thread.totalMessageCount
        ? `<span class="newMessageCount">${thread.newMessageCount} new messages</span>`
        : `
          <span class="totalMessageCount">
            ${thread.totalMessageCount} messages
          </span>
          <span class="newMessageCount">(${thread.newMessageCount} new)</span>
      `;

    // this is the final data we'll send to the email for each thread
    const threadWithData = {
      community: {
        name: community.name,
        slug: community.slug,
        profilePhoto: community.profilePhoto,
      },
      channel: {
        name: channel.name,
        slug: channel.slug,
      },
      channelId: thread.channelId,
      title: thread.title,
      threadId: thread.id,
      messageCountString,
      newMessageCount: thread.newMessageCount,
      totalMessageCount: thread.totalMessageCount,
    };
    return threadWithData;
  });

  const threadsWithCommunityData = await Promise.all(
    topThreadsWithDataPromises
  );

  // for each of the active threads this week, determine if that that thread has been categorized yet into the new object. If so, push that thread into the array, otherwise create a new key/value pair in the object for the channel + thread
  threadsWithCommunityData.map(
    thread =>
      obj[thread.channelId]
        ? (obj[thread.channelId] = [...obj[thread.channelId], { ...thread }])
        : (obj[thread.channelId] = [{ ...thread }])
  );

  // return the final object containing keys for channelIds, and arrays of threads for values
  return obj;
};
