const { listenToNewStories } = require('../../models/story');
const pubsub = require('./pubsub');
const channels = require('./channels');

module.exports = () => {
  listenToNewStories(story => {
    pubsub.publish(channels.STORY_ADDED, story);
  });
};
