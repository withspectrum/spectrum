// @flow
import directMessageThread from './rootDirectMessageThread';
import directMessageThreadByUserId from './rootDirectMessageThreadByUserId';
import messageConnection from './messageConnection';
import participants from './participants';
import snippet from './snippet';
import isArchived from './isArchived';
import isMuted from './isMuted';

module.exports = {
  Query: {
    directMessageThread,
    directMessageThreadByUserId,
  },
  DirectMessageThread: {
    messageConnection,
    participants,
    snippet,
    isArchived,
    isMuted,
  },
};
