// @flow
const { db } = require('./db');
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
import {
  dbThreadToSearchThread,
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
  listenToChangedFieldIn,
} from './utils';

export const newThread = () =>
  listenToNewDocumentsIn('threads', data => {
    const searchableThread = dbThreadToSearchThread(data);
    return threadsSearchIndex.saveObject(searchableThread, (err, obj) => {
      if (err) {
        console.log('error indexing a thread', err);
      }
      console.log('stored new thread in search', obj.objectID);
    });
  });

export const deletedThread = () =>
  listenToDeletedDocumentsIn('threads', data => {
    // something went wrong if it hits here and doesn't have a deleted field
    if (!data.deletedAt) return;
    return threadsSearchIndex.deleteObject(data.id, (err, obj) => {
      if (err) {
        console.log('error deleting a thread', err);
      }
      console.log('deleted thread in search', obj.objectID);
    });
  });

export const movedThread = () =>
  listenToChangedFieldIn('channelId')('threads', data => {
    return threadsSearchIndex.partialUpdateObject(
      {
        objectID: data.id,
        channelId: data.channelId,
      },
      (err, obj) => {
        if (err) {
          console.log('error moving channel for a thread', err);
        }
        console.log('changed thread channel id in search', obj.objectID);
      }
    );
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
          console.log('error saving edited thread', err);
        }
        console.log('changed edited thread content in search', obj.objectID);
      }
    );
  });
