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

      const { users, message } = input;

      // get all the users direct messages and check for an existing thread
      // to ensure we're not creating a duplicate, in the event that the
      // client side composer broke
      return getDirectMessageGroupsByUser(user.uid)
        .then(groups => {
          return groups.filter(group => {
            const sortedInputUsers = users.sort().join('');
            const sortedGroupUsers = group.users.sort().join('');

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
            return groups[0];
          }
          if (!groups.length > 0) {
            return createDirectMessageGroup([...users, user.uid], user);
          }
        })
        .then(group => {
          // this is a duplicate, so we can just send the message
          const messageWithThread = {
            message: message,
            thread: group.id,
          };

          return Promise.all([group, storeMessage(messageWithThread, user)]);
        })
        .then(([group]) => group);
    },
  },
};
