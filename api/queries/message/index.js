// @flow
import message from './rootMessage';
import getMediaMessagesForThread from './rootGetMediaMessagesForThread';
import sender from './sender';
import author from './author';
import thread from './thread';
import reactions from './reactions';
import parent from './parent';
import content from './content';
import attachments from './attachments';

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
    parent,
    content,
    attachments,
  },
};
