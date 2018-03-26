// @flow
const debug = require('debug')('vulcan:message');
import initIndex from 'shared/algolia';
import Raven from 'shared/raven';
const searchIndex = initIndex('threads_and_messages');
import { dbMessageToSearchThread } from './utils';
import { db } from './db';
import {
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
} from 'shared/changefeed-utils';

export const newMessage = () =>
  listenToNewDocumentsIn(db, 'messages', async data => {
    const searchableMessage = await dbMessageToSearchThread(data);
    if (!searchableMessage) {
      debug('no searchable message created, exiting');
      return;
    }

    return searchIndex
      .saveObject(searchableMessage)
      .then(() => {
        debug('indexed new message in search');
        return;
      })
      .catch(err => {
        debug('error indexing a message');
        console.log(err);
        Raven.captureException(err);
      });
  });

export const deletedMessage = () =>
  listenToDeletedDocumentsIn(db, 'messages', data => {
    return searchIndex
      .deleteObject(data.id)
      .then(() => {
        debug('deleted message in search');
        return;
      })
      .catch(err => {
        debug('error deleting a message');
        console.log(err);
        Raven.captureException(err);
      });
  });
