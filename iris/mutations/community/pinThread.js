// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default (_, { threadId, communityId, value }, { user }) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError(
      'You must be signed in to pin a thread in this community.'
    );
  }

  const promises = [
    getUserPermissionsInCommunity(communityId, currentUser.id),
    getThreads([threadId]),
  ];

  return Promise.all([...promises])
    .then(([permissions, threads]) => {
      if (!permissions.isOwner) {
        return new UserError("You don't have permission to do this.");
      }

      const threadToEvaluate = threads[0];

      // we have to ensure the thread isn't in a private channel
      return getChannels([threadToEvaluate.channelId]);
    })
    .then(channels => {
      if (channels[0].isPrivate) {
        return new UserError('Only threads in public channels can be pinned.');
      }
      return setPinnedThreadInCommunity(communityId, value);
    });
};
