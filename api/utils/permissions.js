// @flow
import UserError from './UserError';
import type { GraphQLContext } from '../';
import type { DBChannel, DBCommunity, DBUser } from 'shared/types';
import {
  COMMUNITY_SLUG_DENY_LIST,
  CHANNEL_SLUG_DENY_LIST,
} from 'shared/slug-deny-lists';
import { getThreadById } from '../models/thread';

export const isAdmin = (id: string): boolean => {
  const admins = [
    'gVk5mYwccUOEKiN5vtOouqroGKo1',
    '01p2A7kDCWUjGj6zQLlMQUOSQL42',
    'VToKcde16dREgDkXcDl3hhcrFN33',
  ];
  return admins.indexOf(id) > -1;
};

export const communitySlugIsDenyListed = (slug: string): boolean => {
  return COMMUNITY_SLUG_DENY_LIST.indexOf(slug) > -1;
};

export const channelSlugIsDenyListed = (slug: string): boolean => {
  return CHANNEL_SLUG_DENY_LIST.indexOf(slug) > -1;
};

// prettier-ignore
export const isAuthedResolver = (resolver: Function) => async (obj: any, args: any, context: GraphQLContext, info: any) => {
  if (!context.user || !context.user.id) {
    return new UserError('You must be signed in to do this')
  }

  const user = await context.loaders.user.load(context.user.id)

  if (!user || user.bannedAt || user.deletedAt) {
    return new UserError('You must be signed in to do this')
  }

  return resolver(obj, args, context, info)
}

// prettier-ignore
const channelExists = async (channelId: string, loaders: any): Promise<?DBChannel> => {
  const channel = await loaders.channel.load(channelId);
  if (!channel || channel.deletedAt) return null;
  return channel;
};

// prettier-ignore
const communityExists = async (communityId: string, loaders: any): Promise<?DBCommunity> => {
  const community = await loaders.community.load(communityId);
  if (!community || community.deletedAt) return null;
  return community;
};

// prettier-ignore
export const canAdministerChannel = async (userId: string, channelId: string, loaders: any) => {
  if (!userId || !channelId) return false;

  const channel = await channelExists(channelId, loaders);
  if (!channel) return false;

  const [communityPermissions, channelPermissions] = await Promise.all([
    loaders.userPermissionsInCommunity.load([userId, channel.communityId]),
    loaders.userPermissionsInChannel.load([userId, channelId]),
  ]);

  if (!communityPermissions) return false;
  if (communityPermissions.isOwner || communityPermissions.isModerator)
    return true;
  if (!channelPermissions) return false;
  if (channelPermissions.isOwner) return true;

  return false;
};

// prettier-ignore
export const canModerateChannel = async (userId: string, channelId: string, loaders: any) => {
  if (!userId || !channelId) return false;

  const channel = await channelExists(channelId, loaders);
  if (!channel) return false;

  const [communityPermissions, channelPermissions] = await Promise.all([
    loaders.userPermissionsInCommunity.load([userId, channel.communityId]),
    loaders.userPermissionsInChannel.load([userId, channelId]),
  ]);

  if (!communityPermissions) return false;
  if (communityPermissions.isBlocked) return false
  if (communityPermissions.isOwner || communityPermissions.isModerator) return true

  if (!channelPermissions) return false;
  if (channelPermissions.isBlocked) return false
  return channelPermissions.isOwner || channelPermissions.isModerator
};

// prettier-ignore
export const canAdministerCommunity = async (userId: string, communityId: string, loaders: any) => {
  if (!userId || !communityId) return false;

  const community = await communityExists(communityId, loaders);
  if (!community) return false;

  const communityPermissions = await loaders.userPermissionsInCommunity.load([
    userId,
    communityId,
  ]);

  if (!communityPermissions) return false
  if (communityPermissions.isBlocked) return false
  return communityPermissions.isOwner
};

// prettier-igore
export const canModerateCommunity = async (
  userId: string,
  communityId: string,
  loaders: any
) => {
  if (!userId || !communityId) return false;

  const community = await communityExists(communityId, loaders);
  if (!community) return false;

  const communityPermissions = await loaders.userPermissionsInCommunity.load([
    userId,
    communityId,
  ]);

  if (!communityPermissions) return false;
  if (communityPermissions.isBlocked) return false;
  return communityPermissions.isOwner || communityPermissions.isModerator;
};

// prettier-ignore
export const canViewCommunity = async (user: DBUser, communityId: string, loaders: any) => {
  if (!communityId) return false;

  const community = await communityExists(communityId, loaders);
  if (!community) return false;

  if (!user) {
    if (community.isPrivate) return false
    return true
  }

  const communityPermissions = await loaders.userPermissionsInCommunity.load([
    user.id,
    communityId,
  ]);

  if (community.isPrivate && !communityPermissions) return false;
  if (communityPermissions && communityPermissions.isBlocked) return false
  if (community.isPrivate && !communityPermissions.isMember) return false
  
  return true;
}

export const canViewThread = async (
  userId: string,
  threadId: string,
  loaders: any
) => {
  const thread = await getThreadById(threadId);

  if (!thread || thread.deletedAt) return false;

  const [
    channel,
    community,
    channelPermissions,
    communityPermissions,
  ] = await Promise.all([
    loaders.channel.load(thread.channelId),
    loaders.community.load(thread.communityId),
    loaders.userPermissionsInChannel.load([userId, thread.channelId]),
    loaders.userPermissionsInCommunity.load([userId, thread.communityId]),
  ]);

  if (!channel || !community) return false;
  if (channel.deletedAt || community.deletedAt) return false;

  if (userId) {
    if (channel.isPrivate) {
      if (
        !channelPermissions ||
        channelPermissions.isBlocked ||
        !channelPermissions.isMember
      ) {
        return false;
      }

      return true;
    }

    if (community.isPrivate) {
      if (
        !communityPermissions ||
        communityPermissions.isBlocked ||
        !communityPermissions.isMember
      ) {
        return false;
      }

      return true;
    }

    if (communityPermissions) {
      return !communityPermissions.isBlocked;
    }

    if (channelPermissions) {
      return !channelPermissions.isBlocked;
    }
  }

  return !channel.isPrivate && !community.isPrivate;
};

export const canViewDMThread = async (
  userId: string,
  threadId: string,
  loaders: any
) => {
  if (!userId) return false;

  const thread = await loaders.directMessageParticipants.load(threadId);

  if (!thread || !thread.reduction || thread.reduction.length === 0)
    return false;

  const participants = thread.reduction;

  const ids = participants.map(({ userId }) => userId);

  if (ids.indexOf(userId) === -1) return false;

  return true;
};

// prettier-ignore
export const canViewChannel = async (user: DBUser, channelId: string, loaders: any) => {
  if (!channelId) return false;

  const channel = await channelExists(channelId, loaders);
  if (!channel) return false;

  const community = await communityExists(channel.communityId, loaders);
  if (!community) return false
  
  if (!user) {
    if (!community.isPrivate && !channel.isPrivate) return true
    return false
  }
  
  const [
    communityPermissions,
    channelPermissions
  ] = await Promise.all([
    loaders.userPermissionsInCommunity.load([
      user.id,
      community.id,
    ]),
    loaders.userPermissionsInChannel.load([
      user.id,
      channel.id,
    ])
  ])
  
  if (channel.isPrivate && !channelPermissions) return false
  if (community.isPrivate && !communityPermissions) return false
  if (channel.isPrivate && !channelPermissions.isMember) return false
  if (community.isPrivate && !communityPermissions.isMember) return false
  if (channelPermissions && channelPermissions.isBlocked) return false
  if (communityPermissions && communityPermissions.isBlocked) return false
  
  return true
}
