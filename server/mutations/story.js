/**
 * Message mutation resolvers
 */
const {
  publishStory,
  deleteStory,
  setStoryLock,
  editStory,
} = require('../models/story');

module.exports = {
  Mutation: {
    publishStory: (_, { story }, { user }) => publishStory(story, user),
    editStory: (_, { id, newContent }) => editStory(id, newContent),
    deleteStory: (_, { id }) => deleteStory(id),
    setStoryLock: (_, { id, value }) => setStoryLock(id, value),
  },
};
