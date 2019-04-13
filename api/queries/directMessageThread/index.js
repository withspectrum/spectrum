// @flow
import directMessageThread from './rootDirectMessageThread';
import directMessageThreadByUserIds from './rootDirectMessageThreadByUserIds';
import messageConnection from './messageConnection';
import participants from './participants';
import snippet from './snippet';

module.exports = {
  Query: {
    directMessageThread,
    directMessageThreadByUserIds,
  },
  DirectMessageThread: {
    messageConnection,
    participants,
    snippet,
  },
};
