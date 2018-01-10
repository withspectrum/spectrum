// @flow
import type { GraphQLContext } from '../../';
import type { CreateChannelInput } from '../../models/channel';
import UserError from '../../utils/UserError';
import { channelSlugIsBlacklisted } from '../../utils/permissions';
import { getCommunities } from '../../models/community';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getChannelBySlug, createChannel } from '../../models/channel';
import { createOwnerInChannel } from '../../models/usersChannels';

export default async (
  _: any,
  args: CreateChannelInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to create a channel
  if (!currentUser) {
    return new UserError('You must be signed in to create a new community.');
  }

  if (channelSlugIsBlacklisted(args.input.slug)) {
    return new UserError('This channel name is reserved.');
  }

  // get the community parent where the channel is being created
  const communities = await getCommunities([args.input.communityId]);

  // get the permission of the user in the parent community
  const currentUserCommunityPermissions = await getUserPermissionsInCommunity(
    args.input.communityId,
    currentUser.id
  );

  const communityToEvaluate = communities[0];

  // if there is no community being evaluated, we can assume the
  // community doesn't exist any more
  if (!communityToEvaluate) {
    return new UserError(
      "You don't have permission to create a channel in this community."
    );
  }

  // if the current user is not the owner of the parent community
  // they can not create channels
  if (!currentUserCommunityPermissions.isOwner) {
    return new UserError(
      "You don't have permission to create a channel in this community."
    );
  }

  const channelWithSlug = await getChannelBySlug(
    args.input.slug,
    communityToEvaluate.slug
  );

  // if a channel is returned, it means a duplicate was being created
  // so we need to escape
  if (channelWithSlug) {
    return new UserError('A channel with this slug already exists.');
  }

  // if no channel was returned, it means we are creating a unique
  // new channel and can proceed
  const channel = await createChannel(args, currentUser.id);

  // once the channel is created, create the user's relationship with
  // the new channel
  return await createOwnerInChannel(channel.id, currentUser.id).then(
    () => channel
  );
};
