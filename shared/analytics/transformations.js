// @flow
import type {
  DBChannel,
  DBUsersChannels,
  DBCommunity,
  DBUsersCommunities,
  DBThread,
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
