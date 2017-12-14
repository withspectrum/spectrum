// @flow
const debug = require('debug')('vulcan:thread');
const { db } = require('./db');
const { promisify } = require('util');
const env = require('node-env-file');
const path = require('path');
env(path.resolve(__dirname, '../.env'), { raise: false });
const IS_PROD = process.env.NODE_ENV === 'production';
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_SECRET = process.env.ALGOLIA_API_SECRET;
const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_SECRET);
const threadsSearchIndex = algolia.initIndex(
  IS_PROD ? 'threads_and_messages' : 'dev_threads_and_messages'
);
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
    return threadsSearchIndex.saveObject(searchableThread, (err, obj) => {
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
    return threadsSearchIndex.deleteObject(data.id, (err, obj) => {
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
        return threadsSearchIndex.browse(
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

    return threadsSearchIndex.partialUpdateObjects(allRecords, (err, obj) => {
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
    return threadsSearchIndex.partialUpdateObject(
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
