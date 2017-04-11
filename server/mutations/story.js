/**
 * Message mutation resolvers
 */
const {
  addStory,
  publishStory,
  deleteStory,
  setStoryLock,
} = require('../models/story');

module.exports = {
  Mutation: {
    addStory: (_, { story }) => addStory(story),
    publishStory: (_, { id }) => publishStory(id),
    deleteStory: (_, { id }) => deleteStory(id),
    setStoryLock: (_, { id, value }) => setStoryLock(id, value),
  },
};
