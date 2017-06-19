const { listenToNewThreads } = require('../../models/thread');
const pubsub = require('./pubsub');
const channels = require('./channels');

module.exports = () => {
  listenToNewThreads(thread => {
    pubsub.publish(channels.THREAD_ADDED, thread);
  });
};
