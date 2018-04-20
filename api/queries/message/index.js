// @flow
import message from './rootMessage';
import getMediaMessagesForThread from './rootGetMediaMessagesForThread';
import sender from './sender';
import author from './author';
import thread from './thread';
import reactions from './reactions';
import quotedMessage from './quotedMessage';

module.exports = {
  Query: {
    message,
    getMediaMessagesForThread,
  },
  Message: {
    author,
    sender, // deprecated
    thread,
    reactions,
    quotedMessage,
  },
};
