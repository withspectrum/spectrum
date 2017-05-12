/**
 * Notification queries
 */

const { getNotificationsByUser } = require('../models/notification');
const { getMessage } = require('../models/message');
const { getFrequency } = require('../models/frequency');
import type { GraphQLContext } from '../';

module.exports = {
  Query: {
    notification: (_, { id }, { loaders }: GraphQLContext) =>
      loaders.notification.load(id),
    notifications: (
      _,
      { first = 10, after }: PaginationOptions,
      { user: { uid } }
    ) => getNotificationsByUser(uid, { first, after }),
  },
  Notification: {
    isMine: ({ users }, _, { user }) =>
      user && !!users.find(({ uid }) => uid === user.uid),
    read: ({ users }, _, { user }) => {
      if (!user) return null;
      const result = users.find(({ uid }) => uid === user.uid);
      if (!result) return null;
      return result.read;
    },
    message: ({ message }) => message && getMessage('messages', message),
    story: ({ story }, _: any, { loaders }: GraphQLContext) =>
      story && loaders.story.load(story),
    frequency: ({ frequency }, _: any, { loaders }: GraphQLContext) =>
      frequency && loaders.frequency.load(frequency),
    community: ({ community }, _: any, { loaders }: GraphQLContext) =>
      community && loaders.community.load(community),
    sender: ({ sender }, _, { loaders }) => sender && loaders.user.load(sender),
  },
};
