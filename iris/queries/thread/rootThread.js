// @flow
import type { GraphQLContext } from '../../';

export default (
  _: any,
  { id }: { id: string },
  { loaders, user }: GraphQLContext
) =>
  loaders.thread.load(id).then(thread => {
    // if a thread wasn't found
    if (!thread) return null;

    /*
      If no user exists, we need to make sure the thread being fetched is not in a private channel
    */
    if (!user) {
      return Promise.all([
        thread,
        loaders.channel.load(thread.channelId),
      ]).then(([thread, channel]) => {
        // if the channel is private, don't return any thread data
        if (channel.isPrivate) return null;
        return thread;
      });
    } else {
      // if the user is signed in, we need to check if the channel is private as well as the user's permission in that channel
      return Promise.all([
        thread,
        loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
        loaders.channel.load(thread.channelId),
      ]).then(([thread, permissions, channel]) => {
        // if the thread is in a private channel where the user is not a member, don't return any thread data
        if (channel.isPrivate && !permissions.isMember) return null;
        return thread;
      });
    }
  });
