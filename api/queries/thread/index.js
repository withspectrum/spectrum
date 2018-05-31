// @flow
import thread from './rootThread';
import searchThreads from './rootSearchThreads';

import attachments from './attachments';
import channel from './channel';
import community from './community';
import participants from './participants';
import isAuthor from './isAuthor';
import isCreator from './isCreator'; // deprecated
import receiveNotifications from './receiveNotifications';
import messageConnection from './messageConnection';
import author from './author';
import creator from './creator';
import messageCount from './messageCount';
import currentUserLastSeen from './currentUserLastSeen';
import content from './content';

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
    isAuthor,
    isCreator, // deprcated
    receiveNotifications,
    messageConnection,
    author,
    creator, // deprecated
    messageCount,
    currentUserLastSeen,
    content,
  },
};
