// @flow
import type { GraphQLContext } from '../../';

export default async (
  _: any,
  { id }: { id: string },
  { loaders, user }: GraphQLContext
) => {
  const thread = await loaders.thread.load(id);

  // if a thread wasn't found
  if (!thread) return null;

  /*
      If no user exists, we need to make sure the thread being fetched is not in a private channel
    */
  if (!user) {
    const [channel, community] = await Promise.all([
      loaders.channel.load(thread.channelId),
      loaders.community.load(thread.communityId),
    ]);

    // if the channel is private, don't return any thread data
    if (channel.isPrivate || community.isPrivate) return null;
    return thread;
  } else {
    // if the user is signed in, we need to check if the channel is private as well as the user's permission in that channel
    const [
      channelPermissions,
      channel,
      communityPermissions,
      community,
    ] = await Promise.all([
      loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
      loaders.channel.load(thread.channelId),
      loaders.userPermissionsInCommunity.load([user.id, thread.communityId]),
      loaders.community.load(thread.communityId),
    ]);

    // if the thread is in a private channel where the user is not a member, don't return any thread data
    if (channel.isPrivate && !channelPermissions.isMember) return null;
    if (community.isPrivate && !communityPermissions.isMember) return null;
    return thread;
  }
};
