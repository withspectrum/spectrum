// @flow
const {
  listenToUpdatedDirectMessageThreads,
} = require('../../models/directMessageThread');
const pubsub = require('./pubsub');
const channels = require('./channels');

const updatedDirectMessageThread = directMessageThread => {
  pubsub.publish(channels.DIRECT_MESSAGE_THREAD_UPDATED, directMessageThread);
};

module.exports = () => {
  listenToUpdatedDirectMessageThreads(updatedDirectMessageThread);
};
