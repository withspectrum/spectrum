// @flow

export default async (_: any, { threadId, channelId }, { user }) => {
  const currentUser = user;
  if (!currentUser)
    throw new UserError('You must be signed in to move a thread.');

  const thread = await getThread(threadId);
  if (!thread) throw new UserError('Cannot move a non-existant thread.');

  const {
    isOwner,
    isModerator,
    isBlocked,
  } = await getUserPermissionsInCommunity(thread.communityId, currentUser.id);

  if (isBlocked) {
    throw new UserError("You don't have permission to post in that channelId.");
  }

  if (thread.creatorId !== currentUser.id && (!isOwner && !isModerator))
    throw new UserError(
      'You have to be a moderator or owner of the community to move a thread.'
    );

  const [newChannel] = await getChannels([channelId]);
  if (newChannel.communityId !== thread.communityId)
    throw new UserError('You can only move threads within the same community.');

  return moveThread(threadId, channelId).then(res => {
    if (res) return res;

    throw new UserError(
      'Oops, something went wrong with moving the thread. Please try again!'
    );
  });
};
