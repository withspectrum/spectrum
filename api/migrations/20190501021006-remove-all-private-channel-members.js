exports.up = async function(r, conn) {
  // get all private channels that haven't been deleted
  const privateChannels = await r
    .db('spectrum')
    .table('channels')
    .filter({ isPrivate: true })
    .filter(row => row.hasFields('deletedAt').not())
    .run(conn);

  // for each channel, remove all members except the community owner
  const channelPromises = privateChannels.map(async channel => {
    const community = await r
      .db('spectrum')
      .table('communities')
      .get(channel.communityId)
      .run(conn);

    // ensure that the community owner also owns the channel
    // to account for situations where a moderator created the channel
    await r
      .db('spectrum')
      .table('usersChannels')
      .getAll([channel.creatorId, channel.id], { index: 'userIdAndChannelId' })
      .update({ isOwner: true })
      .run(conn);

    return await r
      .db('spectrum')
      .table('usersChannels')
      .getAll(channel.id)
      .filter({ isMember: true })
      .filter(row => row('userId').ne(community.creatorId))
      .update({ isMember: false })
      .run(conn);
  });

  return Promise.all(channelPromises);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
