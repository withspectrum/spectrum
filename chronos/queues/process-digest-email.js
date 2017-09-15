// @flow
const debug = require('debug')('chronos:queue:send-digest-email');
// $FlowFixMe
import intersection from 'lodash.intersection';
import createQueue from '../../shared/bull/create-queue';
import {
  SEND_DIGEST_EMAIL,
  MIN_TOTAL_MESSAGE_COUNT,
  MIN_NEW_MESSAGE_COUNT,
  MAX_THREAD_COUNT_PER_CHANNEL,
  MIN_THREADS_REQUIRED_FOR_DIGEST,
  MAX_THREAD_COUNT_PER_DIGEST,
  COMMUNITY_UPSELL_THRESHOLD,
  TOTAL_MESSAGE_COUNT_WEIGHT,
  NEW_MESSAGE_COUNT_WEIGHT,
} from './constants';
const sendDigestEmailQueue = createQueue(SEND_DIGEST_EMAIL);
import { getActiveThreadsInTimeframe } from '../models/thread';
import { getUsersForDigest } from '../models/usersSettings';
import { getUsersChannelsEligibleForWeeklyDigest } from '../models/usersChannels';
import { getUsersCommunityIds } from '../models/usersCommunities';
import { getTotalMessageCount, getNewMessageCount } from '../models/message';
import { getCommunityById, getTopCommunities } from '../models/community';
import { getChannelById } from '../models/channel';
import {
  getReputationChangeInTimeframe,
  getTotalReputation,
} from '../models/reputationEvent';

export default job => {
  const { timeframe } = job.data;
  debug(`\n\n\nnew job: ${job.id}`);
  debug(`\nprocessing ${timeframe} digest`);

  /*
      1. Get all threads in the database that were active in the last week. For each thread, construct a new object containing the thread data and the message count from the server
  */
  const allActiveThreadsInTimeframe = async () => {
    // returns array of thread ids
    const threadIds = await getActiveThreadsInTimeframe(timeframe);
    debug('\n ⚙️ Fetched all active threads this week');

    // if no threadIds, escape
    if (!threadIds || threadIds.length === 0) {
      debug('\n ❌  No active threads found');
      return;
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

    // promise all the active threads and message counts
    const messageCounts = await Promise.all(messageCountPromises);
    debug('\n ⚙️ Fetched message counts for threads');

    // remove any threads where the total message count is less than 10
    const filteredTopThreads = messageCounts
      .filter(thread => thread.totalMessageCount >= MIN_TOTAL_MESSAGE_COUNT)
      .filter(thread => thread.newMessageCount >= MIN_NEW_MESSAGE_COUNT);
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
    const topThreads = await allActiveThreadsInTimeframe();

    // if no topThreads, escape
    if (!topThreads || topThreads.length === 0) {
      debug('\n ❌  No topThreads found');
      return;
    }

    // create an empty object for the final output
    let obj = {};

    const getCommunity = id => getCommunityById(id);
    const getChannel = id => getChannelById(id);

    // for each thread, get the community data that we'll need when rendering an email
    const topThreadsWithCommunityDataPromises = topThreads.map(async thread => {
      const community = await getCommunity(thread.communityId);
      const channel = await getChannel(thread.channelId);

      // if the thread was created in the timeframe being evaluated, it's dumb to say: 10 messages (10 new!) - so here we're composing a string that will be passed to the email that determins what we should show for the message count. If all 10 messages are new, it will simply say '10 new!'
      const messageCountString =
        thread.newMessageCount === thread.totalMessageCount
          ? `<span class="newMessageCount">${thread.newMessageCount} new messages</span>`
          : `
            <span class="totalMessageCount">
              ${thread.totalMessageCount} mesages
            </span>
            <span class="newMessageCount">(${thread.newMessageCount} new)</span>
        `;

      // this is the final data we'll send to the email for each thread
      const obj = {
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

      a. first, get all the userIds of people who have opted to receive a digest
      b. for each person, get an array of channelIds where that user is a member
      c. determine if there is any overlap between the user's channels and the active threads from the past week. Note: this filters out people who are members of inactive communities, even if they are opted in to receive a digest
  */
  const eligibleUsersForDigest = async () => {
    // get users who have opted to receive a digest
    const users = await getUsersForDigest(timeframe);
    debug('\n ⚙️ Fetched users who want to receive a digest');

    // for each user who wants a digest, fetch an array of channelIds where they are a member
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
    if (!threadData) {
      debug('\n ❌  No threadData found');
      return;
    }

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

    // based on the intersecting channels, get the threads that could appear in the user's digest
    const rawThreadsForUsersEmail = getIntersectingChannels.map(e => {
      let arr = [];
      e.channels.map(c => arr.push(...threadData[c]));
      return {
        ...e,
        threads: [...arr],
      };
    });
    debug(
      '\n ⚙️ Fetched all the possible threads this user could receive in a digest'
    );

    // if no rawThreadsForUsersEmail, escape
    if (!rawThreadsForUsersEmail || rawThreadsForUsersEmail.length === 0) {
      debug('\n ❌  No rawThreads found');
      return;
    }

    // we don't want to send a digest to someone with only one thread for that week - so in this step we filter out any results where the thread count is less than the miminimum acceptable threshhold
    const eligibleUsersForDigest = rawThreadsForUsersEmail
      .filter(user => user.threads.length > MIN_THREADS_REQUIRED_FOR_DIGEST)
      // and finally, sort the user's threads in descending order by message count
      .map(({ channels, ...user }) => {
        // for each thread, assign a score based on the total message count and new message count
        const threadsWithScores = user.threads.map(thread => ({
          ...thread,
          score:
            thread.newMessageCount * NEW_MESSAGE_COUNT_WEIGHT +
            thread.totalMessageCount * TOTAL_MESSAGE_COUNT_WEIGHT,
        }));

        return {
          ...user,
          threads: threadsWithScores
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_THREAD_COUNT_PER_DIGEST),
        };
      });

    debug(
      '\n ⚙️ Filtered users who have enough threads to qualify for a digest'
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
    return eligibleUsersForDigest;
  };

  const processSendWeeklyDigests = async () => {
    const eligibleUsers = await eligibleUsersForDigest();
    debug('\n ⚙️  Got eligible users');
    const topCommunities = await getTopCommunities(20);
    debug('\n ⚙️  Got top communities');

    // if no elegible users, escape
    if (!eligibleUsers || eligibleUsers.length === 0) {
      debug('\n ❌  No eligible users');
      return;
    }

    // debug('\n👉 Eligible users data');
    // debug(eligibleUsers);
    // debug('\n👉 Example array of threads');
    // debug(eligibleUsers[0].threads);
    // debug('\n👉 Example thread data for email');
    // debug(eligibleUsers[0].threads[0]);

    const sendDigestPromises = topCommunities => {
      debug('\n ⚙️  Attaching community upsells if required...');

      return eligibleUsers.map(async user => {
        // also tell the person how much rep they gained during whatever timeframe is being evaluated
        const reputationGained = await getReputationChangeInTimeframe(
          user.userId,
          timeframe
        );
        // also show their total reputation to date
        const totalReputation = await getTotalReputation(user.userId);
        // see what communities the user is in. if they are a member of less than 3 communities, we will upsell communities to join in the digest
        const usersCommunityIds = await getUsersCommunityIds(user.userId);

        // if the user has joined less than three communities, take the top communities on Spectrum, remove any that the user has already joined, and slice the first 3 to send into the email template
        const communities =
          usersCommunityIds.length < COMMUNITY_UPSELL_THRESHOLD
            ? topCommunities
                .filter(
                  community => usersCommunityIds.indexOf(community.id) <= -1
                )
                .slice(0, 3)
            : null;

        const hasGainedReputation = reputationGained > 0;
        const isFirstReputation = totalReputation === reputationGained;
        const reputationString = hasGainedReputation
          ? // user gained some reputation during the last timeframe range
            isFirstReputation
            ? // if the total reputation and reputation gained are the same amount, this means the user has gained their first bit of rep!
              timeframe === 'weekly'
              ? // if this is a weekly digest
                `Since last week you've gained ${reputationGained} rep! Your rep will keep growing as you start and join more conversations.`
              : `Since yesterday you've gained ${reputationGained} rep - nice work!`
            : // if the total reputation is greater than the reputation gained, it means this is an incremental amount of rep for the user
              timeframe === 'weekly'
              ? `Since last week you've gained ${reputationGained} rep! You're now sitting strong at ${totalReputation} - keep it up.`
              : `Since yesterday you've gained ${reputationGained} rep - nice work! You now have ${totalReputation} total rep across all of your communities - well done!`
          : // has not gained any reputation
            `You've been a little quiet this week – this week try joining some conversations, your community wants to hear from you!`;

        return await sendDigestEmailQueue.add({
          ...user,
          communities,
          reputationString,
          timeframe,
        });
      });
    };

    return await Promise.all(sendDigestPromises(topCommunities)).then(() => {
      debug('\n ✅ ' + timeframe + ' digests processed and sent!');
      return;
    });
  };

  return processSendWeeklyDigests().catch(err => {
    debug('❌  Error sending digest');
    debug(err);
    console.log('Error sending digests: ', err);
  });
};
