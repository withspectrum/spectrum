// @flow
import type { GraphQLContext } from '../../';
import type { Args } from './types';
import { intersection } from 'lodash';
import initIndex from 'shared/algolia';

import {
  getUserPermissionsInChannel,
  DEFAULT_USER_CHANNEL_PERMISSIONS,
} from '../../models/usersChannels';
import { getChannelById, getChannels } from '../../models/channel';
import { getCommunityById } from '../../models/community';
import {
  getPublicChannelIdsInCommunity,
  getPrivateChannelIdsInCommunity,
  getUsersJoinedPrivateChannelIds,
  getPublicChannelIdsForUsersThreads,
  getPrivateChannelIdsForUsersThreads,
  getUsersJoinedChannels,
} from '../../models/search';

const threadsSearchIndex = initIndex('threads_and_messages');

export default async (args: Args, { loaders, user }: GraphQLContext) => {
  const { queryString, searchFilter } = args;

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
        console.log('err', err);
      });

  const IS_AUTHED_USER = user && user.id;

  // searching a channel
  if (searchFilter && searchFilter.channelId) {
    const filters = `channelId:"${searchFilter.channelId}"`;
    let searchResultThreads = await getSearchResultThreads(filters);

    // if no threads exist, send an empty array to the client
    if (!searchResultThreads || searchResultThreads.length === 0) return [];

    const getChannel = getChannelById(searchFilter.channelId);
    const usersPermissionsInChannel = IS_AUTHED_USER
      ? getUserPermissionsInChannel(searchFilter.channelId, user.id)
      : DEFAULT_USER_CHANNEL_PERMISSIONS;

    const [channel, permissions] = await Promise.all([
      getChannel,
      usersPermissionsInChannel,
    ]);

    // channel doesn't exist
    if (!channel) return [];

    // if the channel is private and the user isn't a member
    if (channel.isPrivate && !permissions.isMember) {
      return [];
    }

    searchResultThreads = searchResultThreads.filter(
      t => t.channelId === channel.id
    );

    return loaders.thread
      .loadMany(searchResultThreads.map(t => t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }

  // searching a community
  if (searchFilter && searchFilter.communityId) {
    const filters = `communityId:"${searchFilter.communityId}"`;
    let searchResultThreads = await getSearchResultThreads(filters);

    // if no threads exist, send an empty array to the client
    if (!searchResultThreads || searchResultThreads.length === 0) return [];

    const getCommunity = getCommunityById(searchFilter.communityId);
    const getPublicChannelIds = getPublicChannelIdsInCommunity(
      searchFilter.communityId
    );
    const getPrivateChannelIds = IS_AUTHED_USER
      ? getPrivateChannelIdsInCommunity(searchFilter.communityId)
      : [];
    const getCurrentUsersChannelIds = IS_AUTHED_USER
      ? getUsersJoinedPrivateChannelIds(user.id)
      : [];

    const [
      community,
      publicChannels,
      privateChannels,
      currentUsersPrivateChannels,
    ] = await Promise.all([
      getCommunity,
      getPublicChannelIds,
      getPrivateChannelIds,
      getCurrentUsersChannelIds,
    ]);

    // community is deleted or not found
    if (!community || community.deletedAt) return [];

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
      .loadMany(searchResultThreads.map(t => t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }

  if (searchFilter && searchFilter.creatorId) {
    const filters = `creatorId:"${searchFilter.creatorId}"`;
    let searchResultThreads = await getSearchResultThreads(filters);

    // if no threads exist, send an empty array to the client
    if (!searchResultThreads || searchResultThreads.length === 0) return [];

    const getPublicChannelIds = getPublicChannelIdsForUsersThreads(
      searchFilter.creatorId
    );
    const getPrivateChannelIds = IS_AUTHED_USER
      ? getPrivateChannelIdsForUsersThreads(searchFilter.creatorId)
      : [];
    const getCurrentUsersChannelIds = IS_AUTHED_USER
      ? getUsersJoinedPrivateChannelIds(user.id)
      : [];

    const [
      publicChannels,
      privateChannels,
      currentUsersPrivateChannels,
    ] = await Promise.all([
      getPublicChannelIds,
      getPrivateChannelIds,
      getCurrentUsersChannelIds,
    ]);

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
      .filter(t => t.creatorId === searchFilter.creatorId);

    return loaders.thread
      .loadMany(searchResultThreads.map(t => t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }

  // user is searching their everything feed
  if (searchFilter && searchFilter.everythingFeed) {
    const filters = '';
    let searchResultThreads = await getSearchResultThreads(filters);

    // if no threads exist, send an empty array to the client
    if (!searchResultThreads || searchResultThreads.length === 0) return [];

    const getAvailableChannelIds = IS_AUTHED_USER
      ? getUsersJoinedChannels(user.id)
      : [];

    const [availableChannelsForSearch] = await Promise.all([
      getAvailableChannelIds,
    ]);

    searchResultThreads = searchResultThreads.filter(
      t => availableChannelsForSearch.indexOf(t.channelId) >= 0
    );

    return loaders.thread
      .loadMany(searchResultThreads.map(t => t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }

  // if there isn't a filter, we can assume the user is searching spectrum globally
  const filters = '';
  let searchResultThreads = await getSearchResultThreads(filters);

  // if no threads exist, send an empty array to the client
  if (!searchResultThreads || searchResultThreads.length === 0) return [];

  // first, lets get the channels where the thread results were posted
  const channelsOfThreads = await getChannels(
    searchResultThreads.map(t => t.channelId)
  );

  // see if any channels where thread results were found are private
  const privateChannelIds = channelsOfThreads
    .filter(c => c.isPrivate)
    .map(c => c.id);

  // if the search results contain threads that aren't in any private channels,
  // send down the results
  if (!privateChannelIds || privateChannelIds.length === 0) {
    return loaders.thread
      .loadMany(searchResultThreads.map(t => t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  } else {
    // otherwise here we know that the user found threads where some of them are
    // in a private channel - we need to check permissions
    const currentUsersPrivateChannelIds = IS_AUTHED_USER
      ? await getUsersJoinedPrivateChannelIds(user.id)
      : [];

    // find which private channels the user is a member of
    const availablePrivateChannels =
      currentUsersPrivateChannelIds.length > 0
        ? intersection(privateChannelIds, currentUsersPrivateChannelIds)
        : [];

    // for each thread in the search results, determine if it was posted in
    // a private channel. if yes, is the current user a member?
    searchResultThreads = searchResultThreads.filter(thread => {
      if (privateChannelIds.indexOf(thread.channelId) >= 0) {
        return availablePrivateChannels.indexOf(thread.channelId) >= 0;
      }
      return thread;
    });

    return loaders.thread
      .loadMany(searchResultThreads.map(t => t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }
};
