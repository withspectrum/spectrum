//@flow
// $FlowFixMe
import UserError from '../utils/UserError';
const {
  createDirectMessageThread,
  getDirectMessageThreadsByUser,
} = require('../models/directMessageThread');
const {
  createMemberInDirectMessageThread,
  setUserLastSeenInDirectMessageThread,
} = require('../models/usersDirectMessageThreads');
const { storeMessage } = require('../models/message');
const { uploadImage } = require('../utils/s3');

module.exports = {
  Mutation: {
    createDirectMessageThread: (_: any, { input }, { user }) => {
      const currentUser = user;

      if (!currentUser)
        return new UserError('You must be signed in to send a direct message.');

      /*
        input shape:

        participants: [ids],
        message: {
          messageType: 'text' | 'media',
          threadType: 'directMessageThread',
          content: {
            body: string
          }
        }
      */

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

      // create a direct message thread object in order to generate an id
      return createDirectMessageThread(isGroup)
        .then(thread => {
          if (message.messageType === 'text') {
            // once we have an id we can generate a proper message object
            const messageWithThread = {
              ...message,
              threadId: thread.id,
            };

            // when we have a thread id, we can create the thread owner
            // relationship with the current user and a member relationship
            // with each particpant
            return Promise.all([
              thread,
              // create member relationship with the current user
              // the third 'true' argument determines whether or not to set a 'lastActive' field date
              // since we know the user who is creating the dm thread is active right now, we set it as true
              createMemberInDirectMessageThread(
                thread.id,
                currentUser.id,
                true
              ),
              // create member relationships - the third argument is false because at this point the other people in the dm group are not active
              participants.map(participant =>
                createMemberInDirectMessageThread(thread.id, participant, false)
              ),
              // create message
              storeMessage(messageWithThread, currentUser.id),
            ]);
          } else if (message.messageType === 'media') {
            // if the first message in a dm group is a photo, we need to handle more operations before we can return:
            // 1. create the participants, upload the image, rebuild the message with the returned image url, and then return the final message
            return Promise.all([
              thread,
              // create member relationship with the current user
              createMemberInDirectMessageThread(
                thread.id,
                currentUser.id,
                true
              ),
              // create member relationships
              participants.map(participant =>
                createMemberInDirectMessageThread(thread.id, participant, false)
              ),
              uploadImage(
                message.file,
                'threads',
                message.threadId
              ).then(url => {
                // build a new message object with a new file field with metadata
                const newMessage = Object.assign({}, message, {
                  ...message,
                  threadId: thread.id,
                  content: {
                    body: url,
                  },
                  file: {
                    name: message.file.name,
                    size: message.file.size,
                    type: message.file.type,
                  },
                });

                return storeMessage(newMessage, currentUser.id);
              }),
            ]);
          } else {
            return new UserError('Unknown message type on this bad boy.');
          }
        })
        .then(thread => thread[0]);
    },
    setLastSeen: (_, { id }, { user }) =>
      setUserLastSeenInDirectMessageThread(id, user.id),
  },
};
