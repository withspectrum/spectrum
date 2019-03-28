// @flow
import type { GraphQLContext } from '../../';
import { reorderChannels } from '../../models/channel';
import UserError from '../../utils/UserError';
import { channelSlugIsBlacklisted } from '../../utils/permissions';
import { getChannelBySlug, createChannel } from '../../models/channel';
import { createOwnerInChannel } from '../../models/usersChannels';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

export default async (_: any, args, ctx: GraphQLContext) => {
  return await reorderChannels(args.input);
};
