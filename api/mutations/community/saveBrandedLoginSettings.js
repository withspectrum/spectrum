// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  createCommunitySettings,
  updateCommunityBrandedLoginMessage,
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
    message: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { id: communityId, message } = args.input;
  const { user, loaders } = ctx;

  if (message && message.length > 280) {
    trackQueue.add({
      userId: user.id,
      event: events.COMMUNITY_BRANDED_LOGIN_SETTINGS_SAVED_FAILED,
      context: { communityId },
      properties: {
        reason: 'message too long',
      },
    });

    return new UserError(
      'Custom login messages should be less than 280 characters'
    );
  }

  if (!await canModerateCommunity(user.id, communityId, loaders)) {
    trackQueue.add({
      userId: user.id,
      event: events.COMMUNITY_BRANDED_LOGIN_SETTINGS_SAVED_FAILED,
      context: { communityId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError("You don't have permission to do this.");
  }

  const settings = await loaders.communitySettings.load(communityId);

  loaders.communitySettings.clear(communityId);

  // settings.id tells us that a channelSettings record exists in the db
  if (settings.id) {
    return await updateCommunityBrandedLoginMessage(
      communityId,
      message,
      user.id
    );
  } else {
    return await createCommunitySettings(communityId).then(
      async () =>
        await updateCommunityBrandedLoginMessage(communityId, message, user.id)
    );
  }
});
