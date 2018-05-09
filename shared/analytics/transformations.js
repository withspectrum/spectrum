// @flow
import type {
  DBChannel,
  DBUsersChannels,
  DBCommunity,
  DBUsersCommunities,
  DBThread,
  DBUser,
  DBReaction,
  DBMessage,
} from 'shared/types';
import { getTruthyValuesFromObject } from 'src/helpers/utils';

type AnalyticsChannel = {
  id: string,
  name: string,
  slug: string,
  isPrivate: boolean,
  isArchived: boolean,
};

type AnalyticsCommunity = {
  id: string,
  name: string,
  slug: string,
};

type AnalyticsChannelPermissions = {
  roles: Array<?string>,
};

type AnalyticsCommunityPermissions = {
  roles: Array<?string>,
};

type AnalyticsThread = {
  id: string,
  isLocked: boolean,
  isWatercooler: boolean,
};

type AnalyticsUser = {
  id: string,
  createdAt: string,
  name: string,
  providerId: ?string,
  githubProviderId: ?string,
  githubUsername: ?string,
  fbProviderId: ?string,
  googleProviderId: ?string,
  username: ?string,
  lastSeen: ?string,
  modifiedAt: ?string,
};

type AnalyticsReaction = {
  id: string,
  type: string,
};

type AnalyticsMessage = {
  id: string,
  threadType: string,
  parentId: ?string,
};

export const analyticsReaction = (reaction: DBReaction): AnalyticsReaction => {
  return {
    id: reaction.id,
    type: reaction.type,
  };
};

export const analyticsMessage = (message: DBMessage): AnalyticsMessage => {
  return {
    id: message.id,
    threadType: message.threadType,
    parentId: message.parentId ? message.parentId : null,
  };
};

export const analyticsChannel = (channel: DBChannel): AnalyticsChannel => {
  return {
    id: channel.id,
    name: channel.name,
    slug: channel.slug,
    isPrivate: channel.isPrivate,
    isArchived: channel.archivedAt ? true : false,
  };
};

export const analyticsChannelPermissions = (
  channelPermissions: DBUsersChannels
): AnalyticsChannelPermissions => {
  return {
    roles: getTruthyValuesFromObject(channelPermissions),
  };
};

export const analyticsCommunity = (
  community: DBCommunity
): AnalyticsCommunity => {
  return {
    id: community.id,
    name: community.name,
    slug: community.slug,
  };
};

export const analyticsCommunityPermissions = (
  communityPermissions: DBUsersCommunities
): AnalyticsCommunityPermissions => {
  return {
    roles: getTruthyValuesFromObject(communityPermissions),
    reputation: communityPermissions.reputation,
  };
};

export const analyticsThread = (thread: DBThread): AnalyticsThread => {
  return {
    id: thread.id,
    isLocked: thread.isLocked,
    isWatercooler: thread.watercooler ? true : false,
  };
};

export const analyticsUser = (user: DBUser): AnalyticsUser => {
  return {
    id: user.id,
    createdAt: user.createdAt,
    name: user.name,
    providerId: user.providerId,
    githubProviderId: user.githubProviderId,
    githubUsername: user.githubUsername,
    fbProviderId: user.fbProviderId,
    googleProviderId: user.googleProviderId,
    username: user.username ? user.username : null,
    lastSeen: user.lastSeen ? user.lastSeen : null,
    modifiedAt: user.modifiedAt,
  };
};
