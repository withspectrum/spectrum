// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getChannelById, archiveChannel } from '../../models/channel';

export default async (
  _: any,
  { input: { channelId } }: { input: { channelId: string } },
  { user }: GraphQLContext
) => {
  if (!await user.canModerateChannel(channelId)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  const channelToEvaluate = await getChannelById(channelId);

  if (channelToEvaluate.archivedAt) {
    return new UserError('Channel already archived');
  }

  if (channelToEvaluate.slug === 'general') {
    return new UserError("The general channel can't be archived");
  }

  return await archiveChannel(channelId);
};
