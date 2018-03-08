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
import addCommunityMember from '../communityMember/addCommunityMember';

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

  if (!currentUser) {
    return new UserError('You must be signed in to send a message.');
  }

  if (message.messageType === 'media' && !message.file) {
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

  // construct the shape of the object to be stored in the db
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

  // handle DM thread messages up front
  if (message.threadType === 'directMessageThread') {
    setDirectMessageThreadLastActive(message.threadId);
    setUserLastSeenInDirectMessageThread(message.threadId, currentUser.id);
    return await storeMessage(messageForDb, currentUser.id);
  }

  // at this point we are only dealing with thread messages
  const thread = await loaders.thread.load(message.threadId);

  const permissions = await loaders.userPermissionsInCommunity.load([
    currentUser.id,
    thread.communityId,
  ]);

  const participantPromise = () =>
    thread.watercooler
      ? createParticipantWithoutNotificationsInThread(
          message.threadId,
          currentUser.id
        )
      : createParticipantInThread(message.threadId, currentUser.id);

  // if the user has never joined, or has previously joined but is not currently
  // a member (and is not blocked), join them to the community
  if (!permissions || (!permissions.isMember && !permissions.isBlocked)) {
    return await addCommunityMember(
      {},
      { input: { communityId: thread.communityId } },
      { user: currentUser, loaders: loaders }
    )
      .then(async () => await participantPromise())
      .then(async () => {
        const contextPermissions = {
          communityId: thread.communityId,
          reputation: 0,
          isModerator: false,
          isOwner: false,
        };

        const dbMessage = await storeMessage(messageForDb, currentUser.id);

        return {
          ...dbMessage,
          contextPermissions,
        };
      })
      .catch(err => {
        console.log('Error sending message to newly joined community', err);
        return new UserError(
          'Could not join this community. Please try again.'
        );
      });
  }

  // if the user is blocked, or they have no membership status, they can't post
  const hasNoRole =
    !permissions.isMember && !permissions.isModerator && !permissions.isOwner;
  if (permissions.isBlocked || hasNoRole) {
    return new UserError("You're not allowed to post in this community.");
  }

  // at this point the user is a member of the community and can post
  const contextPermissions = {
    communityId: thread.communityId,
    reputation: permissions.reputation || 0,
    isModerator: permissions.isModerator || false,
    isOwner: permissions.isOwner || false,
  };

  return await participantPromise().then(async () => {
    const dbMessage = await storeMessage(messageForDb, currentUser.id);

    return {
      ...dbMessage,
      contextPermissions,
    };
  });
};
