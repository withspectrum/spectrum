// @flow
import message from './rootMessage';
import getMediaMessagesForThread from './rootGetMediaMessagesForThread';
import sender from './sender';
import thread from './thread';
import reactions from './reactions';

module.exports = {
  Query: {
    message,
    getMediaMessagesForThread,
  },
  Message: {
    sender,
    thread,
    reactions,
  },
};
