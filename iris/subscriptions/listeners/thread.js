// @flow
const { listenToUpdatedThreads } = require('../../models/thread');
const pubsub = require('./pubsub');
const channels = require('./channels');

const updatedThread = thread => {
  pubsub.publish(channels.THREAD_UPDATED, thread);
};

module.exports = () => {
  listenToUpdatedThreads(updatedThread);
};
