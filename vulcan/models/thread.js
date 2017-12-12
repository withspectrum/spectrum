// @flow
const { db } = require('./db');
const env = require('node-env-file');
const path = require('path');
env(path.resolve(__dirname, '../.env'), { raise: false });
const IS_PROD = process.env.NODE_ENV === 'production';
let ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
let ALGOLIA_API_SECRET = process.env.ALGOLIA_API_SECRET;
const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_SECRET);
const threadsSearchIndex = algolia.initIndex(
  IS_PROD ? 'threads' : 'dev_threads_and_messages'
);

// let body =
// thread.type === 'DRAFTJS'
//   ? thread.content.body
//     ? toPlainText(toState(JSON.parse(thread.content.body)))
//     : ''
//   : thread.content.body || '';

// const searchableThread = {
// ...thread,
// content: {
//   ...thread.content,
//   body,
// },
// createdAt: new Date(thread.createdAt).getTime() / 1000,
// modifiedAt: new Date(thread.modifiedAt).getTime() / 1000,
// lastActive: new Date(thread.lastActive).getTime() / 1000,
// objectID: thread.id,
// };

// threadsSearchIndex.saveObject(searchableThread, (err, obj) => {
// if (err) {
//   console.log('error indexing a thread', err);
// }
// console.log('stored edited thread in search');
// });

// threadsSearchIndex.deleteObject(thread.id, (err, obj) => {
//   if (err) {
//     console.log('error deleting a thread', err);
//   }
//   console.log('deleted thread in search', obj);
// });
