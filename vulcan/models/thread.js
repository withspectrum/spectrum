// @flow
const debug = require('debug')('vulcan:thread');
import { db } from './db';
import initIndex from 'shared/algolia';
import Raven from 'shared/raven';
const searchIndex = initIndex('threads_and_messages');
import type { DBThread } from 'shared/types';
import { dbThreadToSearchThread } from './utils';
import {
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
  listenToChangedFieldIn,
} from 'shared/changefeed-utils';

export const getThreadById = (threadId: string): Promise<DBThread> => {
  return db
    .table('threads')
    .get(threadId)
    .run();
};

export const newThread = () =>
  listenToNewDocumentsIn(db, 'threads', data => {
    const searchableThread = dbThreadToSearchThread(data);
    return searchIndex
      .saveObject(searchableThread)
      .then(() => {
        debug('indexed new thread in search');
        return;
      })
      .catch(err => {
        debug('error indexing a thread');
        console.log(err);
        Raven.captureException(err);
      });
  });

export const deletedThread = () =>
  listenToDeletedDocumentsIn(db, 'threads', data => {
    return searchIndex
      .deleteObject(data.id)
      .then(() => {
        debug('deleted thread in search');
        return;
      })
      .catch(err => {
        debug('error deleting a thread');
        console.log(err);
        Raven.captureException(err);
      });
  });

export const movedThread = () =>
  listenToChangedFieldIn(db, 'channelId')('threads', async data => {
    const getAllRecordsForThreadId = data => {
      return new Promise((resolve, reject) => {
        // eslint-disable-line
        return searchIndex
          .browse({
            query: '',
            filters: `threadId:'${data.id}'`,
          })
          .then(content => {
            resolve(content.hits);
            return content.hits;
          })
          .catch(err => {
            debug("couldn't find any results for this thread id");
            console.log(err);
            Raven.captureException(err);
            reject(err);
          });
      });
    };

    const [hits] = await Promise.all([getAllRecordsForThreadId(data)]);

    if (!hits || hits.length === 0) {
      debug('could not find any matching results for this thread');
      return;
    }

    const allRecords = hits.map(r => ({
      channelId: data.channelId,
      objectID: r.objectID,
    }));

    return searchIndex
      .partialUpdateObjects(allRecords)
      .then(() => {
        debug('changed thread channel in search');
        return;
      })
      .catch(err => {
        debug('error changing thread channel');
        console.log(err);
        Raven.captureException(err);
      });
  });

export const editedThread = () =>
  listenToChangedFieldIn(db, 'modifiedAt')('threads', data => {
    const searchableThread = dbThreadToSearchThread(data);
    return searchIndex
      .partialUpdateObject({
        objectID: data.id,
        ...searchableThread,
      })
      .then(() => {
        debug('edited thread in search');
        return;
      })
      .catch(err => {
        debug('error editing a thread');
        console.log(err);
        Raven.captureException(err);
      });
  });
