// @flow
const debug = require('debug')('vulcan:thread');
import { db } from './db';
import initIndex from './algolia';
const searchIndex = initIndex('threads_and_messages');
import type { DBThread } from 'shared/types';
import {
  dbThreadToSearchThread,
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
  listenToChangedFieldIn,
} from './utils';

export const getThreadById = (threadId: string): Promise<DBThread> => {
  return db
    .table('threads')
    .get(threadId)
    .run();
};

export const newThread = () =>
  listenToNewDocumentsIn('threads', data => {
    const searchableThread = dbThreadToSearchThread(data);
    return searchIndex.saveObject(searchableThread, (err, obj) => {
      if (err) {
        debug('error indexing a thread');
        console.log(err);
      }
      debug('stored new thread in search');
    });
  });

export const deletedThread = () =>
  listenToDeletedDocumentsIn('threads', data => {
    // something went wrong if it hits here and doesn't have a deleted field
    if (!data.deletedAt) return;
    return searchIndex.deleteObject(data.id, (err, obj) => {
      if (err) {
        debug('error deleting a thread');
        console.log(err);
      }
      debug('deleted thread in search');
    });
  });

export const movedThread = () =>
  listenToChangedFieldIn('channelId')('threads', async data => {
    const getAllRecordsForThreadId = data => {
      return new Promise((resolve, reject) => {
        return searchIndex.browse(
          {
            query: '',
            filters: `threadId:'${data.id}'`,
          },
          (err, content) => {
            if (err) {
              debug("couldn't find any results for this thread id");
              console.log(err);
              reject(err);
            }
            console.log('got hits');
            resolve(content.hits);
            return content.hits;
          }
        );
      });
    };

    const [hits] = await Promise.all([getAllRecordsForThreadId(data)]);

    if (!hits || hits.length === 0) return;

    const allRecords = hits.map(r => ({
      channelId: data.channelId,
      objectID: r.objectID,
    }));

    return searchIndex.partialUpdateObjects(allRecords, (err, obj) => {
      if (err) {
        debug('error moving channels for a thread');
        console.log(err);
      }
      debug('changed thread channels id in search');
    });
  });

export const editedThread = () =>
  listenToChangedFieldIn('modifiedAt')('threads', data => {
    const searchableThread = dbThreadToSearchThread(data);
    return searchIndex.partialUpdateObject(
      {
        objectID: data.id,
        threadContent: {
          ...searchableThread.threadContent,
        },
      },
      (err, obj) => {
        if (err) {
          debug('error saving edited thread');
          console.log(err);
        }
        debug('changed edited thread content in search');
      }
    );
  });
