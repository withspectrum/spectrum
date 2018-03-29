const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;

exports.up = function(r, conn) {
  return (
    // The last migration fucked images up in production
    // so this one fixes them again 😅
    r
      .table('messages')
      .filter({ messageType: 'media' })
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
                  body: MARKDOWN_LINK.test(message.content.body)
                    ? message.content.body.replace(MARKDOWN_LINK, '$2')
                    : message.content.body,
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
