const env = require('node-env-file');
const path = require('path');
const { toPlainText, toState } = require('../../shared/draft-utils');
env(path.resolve(__dirname, '../.env'), { raise: false });
const IS_PROD = process.env.NODE_ENV === 'production';
let ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
let ALGOLIA_API_SECRET = process.env.ALGOLIA_API_SECRET;
const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_SECRET);
const threadsSearchIndex = algolia.initIndex(
  IS_PROD ? 'threads_and_messages' : 'dev_threads_and_messages'
);

const byteCount = str => {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    let code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
  }
  return s;
};

exports.up = function(r, conn) {
  return r
    .table('threads')
    .filter(thread => thread.hasFields('deletedAt').not())
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(threads =>
      threads.map(thread => {
        let body =
          thread.type === 'DRAFTJS'
            ? thread.content.body
              ? toPlainText(toState(JSON.parse(thread.content.body)))
              : ''
            : thread.content.body || '';

        // algolia only supports 20kb records
        // slice it down until its under 19k, leaving room for the rest of the thread data
        while (byteCount(body) >= 19000) {
          body = body.slice(0, -100);
        }

        return {
          channelId: thread.channelId,
          communityId: thread.communityId,
          creatorId: thread.creatorId,
          lastActive: new Date(thread.lastActive).getTime() / 1000,
          threadId: thread.id,
          messageContent: {
            body: '',
          },
          threadContent: {
            title: thread.content.title,
            body,
          },
          objectID: thread.id,
          createdAt: new Date(thread.createdAt).getTime() / 1000,
        };
      })
    )
    .then(searchableThreads => {
      return threadsSearchIndex.addObjects(searchableThreads);
    })
    .catch(err => console.log(err));
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.resolve();
};
