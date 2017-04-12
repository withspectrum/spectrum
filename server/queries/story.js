/**
 * Story query resolvers
 */
const { getStory } = require('../models/story');
const { getFrequency } = require('../models/frequency');
const { getMessagesByStory } = require('../models/message');
const { getUser } = require('../models/user');

module.exports = {
  Query: {
    story: (_, { id }) => getStory(id),
  },
  Story: {
    frequency: ({ frequency }) => getFrequency(story.frequency),
    messages: ({ id }) => getMessagesByStory(id),
    edits: ({ edits }) => edits,
    author: ({ author }) => getUser(author),
  },
};
