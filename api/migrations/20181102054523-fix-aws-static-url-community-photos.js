exports.up = async function(r, conn) {
  const LEGACY_PREFIX = 'https://s3.amazonaws.com/spectrum-chat/';

  const communities = await r
    .db('spectrum')
    .table('communities')
    .filter(row =>
      row('profilePhoto')
        .match(LEGACY_PREFIX)
        .or(row('coverPhoto').match(LEGACY_PREFIX))
    )
    .filter(row => row.hasFields('deletedAt').not())
    .map(row => ({
      id: row('id'),
      profilePhoto: row('profilePhoto'),
      coverPhoto: row('coverPhoto'),
    }))
    .run(conn)
    .then(cursor => cursor.toArray());

  const communityPromises = communities.map(async obj => {
    const { profilePhoto, coverPhoto } = obj;
    const hasLegacyPrefix = url => url.startsWith(LEGACY_PREFIX, 0);
    const stripLegacyPrefix = url => url.replace(LEGACY_PREFIX, '');

    const processImageUrl = str => {
      if (str.indexOf(LEGACY_PREFIX) < 0) {
        return str;
      }

      return stripLegacyPrefix(str);
    };

    const newProfilePhoto = processImageUrl(profilePhoto);
    const newCoverPhoto = processImageUrl(coverPhoto);

    return await r
      .db('spectrum')
      .table('communities')
      .get(obj.id)
      .update({
        coverPhoto: newCoverPhoto,
        profilePhoto: newProfilePhoto,
        awsStaticReplaced: new Date(),
      })
      .run(conn);
  });

  return await Promise.all(communityPromises);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
