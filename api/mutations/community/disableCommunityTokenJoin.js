// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getOrCreateCommunitySettings,
  disableCommunityTokenJoin,
} from '../../models/communitySettings';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type Input = {
  input: {
    id: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { id: communityId } = args.input;
  const { user, loaders } = ctx;

  if (!await canModerateCommunity(user.id, communityId, loaders)) {
    trackQueue.add({
      userId: user.id,
      event: events.COMMUNITY_JOIN_TOKEN_DISABLED_FAILED,
      context: { communityId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError('You don’t have permission to manage this community');
  }

  return await getOrCreateCommunitySettings(communityId).then(
    async () => await disableCommunityTokenJoin(communityId, user.id)
  );
});
