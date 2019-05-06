exports.up = async function(r, conn) {
  // get all private channels that haven't been deleted
  const privateChannels = await r
    .db('spectrum')
    .table('channels')
    .filter({ isPrivate: true })
    .filter(row => row.hasFields('deletedAt').not())
    .run(conn)
    .then(cursor => cursor.toArray());

  // for each channel, remove all members except the community owner
  return Promise.all(
    privateChannels.map(async channel => {
      const community = await r
        .db('spectrum')
        .table('communities')
        .get(channel.communityId)
        .run(conn);

      // ensure that the community owner also owns the channel
      // to account for situations where a moderator created the channel
      const communityOwnerChannelRecord = await r
        .db('spectrum')
        .table('usersChannels')
        .getAll([community.creatorId, channel.id], {
          index: 'userIdAndChannelId',
        })
        .run(conn)
        .then(cursor => cursor.toArray());

      if (
        !communityOwnerChannelRecord ||
        communityOwnerChannelRecord.length === 0
      ) {
        await r
          .db('spectrum')
          .table('usersChannels')
          .insert({
            channelId: channel.id,
            userId: community.creatorId,
            createdAt: new Date(),
            isOwner: true,
            isMember: true,
            isModerator: false,
            isBlocked: false,
            isPending: false,
            receiveNotifications: false,
          })
          .run(conn);
      } else {
        await r
          .db('spectrum')
          .table('usersChannels')
          .getAll([community.creatorId, channel.id], {
            index: 'userIdAndChannelId',
          })
          .update({ isOwner: true })
          .run(conn);
      }

      return await r
        .db('spectrum')
        .table('usersChannels')
        .getAll(channel.id, { index: 'channelId' })
        .filter({ isMember: true })
        .filter(row => row('userId').ne(community.creatorId))
        .update({ isMember: false })
        .run(conn);
    })
  );
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
