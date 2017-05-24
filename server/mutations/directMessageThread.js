//@flow
// $FlowFixMe
const { UserError } = require('graphql-errors');
const {
  createDirectMessageThread,
  getDirectMessageThreadsByUser,
} = require('../models/directMessageThread');
const {
  createOwnerInDirectMessageThread,
  createMemberInDirectMessageThread,
} = require('../models/usersDirectMessageThreads');
const { storeMessage } = require('../models/message');

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

      if (
        !input.message || !input.message.content || !input.message.content.body
      )
        return new UserError(
          'Be sure to add a message when creating a new thread!'
        );

      // if users and messages exist, continue
      const { participants, message } = input;
      console.log('participants', participants);

      // create a direct message thread object in order to generate an id
      return createDirectMessageThread()
        .then(thread => {
          // once we have an ide we can generate a proper message object
          const messageWithThread = {
            ...message,
            threadId: thread.id,
          };

          // when we have a thread id, we can create the thread owner
          // relationship with the current user and a member relationship
          // with each particpant
          return Promise.all([
            thread,
            // create owner relationship
            createOwnerInDirectMessageThread(thread.id, currentUser.id),
            // create member relationships
            participants.map(participant =>
              createMemberInDirectMessageThread(thread.id, participant)
            ),
            // create message
            storeMessage(messageWithThread, currentUser),
          ]);
        })
        .then(thread => thread[0]);
    },
  },
};
