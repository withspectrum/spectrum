// @flow
import UserError from '../../utils/UserError';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';
import { publishThread, getWatercoolerThread } from '../../models/thread';
import { getChannelBySlug } from '../../models/channel';
import { setCommunityWatercoolerId } from '../../models/community';
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

type Args = {
  input: {
    id: string,
  },
};

export default requireAuth(async (_: any, args: Args, ctx: GraphQLContext) => {
  const { id: communityId } = args.input;
  const { user, loaders } = ctx;

  if (!(await canModerateCommunity(user.id, communityId, loaders))) {
    trackQueue.add({
      userId: user.id,
      event: events.COMMUNITY_WATERCOOLER_DISABLED_FAILED,
      context: { communityId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError("You don't have permission to do this.");
  }

  const community: DBCommunity = await loaders.community.load(communityId);

  if (!community.watercoolerId) return community;

  return setCommunityWatercoolerId(community.id, null);
});
