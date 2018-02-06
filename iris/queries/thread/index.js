// @flow
import thread from './rootThread';
import searchThreads from './rootSearchThreads';

import attachments from './attachments';
import channel from './channel';
import community from './community';
import participants from './participants';
import isCreator from './isCreator';
import receiveNotifications from './receiveNotifications';
import messageConnection from './messageConnection';
import author from './author';
import creator from './creator';
import messageCount from './messageCount';
import currentUserLastSeen from './currentUserLastSeen';

module.exports = {
  Query: {
    thread,
    searchThreads,
  },
  Thread: {
    attachments,
    channel,
    community,
    participants,
    isCreator,
    receiveNotifications,
    messageConnection,
    author,
    creator, // deprecated
    messageCount,
    currentUserLastSeen,
  },
};
