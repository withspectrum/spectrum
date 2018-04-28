// @flow
import type { GraphQLContext } from '../../';
import type { EditChannelInput } from '../../models/channel';
import UserError from '../../utils/UserError';
import { approvePendingUsersInChannel } from '../../models/usersChannels';
import { editChannel, getChannelById } from '../../models/channel';

export default async (
  _: any,
  args: EditChannelInput,
  { user }: GraphQLContext
) => {
  if (!await user.canManageChannel(args.input.channelId)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  const channel = await getChannelById(args.input.channelId);

  if (channel.isPrivate && !args.input.isPrivate) {
    approvePendingUsersInChannel(args.input.channelId);
  }

  return editChannel(args);
};
