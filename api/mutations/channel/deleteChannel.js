// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { removeMembersInChannel } from '../../models/usersChannels';
import { getChannelById, deleteChannel } from '../../models/channel';
import { getThreadsByChannelToDelete, deleteThread } from '../../models/thread';
import { userCanManageChannel } from './utils';

export default async (
  _: any,
  { channelId }: { channelId: string },
  { user }: GraphQLContext
) => {
  if (await !userCanManageChannel(user.id, channelId)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  const channel = await getChannelById(channelId);

  if (channel.slug === 'general') {
    return new UserError("The general channel can't be deleted");
  }

  const [allThreadsInChannel] = await Promise.all([
    getThreadsByChannelToDelete(channelId),
    deleteChannel(channelId),
    removeMembersInChannel(channelId),
  ]);

  if (allThreadsInChannel.length === 0) return true;

  return allThreadsInChannel.map(thread => deleteThread(thread.id));
};
