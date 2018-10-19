// @flow
import type { GraphQLContext } from '../../';
import type { EditCommunityInput } from '../../models/community';
import UserError from '../../utils/UserError';
import { editCommunity } from '../../models/community';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

export default requireAuth(
  // prettier-ignore
  async (_: any, args: EditCommunityInput, ctx: GraphQLContext) => {
    const { user, loaders} = ctx
    const { communityId } = args.input

    // user must own the community to edit the community
    if (!await canModerateCommunity(user.id, communityId, loaders)) {
      trackQueue.add({
        userId: user.id,
        event: events.COMMUNITY_EDITED_FAILED,
        context: { communityId },
        properties: {
          reason: 'no permission'
        }
      })
      
      return new UserError("You don't have permission to edit this community.");
    }

    return editCommunity(args, user.id);
  }
);
