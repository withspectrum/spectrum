/**
 * Story query resolvers
 */
const { getStory } = require('../models/story');
const { getFrequency } = require('../models/frequency');
const { getMessagesByStory } = require('../models/message');

module.exports = {
  Query: {
    story: (_, { id }) => getStory(id),
  },
  Story: {
    frequency(story) {
      return getFrequency(story.frequency);
    },
    messages: story => getMessagesByStory(story.id),
    edits: story => story.edits,
  },
};
