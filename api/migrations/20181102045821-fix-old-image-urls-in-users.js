exports.up = async function(r, conn) {
  const users = await r
    .db('spectrum')
    .table('users')
    .filter(row => row('modifiedAt').lt(r.epochTime(1540929600)))
    .filter(row =>
      row.hasFields('coverPhoto').and(row.hasFields('profilePhoto'))
    )
    .filter(row =>
      row('profilePhoto')
        .match('spectrum.imgix.net')
        .or(row('coverPhoto').match('spectrum.imgix.net'))
    )
    .filter(row =>
      row('profilePhoto')
        .match('%20')
        .or(row('coverPhoto').match('%20'))
    )
    .filter(row => row.hasFields('deletedAt').not())
    .map(row => ({
      id: row('id'),
      profilePhoto: row('profilePhoto'),
      coverPhoto: row('coverPhoto'),
    }))
    .run(conn)
    .then(cursor => cursor.toArray());

  const userPromises = users.map(async obj => {
    const { profilePhoto, coverPhoto } = obj;

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

    const newProfilePhoto = processImageUrl(profilePhoto);
    const newCoverPhoto = processImageUrl(coverPhoto);

    return await r
      .db('spectrum')
      .table('users')
      .get(obj.id)
      .update({
        coverPhoto: newCoverPhoto,
        profilePhoto: newProfilePhoto,
        imageReplaced: new Date(),
      })
      .run(conn);
  });

  return await Promise.all(userPromises);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
