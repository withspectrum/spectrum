// @flow
import UserError from '../../utils/UserError';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
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
    return new UserError("You don't have permission to do this.");
  }

  const community: DBCommunity = await loaders.community.load(communityId);

  if (community.watercoolerId) return community;

  const channel = await getChannelBySlug('general', community.slug);

  if (!channel) {
    throw new Error(
      `Community ${community.slug} does not have general channel.`
    );
  }

  const existingWatercooler = await getWatercoolerThread(community.id);

  if (existingWatercooler)
    return setCommunityWatercoolerId(community.id, existingWatercooler.id);

  const watercooler = await publishThread(
    {
      channelId: channel.id,
      communityId: community.id,
      content: {
        title: `${community.name} Chat`,
      },
      type: 'DRAFTJS',
      watercooler: true,
    },
    user.id
  );

  return setCommunityWatercoolerId(community.id, watercooler.id);
});
