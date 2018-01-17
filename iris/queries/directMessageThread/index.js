// @flow
import directMessageThread from './rootDirectMessageThread';
import messageConnection from './messageConnection';
import participants from './participants';
import snippet from './snippet';

module.exports = {
  Query: {
    directMessageThread,
  },
  DirectMessageThread: {
    messageConnection,
    participants,
    snippet,
  },
};
