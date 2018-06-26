// @flow
import directMessageThread from './rootDirectMessageThread';
import directMessageThreadByUserId from './rootDirectMessageThreadByUserId';
import messageConnection from './messageConnection';
import participants from './participants';
import snippet from './snippet';

module.exports = {
  Query: {
    directMessageThread,
    directMessageThreadByUserId,
  },
  DirectMessageThread: {
    messageConnection,
    participants,
    snippet,
  },
};
