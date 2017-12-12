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
import { dbThreadToSearchThread, listenToNewDocumentsIn } from './utils';

export default () =>
  listenToNewDocumentsIn('threads', data => {
    const searchableThread = dbThreadToSearchThread(data);
    return threadsSearchIndex.saveObject(searchableThread, (err, obj) => {
      if (err) {
        console.log('error indexing a thread', err);
      }
      console.log('stored edited thread in search');
    });
  });
