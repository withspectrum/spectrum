// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  checkForExistingDMThread,
  getDirectMessageThread,
  createDirectMessageThread,
} from '../../models/directMessageThread';
import { uploadImage } from '../../utils/file-storage';
import { storeMessage } from '../../models/message';
import {
  setUserLastSeenInDirectMessageThread,
  createMemberInDirectMessageThread,
} from '../../models/usersDirectMessageThreads';
import type { FileUpload } from 'shared/types';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  input: {
    participants: Array<string>,
    message: {
      messageType: 'text' | 'media' | 'draftjs',
      threadType: string,
      content: {
        body: string,
      },
      file?: FileUpload,
    },
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { input } = args;

  if (!input.participants) {
    trackQueue.add({
      userId: user.id,
      event: events.DIRECT_MESSAGE_THREAD_CREATED_FAILED,
      properties: {
        reason: 'no users selected',
      },
    });

    return new UserError('Nobody was selected to create a thread.');
  }

  // if users and messages exist, continue
  const { participants, message } = input;

  // if the group being created has more than one participant, a group
  // thread is being created - this means that people can be added
  // and removed from the thread in the future. we *don't* want this
  // behavior for 1:1 threads to preserve privacy, so we store an `isGroup`
  // boolean on the dmThread object itself which will be used in other
  // mutations to add or remove members
  const isGroup = participants.length > 1;

  // collect all participant ids and the current user id into an array - we
  // use this to determine if an existing DM thread with this exact
  // set of participants already exists or not
  const allMemberIds = [...participants, user.id];

  // placeholder
  let threadId, threadToReturn;

  // check to see if a dm thread with this exact set of participants exists
  const existingThread = await checkForExistingDMThread(allMemberIds);

  if (existingThread) {
    threadId = existingThread;
    threadToReturn = await getDirectMessageThread(threadId);
  } else {
    threadToReturn = await createDirectMessageThread(isGroup);
    threadId = threadToReturn.id;
  }

  const handleStoreMessage = async message => {
    if (message.messageType === 'text' || message.messageType === 'draftjs') {
      // once we have an id we can generate a proper message object
      const messageWithThread = {
        ...message,
        threadId,
      };

      return await storeMessage(messageWithThread, user.id);
    } else if (message.messageType === 'media' && message.file) {
      let url;
      try {
        url = await uploadImage(message.file, 'threads', threadId);
      } catch (err) {
        trackQueue.add({
          userId: user.id,
          event: events.DIRECT_MESSAGE_THREAD_CREATED_FAILED,
          properties: {
            reason: 'image upload failed',
          },
        });
        return new UserError(err.message);
      }

      // build a new message object with a new file field with metadata
      const newMessage = Object.assign({}, message, {
        ...message,
        threadId: threadId,
        content: {
          body: url,
        },
        file: {
          name: message.file && message.file.filename,
          size: null,
          type: message.file && message.file.mimetype,
        },
      });

      return await storeMessage(newMessage, user.id);
    } else {
      trackQueue.add({
        userId: user.id,
        event: events.DIRECT_MESSAGE_THREAD_CREATED_FAILED,
        properties: {
          reason: 'unknown message type',
        },
      });
      return new UserError('Unknown message type on this bad boy.');
    }
  };

  if (existingThread) {
    return await Promise.all([
      setUserLastSeenInDirectMessageThread(threadId, user.id),
      handleStoreMessage(message),
    ]).then(() => threadToReturn);
  }

  trackQueue.add({
    userId: user.id,
    event: events.DIRECT_MESSAGE_THREAD_CREATED,
  });

  return await Promise.all([
    createMemberInDirectMessageThread(threadId, user.id, true),
    handleStoreMessage(message),
    participants.map(participant => {
      trackQueue.add({
        userId: participant,
        event: events.DIRECT_MESSAGE_THREAD_RECEIVED,
      });
      return createMemberInDirectMessageThread(threadId, participant, false);
    }),
  ]).then(() => threadToReturn);
});
