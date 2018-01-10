// @flow

export default (_, { threadId }, { user }) => {
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
      // get the community permissions (community owners and mods can delete a thread anywhere in the community)
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
        // if the user owns the community or the channel, or they are the original creator, they can delete the thread
        if (
          currentUserChannelPermissions.isOwner ||
          currentUserChannelPermissions.isModerator ||
          currentUserCommunityPermissions.isOwner ||
          currentUserCommunityPermissions.isModerator ||
          thread.creatorId === currentUser.id
        ) {
          // if the current user doing the deleting does not match the thread creator, we can assume that this deletion is happening as a moderation event. In this case we grant reputation to the moderator
          if (currentUser.id !== thread.creatorId) {
            addQueue('process reputation event', {
              userId: currentUser.id,
              type: 'thread deleted by moderation',
              entityId: thread.communityId,
            });
          }

          return deleteThread(threadId);
        }

        // if the user is not a channel or community owner, the thread can't be locked
        return new UserError(
          "You don't have permission to make changes to this thread."
        );
      }
    );
};
