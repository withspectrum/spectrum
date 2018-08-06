// @flow
import type {
  DBChannel,
  DBUsersChannels,
  DBCommunity,
  DBUsersCommunities,
  DBThread,
  DBUser,
  DBReaction,
  DBThreadReaction,
  DBMessage,
  DBUsersThreads,
} from 'shared/types';
import { getTruthyValuesFromObject } from 'shared/truthy-values';

type AnalyticsChannel = {
  id: ?string,
  name: ?string,
  slug: ?string,
  isPrivate: ?boolean,
  isArchived: ?boolean,
};

type AnalyticsCommunity = {
  id: ?string,
  name: ?string,
  slug: ?string,
  isPrivate: boolean,
};

type AnalyticsChannelPermissions = {
  roles: Array<?string>,
};

type AnalyticsCommunityPermissions = {
  roles: Array<?string>,
};

type AnalyticsThread = {
  id: ?string,
  isLocked: ?boolean,
  isWatercooler: ?boolean,
};

type AnalyticsThreadPermissions = {
  isParticipant: ?boolean,
  receiveNotifications: ?boolean,
};

type AnalyticsUser = {
  createdAt: string,
  twitterAuthed: boolean,
  fbAuthed: boolean,
  githubAuthed: boolean,
  googleAuthed: boolean,
  hasUsername: boolean,
  lastSeen: ?string,
};

type AnalyticsReaction = {
  id: ?string,
  type: ?string,
};

type AnalyticsThreadReaction = {
  id: ?string,
  type: ?string,
};

type AnalyticsMessage = {
  id: ?string,
  threadType: ?string,
  parentId: ?string,
};

export const analyticsReaction = (reaction: ?DBReaction): AnalyticsReaction => {
  if (!reaction)
    return {
      id: null,
      type: null,
    };

  return {
    id: reaction.id,
    type: reaction.type,
  };
};

export const analyticsThreadReaction = (
  reaction: ?DBThreadReaction
): AnalyticsThreadReaction => {
  if (!reaction)
    return {
      id: null,
      type: null,
    };

  return {
    id: reaction.id,
    type: reaction.type,
  };
};

export const analyticsMessage = (message: ?DBMessage): AnalyticsMessage => {
  if (!message)
    return {
      id: null,
      threadType: null,
      parentId: null,
    };

  return {
    id: message.id,
    threadType: message.threadType,
    parentId: message.parentId ? message.parentId : null,
  };
};

export const analyticsChannel = (channel: ?DBChannel): AnalyticsChannel => {
  if (!channel)
    return {
      id: null,
      name: null,
      slug: null,
      isPrivate: null,
      isArchived: null,
    };

  return {
    id: channel.id,
    name: channel.name,
    slug: channel.slug,
    isPrivate: channel.isPrivate,
    isArchived: channel.archivedAt ? true : false,
  };
};

export const analyticsChannelPermissions = (
  channelPermissions: ?DBUsersChannels
): AnalyticsChannelPermissions => {
  if (!channelPermissions)
    return {
      roles: [],
    };

  return {
    roles: getTruthyValuesFromObject(channelPermissions),
  };
};

export const analyticsCommunity = (
  community: DBCommunity
): AnalyticsCommunity => {
  if (!community)
    return {
      id: null,
      name: null,
      slug: null,
      isPrivate: false,
    };

  return {
    id: community.id,
    name: community.name,
    slug: community.slug,
    isPrivate: community.isPrivate,
  };
};

export const analyticsCommunityPermissions = (
  communityPermissions: DBUsersCommunities
): AnalyticsCommunityPermissions => {
  if (!communityPermissions)
    return {
      roles: [],
      reputation: 0,
    };

  return {
    roles: getTruthyValuesFromObject(communityPermissions),
    reputation: communityPermissions.reputation,
  };
};

export const analyticsThread = (thread: ?DBThread): AnalyticsThread => {
  if (!thread)
    return {
      id: null,
      isLocked: null,
      isWatercooler: null,
    };

  return {
    id: thread.id,
    isLocked: thread.isLocked,
    isWatercooler: thread.watercooler ? true : false,
  };
};

export const analyticsThreadPermissions = (
  usersThread: ?DBUsersThreads
): AnalyticsThreadPermissions => {
  if (!usersThread) {
    return {
      isParticipant: false,
      receiveNotifications: false,
    };
  }

  return {
    isParticipant: usersThread.isParticipant,
    receiveNotifications: usersThread.receiveNotifications,
  };
};

export const analyticsUser = (user: DBUser): AnalyticsUser => {
  return {
    createdAt: user.createdAt,
    twitterAuthed: user.providerId ? true : false,
    fbAuthed: user.fbProviderId ? true : false,
    githubAuthed: user.githubProviderId ? true : false,
    googleAuthed: user.googleProviderId ? true : false,
    hasUsername: user.username ? true : false,
    lastSeen: user.lastSeen ? user.lastSeen : null,
  };
};
