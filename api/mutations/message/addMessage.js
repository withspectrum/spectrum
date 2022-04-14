// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { uploadImage } from '../../utils/file-storage';
import { storeMessage, getMessage } from '../../models/message';
import { setDirectMessageThreadLastActive } from '../../models/directMessageThread';
import { setUserLastSeenInDirectMessageThread } from '../../models/usersDirectMessageThreads';
import { createMemberInChannel } from '../../models/usersChannels';
import { createParticipantInThread } from '../../models/usersThreads';
import { setCommunityLastActive } from '../../models/community';
import { setCommunityLastSeen } from '../../models/usersCommunities';
import addCommunityMember from '../communityMember/addCommunityMember';
import { trackUserThreadLastSeenQueue } from 'shared/bull/queues';
import type { FileUpload } from 'shared/types';
import {
  isAuthedResolver as requireAuth,
  canViewDMThread,
} from '../../utils/permissions';
import { calculateThreadScoreQueue } from 'shared/bull/queues';
import { validateRawContentState } from '../../utils/validate-draft-js-input';
import processMessageContent, {
  messageTypeObj,
} from 'shared/draft-utils/process-message-content';
import type { MessageType } from 'shared/draft-utils/message-types';

type Input = {
  message: {
    threadId: string,
    threadType: 'story' | 'directMessageThread',
    messageType: MessageType,
    content: {
      body: string,
    },
    parentId?: string,
    file?: FileUpload,
    bot?: boolean,
  },
};

export const addMessage = async (
  message: $PropertyType<Input, 'message'>,
  userId: string
) => {
  if (message.messageType === messageTypeObj.text) {
    message.content.body = processMessageContent(
      messageTypeObj.text,
      message.content.body
    );
    message.messageType = messageTypeObj.draftjs;
  }

  if (message.messageType === messageTypeObj.draftjs) {
    let body;
    try {
      body = JSON.parse(message.content.body);
    } catch (err) {
      throw new UserError(
        'Please provide serialized raw DraftJS content state as content.body'
      );
    }
    if (!validateRawContentState(body)) {
      throw new UserError(
        'Please provide serialized raw DraftJS content state as content.body'
      );
    }
  }

  if (message.parentId) {
    const parent = await getMessage(message.parentId);
    if (parent.threadId !== message.threadId) {
      throw new UserError('You can only quote messages from the same thread.');
    }
  }

  // construct the shape of the object to be stored in the db
  let messageForDb = Object.assign({}, message);
  if (message.file && message.messageType === messageTypeObj.media) {
    const { file } = message;

    const fileMetaData = {
      name: file.filename,
      size: null,
      type: file.mimetype,
    };

    let url;
    try {
      url = await uploadImage(file, 'threads', message.threadId);
    } catch (err) {
      throw new UserError(err.message);
    }

    if (!url) {
      throw new UserError(
        "We weren't able to upload this image, please try again"
      );
    }

    messageForDb = Object.assign({}, messageForDb, {
      content: {
        body: url,
      },
      file: fileMetaData,
    });
  }

  return await storeMessage(messageForDb, userId);
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { message } = args;
  const { user, loaders } = ctx;

  /*
   * Permission checks
   */
  if (message.threadType === 'directMessageThread') {
    if (!(await canViewDMThread(user.id, message.threadId, loaders))) {
      return new UserError(
        'You don’t have permission to send a message in this conversation'
      );
    }
  }

  if (message.messageType === messageTypeObj.media && !message.file) {
    return new UserError(
      "Can't send media message without an image, please try again."
    );
  }

  if (message.messageType !== 'media' && message.file) {
    return new UserError(
      `To send an image, please use messageType: "media" instead of "${
        message.messageType
      }".`
    );
  }

  let thread,
    communityPermissions,
    channelPermissions,
    channel,
    isBlockedInCommunity,
    isBlockedInChannel;

  if (message.threadType === 'story') {
    thread = await loaders.thread.load(message.threadId);

    if (!thread || thread.deletedAt) {
      return new UserError("Can't reply in a deleted thread.");
    }

    if (thread.isLocked) {
      return new UserError("Can't reply in a locked thread.");
    }

    [communityPermissions, channelPermissions, channel] = await Promise.all([
      loaders.userPermissionsInCommunity.load([user.id, thread.communityId]),
      loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
      loaders.channel.load(thread.channelId),
    ]);

    if (!channel || channel.deletedAt) {
      return new UserError('This channel doesn’t exist');
    }

    if (channel.archivedAt) {
      return new UserError('This channel has been archived');
    }

    isBlockedInCommunity =
      communityPermissions && communityPermissions.isBlocked;
    isBlockedInChannel = channelPermissions && channelPermissions.isBlocked;

    // user can't post if blocked at any level
    if (isBlockedInCommunity || isBlockedInChannel) {
      return new UserError(
        "You don't have permission to post in this conversation"
      );
    }

    if (
      channel.isPrivate &&
      (!channelPermissions || !channelPermissions.isMember)
    ) {
      return new UserError(
        'You dont’t have permission to post in this conversation'
      );
    }
  }

  const dbMessage = await addMessage(message, user.id);

  // handle DM thread messages up front
  if (dbMessage.threadType === 'directMessageThread') {
    setDirectMessageThreadLastActive(message.threadId);
    setUserLastSeenInDirectMessageThread(message.threadId, user.id);
    return dbMessage;
  }

  // dummy async function that will run if the user is already a member of the
  // channel where the message is being sent
  let membershipPromise = async () => await {};

  // if the user is a member of the community, but is not a member of the channel,
  // make sure they join the channel first
  if (
    communityPermissions &&
    communityPermissions.isMember &&
    (!channelPermissions || !channelPermissions.isMember)
  ) {
    membershipPromise = async () =>
      await createMemberInChannel(thread.channelId, user.id);
  }

  // if the user is not a member of the community, or has previously joined
  // and left the community, re-join and sub to default channels
  if (
    !communityPermissions ||
    (communityPermissions && !communityPermissions.isMember)
  ) {
    membershipPromise = async () =>
      await addCommunityMember(
        {},
        { input: { communityId: thread.communityId } },
        ctx
      );
  }

  const timestamp = new Date(dbMessage.timestamp).getTime();
  return (
    membershipPromise()
      .then(() => createParticipantInThread(message.threadId, user.id))
      .then(() =>
        setCommunityLastActive(thread.communityId, new Date(timestamp))
      )
      // Make sure Community.lastSeen > Community.lastActive by one second
      // for the author
      .then(() =>
        setCommunityLastSeen(
          thread.communityId,
          user.id,
          new Date(timestamp + 10000)
        )
      )
      .then(async () => {
        const contextPermissions = {
          communityId: thread.communityId,
          reputation: communityPermissions
            ? communityPermissions.reputation
            : 0,
          isModerator: communityPermissions
            ? communityPermissions.isModerator
            : false,
          isOwner: communityPermissions ? communityPermissions.isOwner : false,
        };

        trackUserThreadLastSeenQueue.add({
          userId: user.id,
          threadId: message.threadId,
          timestamp,
        });

        calculateThreadScoreQueue.add(
          {
            threadId: message.threadId,
          },
          {
            jobId: message.threadId,
          }
        );
        return {
          ...dbMessage,
          contextPermissions,
        };
      })
      .catch(err => {
        console.error('Error sending message', err);
        return dbMessage;
      })
  );
});
