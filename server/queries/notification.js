/**
 * Notification queries
 */

const { getNotification } = require('../models/notification');
const { getUser } = require('../models/user');
const { getMessage } = require('../models/message');
const { getStory } = require('../models/story');
const { getFrequency } = require('../models/frequency');
const { getCommunity } = require('../models/community');

module.exports = {
  Query: {
    notification: (_, { id }) => getNotification(id),
  },
  Notification: {
    user: ({ user }) => user && getUser(user),
    message: ({ message }) => message && getMessage(message),
    story: ({ story }) => story && getStory(story),
    frequency: ({ frequency }) => frequency && getFrequency(frequency),
    community: ({ community }) => community && getCommunity(community),
    sender: ({ sender }) => sender && getUser(sender),
  },
};
