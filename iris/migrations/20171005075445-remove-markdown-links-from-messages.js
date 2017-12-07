'use strict';
const replace = require('string-replace-to-array');
const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;

const removeMarkdownLinks = text => {
  if (!text || typeof text !== 'string') return text;
  return replace(text, MARKDOWN_LINK, (fullLink, text, url) => url).join('');
};

exports.up = function(r, conn) {
  return r
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
                body: removeMarkdownLinks(message.content.body),
              },
            })
            .run(conn)
        )
      )
    );
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
