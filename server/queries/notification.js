/**
 * Notification queries
 */

const {
  getNotification,
  getNotificationsByUser,
} = require('../models/notification');
const { getMessage } = require('../models/message');
const { getFrequency } = require('../models/frequency');
const { getCommunity } = require('../models/community');
import type { GraphQLContext } from '../';

module.exports = {
  Query: {
    notification: (_, { id }) => getNotification(id),
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
    frequency: ({ frequency }) => frequency && getFrequency({ id: frequency }),
    community: ({ community }) => community && getCommunity({ id: community }),
    sender: ({ sender }, _, { loaders }) => sender && loaders.user.load(sender),
  },
};
