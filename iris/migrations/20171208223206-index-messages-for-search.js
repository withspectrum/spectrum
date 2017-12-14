require('now-env');
const initIndex = require('shared/algolia');
const searchIndex = initIndex('threads_and_messages');
const { toPlainText, toState } = require('shared/draft-utils');

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
  return (
    r
      .table('messages')
      // dont index media messages or dm messages
      .filter(row =>
        row('messageType')
          .eq('text')
          .or(row('messageType').eq('draftjs'))
          .and(row('threadType').eq('story'))
      )
      .eqJoin('threadId', r.table('threads'))
      .without({
        left: ['threadType'],
        right: [
          'attachments',
          'edits',
          'watercooler',
          'content',
          'modifiedAt',
          'type',
          'id',
        ],
      })
      .zip()
      .run(conn)
      .then(cursor => cursor.toArray())
      .then(messages =>
        messages.map(message => {
          let body =
            message.messageType === 'draftjs'
              ? message.content.body
                ? toPlainText(toState(JSON.parse(message.content.body)))
                : ''
              : message.content.body || '';

          // algolia only supports 20kb records slice it down until its under 19k, leaving room for the rest of the message data. This will impact very few messages, and will only cut out the last few words
          while (byteCount(body) >= 19000) {
            body = body.slice(0, -100);
          }

          const searchableMessage = {
            channelId: message.channelId,
            communityId: message.communityId,
            creatorId: message.senderId,
            lastActive: new Date(message.lastActive).getTime(),
            threadId: message.threadId,
            messageContent: {
              body,
            },
            threadContent: {
              title: '',
              body: '',
            },
            objectID: message.id,
            createdAt: new Date(message.timestamp).getTime(),
          };

          const messageAsString = JSON.stringify(searchableMessage);
          if (byteCount(messageAsString) >= 19000) {
            // we have a few code messages that can't get turned into plain
            // text, and are pretty huge - if we encounter one of those, we return
            // here
            console.log('escaping a message');
            return;
          }
          return searchableMessage;
        })
      )
      .then(searchableMessages => {
        return searchIndex.addObjects(searchableMessages.filter(Boolean));
      })
      .catch(err => console.log(err))
  );
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.resolve();
};
