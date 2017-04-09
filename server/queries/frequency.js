const { getFrequency, getAllFrequencies } = require('../models/frequency');
const { getStoryByFrequency } = require('../models/story');

module.exports = {
  Query: {
    frequency: getFrequency,
    frequencies: getAllFrequencies,
  },
  Frequency: {
    stories(frequency) {
      return getStoryByFrequency(frequency.id);
    },
  },
};
