//@flow

/**
 * Story query resolvers
 */
const { getStory } = require('../models/story');
const { getFrequency } = require('../models/frequency');
const { getMessagesByLocationAndThread } = require('../models/message');
const { getUser } = require('../models/user');

module.exports = {
  Query: {
    story: (_, { id }) => getStory(id),
  },
  Story: {
    frequency: ({ frequency }) => getFrequency(story.frequency),
    messages: ({ location, id }) =>
      getMessagesByLocationAndThread(location, id),
    edits: ({ edits }) => edits,
    author: ({ author }) => getUser(author),
  },
};
