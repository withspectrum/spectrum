// @flow
const debug = require('debug')('api:mutations:thread:publish-thread');
import stringSimilarity from 'string-similarity';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { uploadImage } from '../../utils/file-storage';
import processThreadContent from 'shared/draft-utils/process-thread-content';
import {
  publishThread,
  editThread,
  getThreadsByUserAsSpamCheck,
} from '../../models/thread';
import { createParticipantInThread } from '../../models/usersThreads';
import type { FileUpload, DBThread } from 'shared/types';
import { toPlainText, toState } from 'shared/draft-utils';
import { setCommunityLastActive } from '../../models/community';
import { setCommunityLastSeen } from '../../models/usersCommunities';
import {
  processReputationEventQueue,
  sendThreadNotificationQueue,
  _adminProcessToxicThreadQueue,
} from 'shared/bull/queues';
import getPerspectiveScore from 'athena/queues/moderationEvents/perspective';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

const threadBodyToPlainText = (body: any): string =>
  toPlainText(toState(JSON.parse(body)));

const MEMBER_SPAM_LMIT = 3;
const SPAM_TIMEFRAME = 60 * 10;

type File = FileUpload;

export type PublishThreadInput = {
  thread: {
    channelId: string,
    communityId: string,
    type: 'SLATE' | 'DRAFTJS' | 'TEXT',
    content: {
      title: string,
      body?: string,
    },
    filesToUpload?: ?Array<File>,
  },
};

export default requireAuth(
  async (_: any, args: PublishThreadInput, ctx: GraphQLContext) => {
    const { user, loaders } = ctx;
    const { thread } = args;

    let { type } = thread;

    if (type === 'SLATE') {
      return new UserError(
        "You're on an old version of Spectrum, please refresh your browser."
      );
    }

    if (thread.content.body) {
      thread.content.body = processThreadContent(type, thread.content.body);
    }

    thread.type = 'DRAFTJS';

    const [
      currentUserChannelPermissions,
      currentUserCommunityPermissions,
      channel,
      community,
      usersPreviousPublishedThreads,
    ] = await Promise.all([
      loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
      loaders.userPermissionsInCommunity.load([user.id, thread.communityId]),
      loaders.channel.load(thread.channelId),
      loaders.community.load(thread.communityId),
      getThreadsByUserAsSpamCheck(user.id, SPAM_TIMEFRAME),
    ]);

    if (!community || community.deletedAt) {
      return new UserError('This community doesn’t exist');
    }

    if (community.redirect) {
      return new UserError('This community is no longer on Spectrum.');
    }

    // if channel wasn't found or is deleted
    if (!channel || channel.deletedAt) {
      return new UserError("This channel doesn't exist");
    }

    if (channel.isArchived) {
      return new UserError('This channel has been archived');
    }

    // if user isn't a channel member
    if (
      !currentUserChannelPermissions.isMember ||
      currentUserChannelPermissions.isBlocked ||
      currentUserCommunityPermissions.isBlocked
    ) {
      return new UserError(
        "You don't have permission to create threads in this channel."
      );
    }

    const isOwnerOrModerator =
      currentUserChannelPermissions.isOwner ||
      currentUserChannelPermissions.isModerator ||
      currentUserCommunityPermissions.isOwner ||
      currentUserCommunityPermissions.isModerator;

    // if user has published other threads in the last hour, check for spam
    if (
      !isOwnerOrModerator &&
      usersPreviousPublishedThreads &&
      usersPreviousPublishedThreads.length > 0
    ) {
      debug(
        'User has posted at least once in the previous 10m - running spam checks'
      );

      if (usersPreviousPublishedThreads.length >= MEMBER_SPAM_LMIT) {
        debug('User has posted at least 3 times in the previous 10m');
        return new UserError(
          'You’ve been posting a lot! Please wait a few minutes before posting more.'
        );
      }

      const checkForSpam = usersPreviousPublishedThreads.map(t => {
        if (!t) return false;
        if (
          usersPreviousPublishedThreads.length === 1 &&
          usersPreviousPublishedThreads[0] &&
          usersPreviousPublishedThreads[0].deletedAt
        )
          return false;

        const incomingTitle = thread.content.title;
        const thisTitle = t.content.title;

        const titleSimilarity = stringSimilarity.compareTwoStrings(
          incomingTitle,
          thisTitle
        );
        debug(`Title similarity score for spam check: ${titleSimilarity}`);
        if (titleSimilarity > 0.8) return true;

        if (thread.content.body) {
          const incomingBody = threadBodyToPlainText(thread.content.body);
          const thisBody = threadBodyToPlainText(t.content.body);

          if (incomingBody.length === 0 || thisBody.length === 0) return false;

          const bodySimilarity = stringSimilarity.compareTwoStrings(
            incomingBody,
            thisBody
          );
          debug(`Body similarity score for spam check: ${bodySimilarity}`);
          if (bodySimilarity > 0.8) return true;
        }

        return false;
      });

      const isSpamming = checkForSpam.filter(Boolean).length > 0;

      if (isSpamming) {
        debug('User is spamming similar content');

        return new UserError(
          'It looks like you’ve been posting about a similar topic recently - please wait a while before posting more.'
        );
      }
    }

    let threadObject = Object.assign(
      {},
      {
        ...thread,
        content: {
          ...thread.content,
          title: thread.content.title.trim(),
        },
      }
    );

    // $FlowFixMe
    const dbThread: DBThread = await publishThread(threadObject, user.id);

    // we check for toxicity here only to determine whether or not to send
    // email notifications - the thread will be published regardless, but we can
    // prevent some abuse and spam if we ensure people dont get email notifications
    // with titles like "fuck you"
    const checkToxicity = async () => {
      const body = thread.content.body
        ? threadBodyToPlainText(thread.content.body)
        : '';
      const title = thread.content.title;
      const text = `${title} ${body}`;

      const scores = await getPerspectiveScore(text).catch(err =>
        console.error(
          'Error getting thread moderation scores from providers',
          err.message
        )
      );

      const perspectiveScore = scores && scores[1];

      // if neither models returned results
      if (!perspectiveScore) {
        debug('Toxicity checks from providers say not toxic');
        return false;
      }

      // if both services agree that the thread is >= 98% toxic
      if (perspectiveScore >= 0.9) {
        debug('Thread is toxic according to both providers');
        return true;
      }

      return false;
    };

    const threadIsToxic = await checkToxicity();
    if (!isOwnerOrModerator && threadIsToxic) {
      debug(
        'Thread determined to be toxic, not sending notifications or adding rep'
      );

      // generate an alert for admins
      _adminProcessToxicThreadQueue.add({ thread: dbThread });
      processReputationEventQueue.add({
        userId: user.id,
        type: 'thread created',
        entityId: dbThread.id,
      });
    } else {
      debug('Thread is not toxic, send notifications and add rep');
      // thread is clean, send notifications and process reputation
      sendThreadNotificationQueue.add({ thread: dbThread });
      processReputationEventQueue.add({
        userId: user.id,
        type: 'thread created',
        entityId: dbThread.id,
      });
    }

    // create a relationship between the thread and the author and set community lastActive
    const timestamp = new Date(dbThread.createdAt).getTime();
    await Promise.all([
      createParticipantInThread(dbThread.id, user.id),
      setCommunityLastActive(dbThread.communityId, new Date(timestamp)),
      // Make sure Community.lastSeen > Community.lastActive by one second
      // for the author
      setCommunityLastSeen(
        dbThread.communityId,
        user.id,
        new Date(timestamp + 1000)
      ),
    ]);

    if (!thread.filesToUpload || thread.filesToUpload.length === 0) {
      return dbThread;
    }

    let urls;
    try {
      // if the original mutation input contained files to upload
      urls = await Promise.all(
        // upload each of the files to s3
        thread.filesToUpload.map(
          file => file && uploadImage(file, 'threads', dbThread.id)
        )
      );
    } catch (err) {
      return new UserError(err.message);
    }

    // Replace the local image srcs with the remote image src
    const body = dbThread.content.body && JSON.parse(dbThread.content.body);
    if (!body) return dbThread;

    const imageKeys = Object.keys(body.entityMap).filter(
      key => body.entityMap[key].type.toLowerCase() === 'image'
    );
    urls.forEach((url, index) => {
      if (!body.entityMap[imageKeys[index]]) return;
      body.entityMap[imageKeys[index]].data.src = url;
    });

    // Update the thread with the new links
    return editThread(
      {
        threadId: dbThread.id,
        content: {
          ...dbThread.content,
          body: JSON.stringify(body),
        },
      },
      user.id,
      false
    );
  }
);
