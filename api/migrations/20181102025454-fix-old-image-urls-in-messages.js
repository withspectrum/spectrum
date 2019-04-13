exports.up = async function(r, conn) {
  const messages = await r
    .db('spectrum')
    .table('messages')
    .filter({ messageType: 'media' })
    .filter(row => row('timestamp').lt(r.epochTime(1540929600)))
    .filter(row => row('content')('body').match('spectrum.imgix.net'))
    .filter(row => row('content')('body').match('%20'))
    .filter(row => row.hasFields('deletedAt').not())
    .map(row => ({ id: row('id'), url: row('content')('body') }))
    .run(conn)
    .then(cursor => cursor.toArray());

  const messagePromises = messages.map(async obj => {
    return await r
      .db('spectrum')
      .table('messages')
      .get(obj.id)
      .update({
        content: {
          body: decodeURIComponent(obj.url),
        },
        imageReplaced: new Date(),
      })
      .run(conn);
  });

  return await Promise.all(messagePromises);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
