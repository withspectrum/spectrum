// @flow
import type { GraphQLContext } from '../../';
import type { CreateChannelInput } from '../../models/channel';
import UserError from '../../utils/UserError';
import { channelSlugIsBlacklisted } from '../../utils/permissions';
import { getChannelBySlug, createChannel } from '../../models/channel';
import { createOwnerInChannel } from '../../models/usersChannels';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
import { track, trackUserError } from 'shared/analytics';
import * as events from 'shared/analytics/event-types';
import * as errors from 'shared/errors/error-types';
import {
  analyticsChannel,
  analyticsCommunity,
  analyticsCommunityPermissions,
} from 'shared/analytics/transformations';

export default requireAuth(
  async (
    _: any,
    args: CreateChannelInput,
    { user, loaders }: GraphQLContext
  ) => {
    const [communityPermissions, community] = await Promise.all([
      loaders.userPermissionsInCommunity.load([
        user.id,
        args.input.communityId,
      ]),
      loaders.community.load(args.input.communityId),
    ]);

    const eventProperties = {
      channel: args.input,
      community: {
        ...analyticsCommunity(community),
        ...analyticsCommunityPermissions(communityPermissions),
      },
    };

    if (!await canModerateCommunity(user.id, args.input.communityId, loaders)) {
      trackUserError(
        user.id,
        errors.CHANNEL_CREATED_FAILED_NO_PERMISSIONS,
        eventProperties
      );
      return new UserError(errors.CHANNEL_CREATED_FAILED_NO_PERMISSIONS);
    }

    if (channelSlugIsBlacklisted(args.input.slug)) {
      trackUserError(
        user.id,
        errors.CHANNEL_CREATED_FAILED_NAME_RESERVED,
        eventProperties
      );
      return new UserError(errors.CHANNEL_CREATED_FAILED_NAME_RESERVED);
    }

    const channelWithSlug = await getChannelBySlug(
      args.input.slug,
      community.slug
    );

    if (channelWithSlug) {
      trackUserError(
        user.id,
        errors.CHANNEL_CREATED_FAILED_SLUG_EXISTS,
        eventProperties
      );
      return new UserError(errors.CHANNEL_CREATED_FAILED_SLUG_EXISTS);
    }

    const newChannel = await createChannel(args, user.id);

    const createdEventProperties = Object.assign({}, eventProperties, {
      channel: analyticsChannel(newChannel),
    });

    track(user.id, events.CHANNEL_CREATED, createdEventProperties);

    return await createOwnerInChannel(newChannel.id, user.id).then(
      () => newChannel
    );
  }
);
