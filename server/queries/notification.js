/**
 * Notification queries
 */

const {
  getNotification,
  getNotificationsByUser,
} = require('../models/notification');
const { getUser, getUsers } = require('../models/user');
const { getMessage } = require('../models/message');
const { getStory } = require('../models/story');
const { getFrequency } = require('../models/frequency');
const { getCommunity } = require('../models/community');

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
    story: ({ story }) => story && getStory(story),
    frequency: ({ frequency }) => frequency && getFrequency({ id: frequency }),
    community: ({ community }) => community && getCommunity({ id: community }),
    sender: ({ sender }) => sender && getUser(sender),
  },
};
