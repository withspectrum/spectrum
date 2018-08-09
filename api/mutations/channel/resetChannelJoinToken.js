// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getOrCreateChannelSettings,
  resetChannelJoinToken,
} from '../../models/channelSettings';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type Input = {
  input: {
    id: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { id: channelId } = args.input;
  const { user, loaders } = ctx;

  if (!await canModerateChannel(user.id, channelId, loaders)) {
    trackQueue.add({
      userId: user.id,
      event: events.CHANNEL_JOIN_TOKEN_RESET_FAILED,
      context: { channelId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError('You don’t have permission to manage this channel');
  }

  return await getOrCreateChannelSettings(channelId).then(
    async () => await resetChannelJoinToken(channelId, user.id)
  );
});
