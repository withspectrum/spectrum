// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { uploadImage } from '../../utils/s3';
import { getThread } from '../../models/thread';
import { storeMessage } from '../../models/message';
import { setDirectMessageThreadLastActive } from '../../models/directMessageThread';
import { setUserLastSeenInDirectMessageThread } from '../../models/usersDirectMessageThreads';
import {
  createParticipantInThread,
  createParticipantWithoutNotificationsInThread,
} from '../../models/usersThreads';

type AddMessageInput = {
  message: {
    threadId: string,
    threadType: 'story' | 'directMessageThread',
    messageType: 'text' | 'media' | 'draftjs',
    content: {
      body: string,
    },
    file?: {
      name: string,
      type: string,
      size: number,
      path: string,
    },
  },
};

export default async (
  _: any,
  { message }: AddMessageInput,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;
  // user must be authed to send a message
  if (!currentUser)
    throw new UserError('You must be signed in to send a message.');
  if (message.messageType === 'media' && !message.file)
    throw new UserError(
      `Can't send media message without an image, please try again.`
    );
  if (message.messageType !== 'media' && message.file)
    throw new UserError(
      `To send an image, please use messageType: "media" instead of "${message.messageType}".`
    );

  const thread = await loaders.thread.load(message.threadId);

  let contextPermissions;
  // Make sure that we have permission to send a message in the community
  if (message.threadType === 'story') {
    const permissions = await loaders.userPermissionsInCommunity.load([
      currentUser.id,
      thread.communityId,
    ]);

    if (
      permissions.isBlocked ||
      (!permissions.isMember &&
        !permissions.isModerator &&
        !permissions.isOwner)
    ) {
      throw new UserError(`You're not allowed to post in this community.`);
    }

    contextPermissions = {
      communityId: thread.communityId,
      reputation: permissions ? permissions.reputation : 0,
      isModerator: permissions ? permissions.isModerator : false,
      isOwner: permissions ? permissions.isOwner : false,
    };
  }

  // if the message was a dm thread, set the last seen and last active times
  if (message.threadType === 'directMessageThread') {
    setDirectMessageThreadLastActive(message.threadId);
    setUserLastSeenInDirectMessageThread(message.threadId, currentUser.id);
  }

  // if the message was sent in a story thread, create a new participant
  // relationship to the thread - this will enable us to query against
  // thread.participants as well as have per-thread notifications for a user
  if (message.threadType === 'story' && (thread && !thread.watercooler)) {
    createParticipantInThread(message.threadId, currentUser.id);
  }

  if (thread && thread.watercooler) {
    createParticipantWithoutNotificationsInThread(
      message.threadId,
      currentUser.id
    );
  }

  let messageForDb = Object.assign({}, message);
  if (message.file && message.messageType === 'media') {
    const fileMetaData = {
      name: message.file.name,
      size: message.file.size,
      type: message.file.type,
    };
    const url = await uploadImage(message.file, 'threads', message.threadId);
    messageForDb = Object.assign({}, messageForDb, {
      content: {
        body: url,
      },
      file: fileMetaData,
    });
  }

  const dbMessage = await storeMessage(messageForDb, currentUser.id);

  if (dbMessage.threadType === 'directMessageThread') return dbMessage;

  return {
    ...dbMessage,
    contextPermissions,
  };
};
