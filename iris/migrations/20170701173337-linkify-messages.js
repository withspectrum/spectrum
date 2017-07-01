'use strict';
const markdownLinkify = require('../utils/markdown-linkify');

exports.up = function(r, conn) {
  return (
    // Markdown linkify each message
    r
      .table('messages')
      .withFields('id', 'content')
      .run(conn)
      .then(cursor => cursor.toArray())
      .then(messages =>
        Promise.all(
          messages.map(message =>
            r
              .table('messages')
              .get(message.id)
              .update({
                content: {
                  body: markdownLinkify(message.content.body),
                },
              })
              .run(conn)
          )
        )
      )
  );
};

exports.down = function(r, conn) {
  // Can't really undo just this change so we don't bother
  return Promise.resolve();
};
