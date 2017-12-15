require('now-env');
const { toPlainText, toState } = require('../../shared/draft-utils');
const initIndex = require('../../shared/algolia');
const searchIndex = initIndex('threads_and_messages');
const stopword = require('stopword');
const Filter = require('bad-words');
const filter = new Filter({ placeHolder: ' ' });

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

const strToArray = str => {
  // turn the string into an array of words
  return (
    str
      .split(' ')
      // remove any space characters
      .filter(n => n.length > 0)
      // remove any newline characters
      .filter(n => n !== '\n')
  );
};

const withoutStopWords = str => {
  // turn the string into an array of words
  const arr = strToArray(str);
  // filter out any words that are considered stop words
  const cleaned = stopword.removeStopwords(arr);
  // join the array back into a string
  const joined = cleaned.join(' ');
  // return the string
  return joined;
};

const withoutSwearWords = str => filter.clean(str);

exports.up = function(r, conn) {
  return r
    .table('threads')
    .filter(thread => thread.hasFields('deletedAt').not())
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(threads =>
      threads.map(thread => {
        let title = thread.content.title;
        let body =
          thread.type === 'DRAFTJS'
            ? thread.content.body
              ? toPlainText(toState(JSON.parse(thread.content.body)))
              : ''
            : thread.content.body || '';

        // filter out stop words
        body = withoutStopWords(body);
        // filter out swear words
        body = withoutSwearWords(body);
        // filter out stop words
        title = withoutStopWords(title);
        // filter out swear words
        title = withoutSwearWords(title);

        // algolia only supports 20kb records
        // slice it down until its under 19k, leaving room for the rest of the thread data
        while (byteCount(body) >= 19000) {
          body = body.slice(0, -100);
        }

        return {
          channelId: thread.channelId,
          communityId: thread.communityId,
          creatorId: thread.creatorId,
          lastActive: new Date(thread.lastActive).getTime(),
          threadId: thread.id,
          messageContent: {
            body: '',
          },
          threadContent: {
            title,
            body,
          },
          objectID: thread.id,
          createdAt: new Date(thread.createdAt).getTime(),
        };
      })
    )
    .then(searchableThreads => searchIndex.addObjects(searchableThreads))
    .catch(err => console.log(err));
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.resolve();
};
