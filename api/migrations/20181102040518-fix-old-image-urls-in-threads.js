exports.up = async function(r, conn) {
  const threads = await r
    .db('spectrum')
    .table('threads')
    .filter(row => row('modifiedAt').lt(r.epochTime(1540929600)))
    .filter(row => row('content')('body').match('spectrum.imgix.net'))
    .filter(row => row('content')('body').match('%20'))
    .filter(row => row.hasFields('deletedAt').not())
    .map(row => ({ id: row('id'), body: row('content')('body') }))
    .run(conn)
    .then(cursor => cursor.toArray());

  const threadPromises = threads.map(async obj => {
    const newBody = JSON.parse(obj.body);

    const imageKeys = Object.keys(newBody.entityMap).filter(
      key => newBody.entityMap[key].type.toLowerCase() === 'image'
    );

    const LEGACY_PREFIX = 'https://spectrum.imgix.net/';
    const hasLegacyPrefix = url => url.startsWith(LEGACY_PREFIX, 0);
    const stripLegacyPrefix = url => url.replace(LEGACY_PREFIX, '');

    const processImageUrl = str => {
      if (str.indexOf(LEGACY_PREFIX) < 0) {
        return str;
      }
      if (str.indexOf('%20') < 0) {
        return str;
      }

      const split = str.split('?');
      const imagePath = split[0];

      const decoded = decodeURIComponent(imagePath);

      const processed = hasLegacyPrefix(decoded)
        ? stripLegacyPrefix(decoded)
        : decoded;

      return processed;
    };

    imageKeys.forEach((key, index) => {
      if (!newBody.entityMap[key]) {
        return;
      }

      const { src } = newBody.entityMap[key].data;
      newBody.entityMap[key].data.src = processImageUrl(src);
    });

    return await r
      .db('spectrum')
      .table('threads')
      .get(obj.id)
      .update({
        content: {
          body: JSON.stringify(newBody),
        },
        imageReplaced: new Date(),
      })
      .run(conn);
  });

  return await Promise.all(threadPromises);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
