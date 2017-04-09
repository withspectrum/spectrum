const { getAllStories } = require('../models/story');
const { getFrequency } = require('../models/frequency');

module.exports = {
  Query: {
    stories: getAllStories,
  },
  Story: {
    frequency(story) {
      return getFrequency(story.frequency);
    },
  },
};
