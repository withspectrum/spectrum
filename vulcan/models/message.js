// @flow
const debug = require('debug')('vulcan:message');
import initIndex from './algolia';
import {
  dbMessageToSearchThread,
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
} from './utils';

const threadsSearchIndex = initIndex('messages');

export const newMessage = () =>
  listenToNewDocumentsIn('messages', async data => {
    const searchableMessage = await dbMessageToSearchThread(data);
    if (!searchableMessage) {
      debug('no searchable message created, exiting');
      return;
    }

    return threadsSearchIndex.saveObject(searchableMessage, (err, obj) => {
      if (err) {
        debug('error indexing a thread');
        console.log(err);
      }
      debug('stored new thread in search');
    });
  });

export const deletedMessage = () =>
  listenToDeletedDocumentsIn('messages', data => {
    // something went wrong if it hits here and doesn't have a deleted field
    if (!data.deletedAt) return;
    return threadsSearchIndex.deleteObject(data.id, (err, obj) => {
      if (err) {
        debug('error deleting a message');
        console.log(err);
      }
      debug('deleted message in search');
    });
  });
