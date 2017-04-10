/**
 * Frequency query resolvers
 */
const { getFrequency, getAllFrequencies } = require('../models/frequency');
const { getStoryByFrequency } = require('../models/story');
const { getCommunity } = require('../models/community');

module.exports = {
  Query: {
    frequency: getFrequency,
    frequencies: getAllFrequencies,
  },
  Frequency: {
    stories(frequency) {
      return getStoryByFrequency(frequency.id);
    },
    community: ({ community }) => getCommunity(community),
  },
};
