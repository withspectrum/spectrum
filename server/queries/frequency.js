/**
 * Frequency query resolvers
 */
const { getFrequency } = require('../models/frequency');
const { getStoryByFrequency } = require('../models/story');
const { getCommunity } = require('../models/community');
const { getUsers } = require('../models/user');

module.exports = {
  Query: {
    frequency: (_, { id }) => getFrequency(id),
  },
  Frequency: {
    stories(frequency) {
      return getStoryByFrequency(frequency.id);
    },
    community: ({ community }) => getCommunity(community),
    subscribers: ({ subscribers }) => getUsers(subscribers),
  },
};
