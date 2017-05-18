//@flow
// $FlowFixMe
const { UserError } = require('graphql-errors');
const {
  createDirectMessageGroup,
  getDirectMessageGroupsByUser,
} = require('../models/directMessageGroup');
import type { DirectMessageGroupProps } from '../models/directMessageGroup';
const { storeMessage } = require('../models/message');

module.exports = {
  Mutation: {
    createDirectMessageGroup: (_: any, { input }, { user }) => {
      if (!user)
        return new UserError('You must be signed in to send a direct message.');

      /*
        input shape:

        users: [uids],
        message: {
          type: 'text' | 'media',
          content: string
        }
      */

      if (!input.users)
        return new UserError('Nobody was selected to create a thread.');
      if (!input.message)
        return new UserError(
          'Be sure to add a message when creating a new thread!'
        );

      // if users and messages exist, continue
      const { users, message } = input;
      const currentUser = user;

      // get all the currentUser's direct messages and check for an existing thread
      // to ensure we're not creating a duplicate, in the event that the
      // client side composer broke
      return getDirectMessageGroupsByUser(currentUser.uid)
        .then(groups => {
          // if no groups exist, we can safely assume the person is creating
          // a new thread and continue down the promise chain
          if (groups.length === 0 || !groups) {
            return null;
          }

          // otherwise, filter all the user's direct message groups
          return groups.filter(group => {
            // sort the users sent from the client
            const sortedInputUsers = users.sort().join('');
            // sort the users of the group being evaluated
            const sortedGroupUsers = group.users.sort().join('');

            // if there is a users match, we have found a duplicate! pass along
            // the group that was matched, and downstream we will simply
            // post the message using that thread's id
            if (sortedInputUsers === sortedGroupUsers) {
              return group;
            } else {
              return null;
            }
          });
        })
        .then(groups => {
          // a group with this exact set of users already exists. we can
          // just send the message now using this group id as the thread id
          if (groups.length > 0) {
            // pass the first (and hopefully only) match down the promise chain
            return groups[0];
          }

          // if no groups were passed down from the previous promise, we know
          // we are creating a new direct message group
          if (groups.length === 0) {
            // trigger the database function to create a new direct message
            // group. takes users from the client + the current user in order
            // to populate the users list, and then we send the currentUser
            // as a second argument to set the creator id
            return createDirectMessageGroup(
              [...users, currentUser.uid],
              currentUser
            );
          }
        })
        .then(group => {
          // we have now either found a duplicate group or created a new direct
          // message thread. we can now compose a proper messages object
          // and store the message with our new thread id
          const messageWithThread = {
            message,
            thread: group.id,
          };

          // pass along the group and newly created message down the promise
          // chain. we'll only end up returning the newly created group, but
          // we wait until the message is stored before doing so
          return Promise.all([group, storeMessage(messageWithThread, user)]);
        })
        .then(([group]) => group);
    },
  },
};
