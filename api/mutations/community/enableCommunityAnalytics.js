// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { updateCommunityPaidFeature } from '../../models/community';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type Input = {
  input: {
    communityId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { communityId } = args.input;
  const { user, loaders } = ctx;

  if (!await canModerateCommunity(user.id, communityId, loaders)) {
    trackQueue.add({
      userId: user.id,
      event: events.COMMUNITY_ANALYTICS_ENABLED_FAILED,
      context: { communityId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError(
      'You must own or moderate this community to enable analytics'
    );
  }

  return await updateCommunityPaidFeature(
    communityId,
    'analyticsEnabled',
    true,
    user.id
  );
});
