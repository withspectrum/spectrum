// @flow

export default (_, { threadId, value }, { user }) => {
  const currentUser = user;

  // user must be authed to edit a thread
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this thread.'
    );
  }

  // get the thread being locked
  return getThreads([threadId])
    .then(threads => {
      // select the thread
      const threadToEvaluate = threads[0];

      // if the thread doesn't exist
      if (!threadToEvaluate || threadToEvaluate.deletedAt) {
        return new UserError("This thread doesn't exist");
      }

      // get the channel permissions
      const currentUserChannelPermissions = getUserPermissionsInChannel(
        threadToEvaluate.channelId,
        currentUser.id
      );
      // get the community permissions
      const currentUserCommunityPermissions = getUserPermissionsInCommunity(
        threadToEvaluate.communityId,
        currentUser.id
      );

      // return the thread, channels and communities
      return Promise.all([
        threadToEvaluate,
        currentUserChannelPermissions,
        currentUserCommunityPermissions,
      ]);
    })
    .then(
      (
        [thread, currentUserChannelPermissions, currentUserCommunityPermissions]
      ) => {
        // user owns the community or the channel, they can lock the thread
        if (
          currentUserChannelPermissions.isOwner ||
          currentUserChannelPermissions.isModerator ||
          currentUserCommunityPermissions.isOwner ||
          currentUserCommunityPermissions.isModerator
        ) {
          return setThreadLock(threadId, value);
        }

        // if the user is not a channel or community owner, the thread can't be locked
        return new UserError(
          "You don't have permission to make changes to this thread."
        );
      }
    );
};
