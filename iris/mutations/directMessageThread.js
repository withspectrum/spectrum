// @flow
import UserError from '../utils/UserError';
const {
  createDirectMessageThread,
  checkForExistingDMThread,
  getDirectMessageThread,
} = require('../models/directMessageThread');
const {
  createMemberInDirectMessageThread,
  setUserLastSeenInDirectMessageThread,
} = require('../models/usersDirectMessageThreads');
const { storeMessage } = require('../models/message');
const { uploadImage } = require('../utils/s3');
import type { GraphQLContext } from '../';

type DMThreadInput = {
  participants: Array<string>,
  message: {
    messageType: 'text' | 'media',
    threadType: 'directMessageThread',
    content: {
      body: string,
    },
    file: any,
  },
};

module.exports = {
  Mutation: {
    createDirectMessageThread: async (
      _: any,
      { input }: { input: DMThreadInput },
      { user }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser)
        return new UserError('You must be signed in to send a direct message.');

      if (!input.participants)
        return new UserError('Nobody was selected to create a thread.');

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
      const allMemberIds = [...participants, currentUser.id];

      // placeholder
      let threadId, threadToReturn;

      // check to see if a dm thread with this exact set of participants exists
      const existingThreads = await checkForExistingDMThread(allMemberIds);

      // if so, we will be evaulating the first result (should only ever be one)
      if (existingThreads && existingThreads.length > 0) {
        threadId = existingThreads[0].group;
        threadToReturn = await getDirectMessageThread(threadId);
      } else {
        threadToReturn = await createDirectMessageThread(isGroup);
        threadId = threadToReturn.id;
      }

      const handleStoreMessage = async message => {
        if (
          message.messageType === 'text' ||
          message.messageType === 'draftjs'
        ) {
          // once we have an id we can generate a proper message object
          const messageWithThread = {
            ...message,
            threadId,
          };

          return await storeMessage(messageWithThread, currentUser.id);
        } else if (message.messageType === 'media') {
          const url = await uploadImage(message.file, 'threads', threadId);

          // build a new message object with a new file field with metadata
          const newMessage = Object.assign({}, message, {
            ...message,
            threadId: threadId,
            content: {
              body: url,
            },
            file: {
              name: message.file.name,
              size: message.file.size,
              type: message.file.type,
            },
          });

          return await storeMessage(newMessage, currentUser.id);
        } else {
          return new UserError('Unknown message type on this bad boy.');
        }
      };

      if (existingThreads.length > 0) {
        return await Promise.all([
          handleStoreMessage(message),
          setUserLastSeenInDirectMessageThread(threadId, currentUser.id),
        ]).then(() => threadToReturn);
      }

      return await Promise.all([
        handleStoreMessage(message),
        createMemberInDirectMessageThread(threadId, currentUser.id, true),
        participants.map(participant =>
          createMemberInDirectMessageThread(threadId, participant, false)
        ),
      ]).then(() => threadToReturn);
    },
    setLastSeen: (_: any, { id }: { id: string }, { user }: GraphQLContext) =>
      setUserLastSeenInDirectMessageThread(id, user.id),
  },
};
