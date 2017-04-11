/**
 * Message mutation resolvers
 */
const {
  addStory,
  publishStory,
  deleteStory,
  setStoryLock,
  editStory,
} = require('../models/story');

module.exports = {
  Mutation: {
    addStory: (_, { story }) => addStory(story),
    publishStory: (_, { id }) => publishStory(id),
    editStory: (_, { id, newContent }) => editStory(id, newContent),
    deleteStory: (_, { id }) => deleteStory(id),
    setStoryLock: (_, { id, value }) => setStoryLock(id, value),
  },
};
