//@flow
// $FlowFixMe
const { UserError } = require('graphql-errors');
const {
  createDirectMessageThread,
  getDirectMessageThreadsByUser,
} = require('../models/directMessageThread');
import type { DirectMessageThreadProps } from '../models/directMessageThread';
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
          type: 'text' | 'media',
          content: string
        }
      */

      if (!input.participants)
        return new UserError('Nobody was selected to create a thread.');
      if (!input.message)
        return new UserError(
          'Be sure to add a message when creating a new thread!'
        );

      // if users and messages exist, continue
      const { participants, message } = input;

      // get all the currentUser's direct messages and check for an existing thread
      // to ensure we're not creating a duplicate, in the event that the
      // client side composer broke
      return getDirectMessageThreadsByUser(currentUser.id)
        .then(directMessageThreads => {
          // if no directMessageThreads exist, we can safely assume the person is creating
          // a new thread and continue down the promise chain
          if (directMessageThreads.length === 0 || !directMessageThreads) {
            return null;
          }

          // otherwise, filter all the user's direct message directMessageThreads
          return directMessageThreads.filter(directMessageThread => {
            // sort the users sent from the client
            const sortedInputParticipants = participants.sort().join('');
            // sort the users of the directMessageThread being evaluated
            const sortedThreadUsers = directMessageThread.users.sort().join('');

            // if there is a users match, we have found a duplicate! pass along
            // the directMessageThread that was matched, and downstream we will simply
            // post the message using that thread's id
            if (sortedInputParticipants === sortedThreadUsers) {
              return directMessageThread;
            } else {
              return null;
            }
          });
        })
        .then(directMessageThreads => {
          // a directMessageThread with this exact set of users already exists. we can
          // just send the message now using this directMessageThread id as the thread id
          if (directMessageThreads && directMessageThreads.length > 0) {
            // pass the first (and hopefully only) match down the promise chain
            return directMessageThreads[0];
          }

          // if no directMessageThreads were passed down from the previous promise, we know
          // we are creating a new direct message directMessageThread
          if (!directMessageThreads || directMessageThreads.length === 0) {
            // trigger the database function to create a new direct message
            // directMessageThread. takes users from the client + the current user in order
            // to populate the users list, and then we send the currentUser
            // as a second argument to set the creator id
            return createDirectMessageThread(
              [...participants, currentUser.id],
              currentUser.id
            );
          }
        })
        .then(directMessageThread => {
          // if the direct message thread couldn't be created
          if (!directMessageThread) {
            return new UserError(
              'We ran into trouble creating this thread - try again?'
            );
          }

          // we have now either found a duplicate directMessageThread or created a new direct
          // message thread. we can now compose a proper messages object
          // and store the message with our new thread id
          const messageWithThread = {
            message,
            threadId: directMessageThread.id,
          };

          // pass along the directMessageThread and newly created message down the promise
          // chain. we'll only end up returning the newly created directMessageThread, but
          // we wait until the message is stored before doing so
          return Promise.all([
            directMessageThread,
            storeMessage(messageWithThread, currentUser),
          ]);
        })
        .then(([directMessageTHread]) => directMessageTHread);
    },
  },
};
