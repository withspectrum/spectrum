// @flow
const debug = require('debug')('chronos:queue:send-weekly-digest-email');
// $FlowFixMe
import intersection from 'lodash.intersection';
import {
  SEND_WEEKLY_DIGEST_EMAIL,
  MIN_MESSAGE_COUNT,
  MAX_THREAD_COUNT_PER_CHANNEL,
  MIN_THREADS_REQUIRED_FOR_DIGEST,
} from './constants';
import { getActiveThreadsInPastWeek } from '../models/thread';
import { getUsersForWeeklyDigest } from '../models/usersSettings';
import { getUsersChannelsEligibleForWeeklyDigest } from '../models/usersChannels';
import { getMessageCount } from '../models/message';
import { getCommunityById } from '../models/community';

export default job => {
  debug(`\nnew job: ${job.id}`);
  debug(`\nprocessing weekly digest`);

  /*
      1. Get all threads in the database that were active in the last week. For each thread, construct a new object containing the thread data and the message count from the server
  */
  const allActiveThreadsThisWeek = async () => {
    // returns array of thread ids
    const threadIds = await getActiveThreadsInPastWeek();
    debug('\n ⚙️ Fetched all active threads this week');

    // if no threadIds, escape
    if (!threadIds || threadIds.length === 0) return;

    // for each thread that was active in the last week, return a new array containing a record for each thread with the thread data and the message count
    const messageCountPromises = threadIds.map(
      async ({ communityId, channelId, id, content, ...thread }) => ({
        communityId,
        channelId,
        id,
        title: content.title,
        messageCount: await getMessageCount(id),
      })
    );

    // promise all the active threads and message counts
    const messageCounts = await Promise.all(messageCountPromises);
    debug('\n ⚙️ Fetched message counts for threads');

    // remove any threads where the message count is less than 10
    const filteredTopThreads = messageCounts.filter(
      thread => thread.messageCount >= MIN_MESSAGE_COUNT
    );
    debug('\n ⚙️ Filtered threads with enough messages');

    // returns an array of threads that are active in the last week and have the minimum required message count to be considered valuable
    return filteredTopThreads;
  };

  /*
      2. Given an array of all the active threads this week that contain the minimum message count required, we now aggregate them by the channel where they were posted.

      The return value from this function is an object with keys representing channelIds and values representing an array of threads
  */
  const activeThreadsByChannel = async () => {
    // get all the active threads from this week
    const topThreads = await allActiveThreadsThisWeek();

    // if no topThreads, escape
    if (!topThreads || topThreads.length === 0) return;

    // create an empty object for the final output
    let obj = {};

    const getCommunity = id => getCommunityById(id);

    // for each thread, get the community data that we'll need when rendering an email
    const topThreadsWithCommunityDataPromises = topThreads.map(async thread => {
      const community = await getCommunity(thread.communityId);

      // this is the final data we'll send to the email for each thread
      const obj = {
        community: {
          name: community.name,
          slug: community.slug,
          profilePhoto: community.profilePhoto,
        },
        channelId: thread.channelId,
        title: thread.title,
        threadId: thread.id,
      };
      return obj;
    });

    const threadsWithCommunityData = await Promise.all(
      topThreadsWithCommunityDataPromises
    );
    // for each of the active threads this week, determine if that that thread has been categorized yet into the new object. If so, push that thread into the array, otherwise create a new key/value pair in the object for the channel + thread
    const finalThreads = threadsWithCommunityData.map(
      thread =>
        obj[thread.channelId]
          ? (obj[thread.channelId] = [...obj[thread.channelId], { ...thread }])
          : (obj[thread.channelId] = [{ ...thread }])
    );

    const finishedTopThreads = await Promise.all(finalThreads);
    debug('\n ⚙️ Organized top threads by channel');

    // return the final object containing keys for channelIds, and arrays of threads for values
    return obj;
  };

  /*
      3. In this step we process and aggregate user settings, users channels, and the thread data fetched above

      a. first, get all the userIds of people who have opted to receive a weekly digest
      b. for each person, get an array of channelIds where that user is a member
      c. determine if there is any overlap between the user's channels and the active threads from the past week. Note: this filters out people who are members of inactive communities, even if they are opted in to receive a weekly digest
  */
  const eligbleUsersForWeeklyDigest = async () => {
    // get users who have opted to receive a weekly digest
    const users = await getUsersForWeeklyDigest();
    debug('\n ⚙️ Fetched users who want to receive a weekly digest');

    // for each user who wants a weekly digest, fetch an array of channelIds where they are a member
    const channelConnectionPromises = users.map(
      async ({ email, firstName, userId, ...user }) => {
        return {
          email,
          name: firstName || null,
          userId,
          channels: await getUsersChannelsEligibleForWeeklyDigest(userId),
        };
      }
    );

    // fetch all usersChannels
    const usersWithChannels = await Promise.all(channelConnectionPromises);
    debug('\n ⚙️ Fetched users eligible channels');

    // get all the threads, organized by channel, in scope
    const threadData = await activeThreadsByChannel();

    // if no threads exist
    if (!threadData) return;

    // get an array of all channels where there are active threads this week
    const threadChannelKeys = Object.keys(threadData);

    // for each user, determine the overlapping channels where they are a member and where active threads occurred this week
    const getIntersectingChannels = usersWithChannels.map(e => {
      return {
        ...e,
        channels: intersection(e.channels, threadChannelKeys),
      };
    });
    debug(
      '\n ⚙️ Filtered intersecting channels between the user and the top threads this week'
    );

    // based on the intersecting channels, get the threads that could appear in the user's weekly digest
    const rawThreadsForUsersEmail = getIntersectingChannels.map(e => {
      let arr = [];
      e.channels.map(c => arr.push(...threadData[c]));
      return {
        ...e,
        threads: [...arr],
      };
    });
    debug(
      '\n ⚙️ Fetched all the possible threads this user could receive in a weekly digest'
    );

    // if no rawThreadsForUsersEmail, escape
    if (!rawThreadsForUsersEmail || rawThreadsForUsersEmail.length === 0)
      return;

    // we don't want to send a weekly digest to someone with only one thread for that week - so in this step we filter out any results where the thread count is less than the miminimum acceptable threshhold
    const eligibleUsersForWeeklyDigest = rawThreadsForUsersEmail
      .filter(user => user.threads.length > MIN_THREADS_REQUIRED_FOR_DIGEST)
      // and finally, sort the user's threads in descending order by message count
      .map(({ channels, ...user }) => ({
        ...user,
        threads: user.threads.sort((a, b) => b.messageCount - a.messageCount),
      }));

    debug(
      '\n ⚙️ Filtered users who have enough threads to qualify for a weekly digest'
    );

    /*
      The result of our operations so far has given us an array with the following shape:

      [
        {
          userId: ID,
          email: String,
          name?: String // returns null if user doesn't have a first name
          threads: [{ thread1 }, { thread2}, ... ]
        }
        ...
      ]

      Where a thread contains the following information:
      {
        communityId: ID,
        channelId: ID,
        id: ID,
        title: String,
        messageCount: Number
      }
    */
    return eligibleUsersForWeeklyDigest;
  };

  const processSendWeeklyDigests = async () => {
    const eligibleUsers = await eligbleUsersForWeeklyDigest();

    // if no elegible users, escape
    if (!eligibleUsers || eligibleUsers.length === 0) return;

    debug('\n👉 Eligible users data');
    debug(eligibleUsers);
    debug('\n👉 Example thread data for email');
    debug(eligibleUsers[0].threads[0]);

    const sendDigestPromises = eligibleUsers.map(
      async user =>
        await sendWeeklyDigestEmail(SEND_WEEKLY_DIGEST_EMAIL, { ...user })
    );

    const sendAllWeeklyDigests = await Promise.all(sendDigestPromises);
    return sendAllWeeklyDigests;
  };

  return processSendWeeklyDigests().catch(err =>
    console.log('Error sending weekly digests: ', err)
  );
};

// migration
// r.db('spectrum')
//   .table('usersSettings')
//   .filter({userId: '01p2A7kDCWUjGj6zQLlMQUOSQL42'})
//   .update({
//     notifications: {
//       types: {
//         newMessageInThreads: {
//          email: r.row('notifications')('types')('newMessageInThreads')(
//            'email'
//          ),
//         },
//         newThreadCreated: {
//          email: r.row('notifications')('types')('newThreadCreated')(
//            'email'
//          ),
//         },
//         newDirectMessage: {
//          email: r.row('notifications')('types')('newDirectMessage')(
//            'email'
//          ),
//         },
//         weeklyDigest: {
//          email: true
//         },
//       },
//     },
//   })
