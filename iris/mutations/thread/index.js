// @flow
import publishThread from './publishThread';
import editThread from './editThread';
import deleteThread from './deleteThread';
import setThreadLock from './setThreadLock';
import toggleThreadNotifications from './toggleThreadNotifications';
import moveThread from './moveThread';

module.exports = {
  Mutation: {
    publishThread,
    editThread,
    deleteThread,
    setThreadLock,
    toggleThreadNotifications,
    moveThread,
  },
};
