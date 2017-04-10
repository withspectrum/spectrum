/**
 * Story query resolvers
 */
const { getAllStories } = require('../models/story');
const { getFrequency } = require('../models/frequency');
const { getMessagesByStory } = require('../models/message');

module.exports = {
  Query: {
    stories: getAllStories,
  },
  Story: {
    frequency(story) {
      return getFrequency(story.frequency);
    },
    messages: story => getMessagesByStory(story.id),
  },
};
