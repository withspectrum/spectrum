// @flow
import type { GraphQLContext } from '../../';
import type { Args } from './types';
import { intersection } from 'lodash';
import initIndex from 'shared/algolia';
import {
  getUserPermissionsInCommunity,
  DEFAULT_USER_COMMUNITY_PERMISSIONS,
} from '../../models/usersCommunities';
import {
  getUserPermissionsInChannel,
  DEFAULT_USER_CHANNEL_PERMISSIONS,
} from '../../models/usersChannels';
import { getChannelById, getChannels } from '../../models/channel';
import { getCommunityById, getCommunities } from '../../models/community';
import {
  getPublicChannelIdsInCommunity,
  getPublicCommunityIdsForUsersThreads,
  getPrivateChannelIdsInCommunity,
  getPrivateCommunityIdsForUsersThreads,
  getUsersJoinedPrivateChannelIds,
  getUsersJoinedPrivateCommunityIds,
  getPublicChannelIdsForUsersThreads,
  getPrivateChannelIdsForUsersThreads,
  getUsersJoinedChannels,
  getUsersJoinedCommunities,
} from '../../models/search';

const threadsSearchIndex = initIndex('threads_and_messages');

export default async (args: Args, { loaders, user }: GraphQLContext) => {
  const { queryString, filter } = args;
  const searchFilter = filter;

  let getSearchResultThreads = (filters: string) =>
    threadsSearchIndex
      .search({ query: queryString, filters })
      .then(content => {
        if (!content.hits || content.hits.length === 0) return null;
        return content.hits.map(o => ({
          threadId: o.threadId,
          channelId: o.channelId,
          communityId: o.communityId,
          creatorId: o.creatorId,
        }));
      })
      .catch(err => {
        console.error('err', err);
      });

  const IS_AUTHED_USER = user && user.id;

  // searching a channel
  if (searchFilter && searchFilter.channelId) {
    const { channelId } = searchFilter;
    const filters = `channelId:"${channelId}"`;
    let searchResultThreads = await getSearchResultThreads(filters);

    // if no threads exist, send an empty array to the client
    if (!searchResultThreads || searchResultThreads.length === 0) return [];

    const channel = await getChannelById(channelId);

    // channel doesn't exist
    if (!channel) return [];

    const usersPermissionsInCommunity = IS_AUTHED_USER
      ? getUserPermissionsInCommunity(channel.communityId, user.id)
      : DEFAULT_USER_COMMUNITY_PERMISSIONS;

    const usersPermissionsInChannel = IS_AUTHED_USER
      ? getUserPermissionsInChannel(channelId, user.id)
      : DEFAULT_USER_CHANNEL_PERMISSIONS;

    const [
      community,
      communityPermissions,
      channelPermissions,
    ] = await Promise.all([
      getCommunityById(channel.communityId),
      usersPermissionsInCommunity,
      usersPermissionsInChannel,
    ]);

    if (!community) return [];

    if (community.isPrivate && !communityPermissions.isMember) return [];

    if (channelPermissions.isBlocked) return [];

    if (channel.isPrivate && !channelPermissions.isMember) return [];

    searchResultThreads = searchResultThreads.filter(
      t => t.channelId === channel.id
    );

    return loaders.thread
      .loadMany(searchResultThreads.map(t => t && t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }

  // searching a community
  if (searchFilter && searchFilter.communityId) {
    const { communityId } = searchFilter;
    const filters = `communityId:"${communityId}"`;
    let searchResultThreads = await getSearchResultThreads(filters);

    // if no threads exist, send an empty array to the client
    if (!searchResultThreads || searchResultThreads.length === 0) return [];

    const getCommunity = getCommunityById(communityId);
    const getPublicChannelIds = getPublicChannelIdsInCommunity(communityId);
    const getPrivateChannelIds = IS_AUTHED_USER
      ? getPrivateChannelIdsInCommunity(communityId)
      : [];
    const getCurrentUsersChannelIds = IS_AUTHED_USER
      ? getUsersJoinedPrivateChannelIds(user.id)
      : [];
    const getCurrentUsersPermissionInCommunity = IS_AUTHED_USER
      ? getUserPermissionsInCommunity(communityId, user.id)
      : DEFAULT_USER_COMMUNITY_PERMISSIONS;

    const [
      community,
      publicChannels,
      privateChannels,
      currentUsersPrivateChannels,
      currentUserPermissionInCommunity,
    ] = await Promise.all([
      getCommunity,
      getPublicChannelIds,
      getPrivateChannelIds,
      getCurrentUsersChannelIds,
      getCurrentUsersPermissionInCommunity,
    ]);

    if (!community) return [];
    if (community.isPrivate && !currentUserPermissionInCommunity.isMember)
      return [];
    if (currentUserPermissionInCommunity.isBlocked) return [];

    const privateChannelsWhereUserIsMember = intersection(
      privateChannels,
      currentUsersPrivateChannels
    );

    const availableChannelsForSearch = [
      ...publicChannels,
      ...privateChannelsWhereUserIsMember,
    ];

    searchResultThreads = searchResultThreads
      .filter(t => availableChannelsForSearch.indexOf(t.channelId) >= 0)
      .filter(t => t.communityId === searchFilter.communityId);

    return loaders.thread
      .loadMany(searchResultThreads.map(t => t && t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }

  if (searchFilter && searchFilter.creatorId) {
    const { creatorId } = searchFilter;
    const filters = `creatorId:"${creatorId}"`;
    let searchResultThreads = await getSearchResultThreads(filters);

    // if no threads exist, send an empty array to the client
    if (!searchResultThreads || searchResultThreads.length === 0) return [];

    const getPublicChannelIds = getPublicChannelIdsForUsersThreads(creatorId);
    const getPublicCommunityIds = getPublicCommunityIdsForUsersThreads(
      creatorId
    );
    const getPrivateCommunityIds = IS_AUTHED_USER
      ? getPrivateCommunityIdsForUsersThreads(creatorId)
      : [];
    const getCurrentUsersCommunityIds = IS_AUTHED_USER
      ? getUsersJoinedPrivateCommunityIds(user.id)
      : [];
    const getPrivateChannelIds = IS_AUTHED_USER
      ? getPrivateChannelIdsForUsersThreads(creatorId)
      : [];
    const getCurrentUsersChannelIds = IS_AUTHED_USER
      ? getUsersJoinedPrivateChannelIds(user.id)
      : [];

    const [
      publicCommunities,
      privateCommunities,
      publicChannels,
      privateChannels,
      currentUsersPrivateChannels,
      currentUsersPrivateCommunities,
    ] = await Promise.all([
      getPublicCommunityIds,
      getPrivateCommunityIds,
      getPublicChannelIds,
      getPrivateChannelIds,
      getCurrentUsersChannelIds,
      getCurrentUsersCommunityIds,
    ]);

    const privateCommunitiesWhereUserIsMember = intersection(
      privateCommunities,
      currentUsersPrivateCommunities
    );

    const availableCommunitiesForSearch = [
      ...publicCommunities,
      ...privateCommunitiesWhereUserIsMember,
    ];

    const privateChannelsWhereUserIsMember = intersection(
      privateChannels,
      currentUsersPrivateChannels
    );

    const availableChannelsForSearch = [
      ...publicChannels,
      ...privateChannelsWhereUserIsMember,
    ];

    searchResultThreads = searchResultThreads
      .filter(t => availableChannelsForSearch.indexOf(t.channelId) >= 0)
      .filter(t => availableCommunitiesForSearch.indexOf(t.communityId) >= 0)
      .filter(t => t.creatorId === searchFilter.creatorId);

    return loaders.thread
      .loadMany(searchResultThreads.map(t => t && t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }

  // user is searching their everything feed
  if (searchFilter && searchFilter.everythingFeed) {
    const filters = '';
    let searchResultThreads = await getSearchResultThreads(filters);

    // if no threads exist, send an empty array to the client
    if (!searchResultThreads || searchResultThreads.length === 0) return [];

    const getAvailableCommunityids = IS_AUTHED_USER
      ? getUsersJoinedCommunities(user.id)
      : [];

    const getAvailableChannelIds = IS_AUTHED_USER
      ? getUsersJoinedChannels(user.id)
      : [];

    const [
      availableCommunitiesForSearch,
      availableChannelsForSearch,
    ] = await Promise.all([getAvailableCommunityids, getAvailableChannelIds]);

    searchResultThreads = searchResultThreads
      .filter(t => availableChannelsForSearch.indexOf(t.channelId) >= 0)
      .filter(t => availableCommunitiesForSearch.indexOf(t.communityId) >= 0);

    return loaders.thread
      .loadMany(searchResultThreads.map(t => t && t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }

  // if there isn't a filter, we can assume the user is searching spectrum globally
  const filters = '';
  let searchResultThreads = await getSearchResultThreads(filters);

  // if no threads exist, send an empty array to the client
  if (!searchResultThreads || searchResultThreads.length === 0) return [];

  // first, lets get the channels where the thread results were posted
  const channelsOfThreads = await getChannels(
    searchResultThreads.map(t => t && t.channelId)
  );

  const communitiesOfThreads = await getCommunities(
    searchResultThreads.map(t => t && t.communityId)
  );

  // see if any channels where thread results were found are private
  const privateChannelIds = channelsOfThreads
    .filter(c => c.isPrivate)
    .map(c => c.id);

  const privateCommunityIds = communitiesOfThreads
    .filter(c => c.isPrivate)
    .map(c => c.id);

  // if the search results contain threads that aren't in any private channels,
  // send down the results
  if (
    (!privateChannelIds || privateChannelIds.length === 0) &&
    (!privateCommunityIds || privateCommunityIds.length === 0)
  ) {
    return loaders.thread
      .loadMany(searchResultThreads.map(t => t && t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  } else {
    // otherwise here we know that the user found threads where some of them are
    // in a private channel - we need to check permissions
    const currentUsersPrivateChannelIds = IS_AUTHED_USER
      ? await getUsersJoinedPrivateChannelIds(user.id)
      : [];

    const currentUsersPrivateCommunityIds = IS_AUTHED_USER
      ? await getUsersJoinedPrivateCommunityIds(user.id)
      : [];

    // find which private channels the user is a member of
    const availablePrivateChannels =
      currentUsersPrivateChannelIds.length > 0
        ? intersection(privateChannelIds, currentUsersPrivateChannelIds)
        : [];

    const availablePrivateCommunities =
      currentUsersPrivateCommunityIds.length > 0
        ? intersection(privateCommunityIds, currentUsersPrivateCommunityIds)
        : [];

    // for each thread in the search results, determine if it was posted in
    // a private channel. if yes, is the current user a member?
    searchResultThreads = searchResultThreads.filter(thread => {
      if (!thread) return null;

      if (privateChannelIds.indexOf(thread.channelId) >= 0) {
        return availablePrivateChannels.indexOf(thread.channelId) >= 0;
      }

      if (privateCommunityIds.indexOf(thread.communityId) >= 0) {
        return availablePrivateCommunities.indexOf(thread.communityId) >= 0;
      }

      return thread;
    });

    return loaders.thread
      .loadMany(searchResultThreads.map(t => t && t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }
};
