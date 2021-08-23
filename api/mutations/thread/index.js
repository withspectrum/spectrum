// @flow
import publishThread from './publishThread';
import editThread from './editThread';
import deleteThread from './deleteThread';
import setThreadLock from './setThreadLock';
import moveThread from './moveThread';
import addThreadReaction from './addThreadReaction';
import removeThreadReaction from './removeThreadReaction';

module.exports = {
  Mutation: {
    publishThread,
    editThread,
    deleteThread,
    setThreadLock,
    moveThread,
    addThreadReaction,
    removeThreadReaction,
  },
};
