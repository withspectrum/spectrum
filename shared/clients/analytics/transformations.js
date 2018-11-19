// @flow
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import type { ThreadInfoType } from 'shared/graphql/fragments/thread/threadInfo';
import { getTruthyValuesFromObject } from '../../truthy-values';

type AnalyticsChannel = {
  id: ?string,
  name: ?string,
  slug: ?string,
  roles: Array<?string>,
  isPrivate: boolean,
  isArchived: boolean,
};

type AnalyticsCommunity = {
  id: ?string,
  name: ?string,
  slug: ?string,
  roles: Array<?string>,
  reputation: number,
};

type AnalyticsThread = {
  id: ?string,
  receiveNotifications: boolean,
  isLocked: boolean,
  isWatercooler: boolean,
};

export const analyticsChannel = (
  channel: ChannelInfoType
): AnalyticsChannel => {
  if (!channel) {
    return {
      id: null,
      name: null,
      slug: null,
      roles: [],
      isPrivate: false,
      isArchived: false,
    };
  }

  return {
    id: channel.id,
    name: channel.name,
    slug: channel.slug,
    roles: getTruthyValuesFromObject(channel.channelPermissions),
    isPrivate: channel.isPrivate,
    isArchived: channel.isArchived,
  };
};

export const analyticsCommunity = (
  community: CommunityInfoType
): AnalyticsCommunity => {
  if (!community) {
    return {
      id: null,
      name: null,
      slug: null,
      roles: [],
      reputation: 0,
      isPrivate: false,
    };
  }

  return {
    id: community.id,
    name: community.name,
    slug: community.slug,
    roles: getTruthyValuesFromObject(community.communityPermissions),
    reputation: community.communityPermissions.reputation || 0,
    isPrivate: community.isPrivate,
  };
};

export const analyticsThread = (thread: ThreadInfoType): AnalyticsThread => {
  if (!thread) {
    return {
      id: null,
      receiveNotifications: false,
      isLocked: false,
      isWatercooler: false,
    };
  }
  return {
    id: thread.id,
    receiveNotifications: thread.receiveNotifications,
    isLocked: thread.isLocked,
    isWatercooler: thread.watercooler,
  };
};
