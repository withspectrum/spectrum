// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { archiveChannel } from '../../models/channel';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';

type Input = {
  input: {
    channelId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { channelId } = args.input;
  const { user, loaders } = ctx;

  const channelToEvaluate = await loaders.channel.load(channelId);

  if (!(await canModerateChannel(user.id, channelId, loaders))) {
    return new UserError('You don’t have permission to archive this channel');
  }

  if (channelToEvaluate.archivedAt) {
    return new UserError('This channel is already archived');
  }

  if (channelToEvaluate.slug === 'general') {
    return new UserError(
      'The general channel in a community can’t be archived'
    );
  }

  return await archiveChannel(channelId);
});
