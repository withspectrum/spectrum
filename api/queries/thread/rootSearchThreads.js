// @flow
/*

    DEPRECATED 2/1/2018 by @brian

*/
import type { GraphQLContext } from '../../';
import {
  getPublicChannelIdsInCommunity,
  getPrivateChannelIdsInCommunity,
  getUsersJoinedPrivateChannelIds,
  getPublicChannelIdsForUsersThreads,
  getPrivateChannelIdsForUsersThreads,
  getUsersJoinedChannels,
} from '../../models/search';
import { getChannelById, getChannels } from '../../models/channel';
import { getCommunityById } from '../../models/community';
import {
  getUserPermissionsInChannel,
  DEFAULT_USER_CHANNEL_PERMISSIONS,
} from '../../models/usersChannels';
import intersection from 'lodash.intersection';

import initIndex from 'shared/algolia';
const searchIndex = initIndex('threads_and_messages');

type FilterTypes = {
  communityId?: string,
  channelId?: string,
  creatorId?: string,
  everythingFeed?: boolean,
};

export default async (
  _: any,
  { queryString, filter }: { queryString: string, filter: FilterTypes },
  { user, loaders }: GraphQLContext
) => {
  // perform an initial search to ensure that there are some threads that exist
  // for this search query
  let getSearchResultThreads = (filters: string) =>
    searchIndex
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
  if (filter.channelId) {
    const filters = `channelId:"${filter.channelId}"`;
    let searchResultThreads = await getSearchResultThreads(filters);

    // if no threads exist, send an empty array to the client
    if (!searchResultThreads || searchResultThreads.length === 0) return [];

    // $FlowIssue
    const getChannel = getChannelById(filter.channelId);
    const usersPermissionsInChannel = IS_AUTHED_USER
      ? // $FlowIssue
        getUserPermissionsInChannel(filter.channelId, user.id)
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
  if (filter.communityId) {
    const filters = `communityId:"${filter.communityId}"`;
    let searchResultThreads = await getSearchResultThreads(filters);

    // if no threads exist, send an empty array to the client
    if (!searchResultThreads || searchResultThreads.length === 0) return [];

    // $FlowIssue
    const getCommunity = getCommunityById(filter.communityId);
    const getPublicChannelIds = getPublicChannelIdsInCommunity(
      // $FlowIssue
      filter.communityId
    );
    const getPrivateChannelIds = IS_AUTHED_USER
      ? // $FlowIssue
        getPrivateChannelIdsInCommunity(filter.communityId)
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
    if (!community) return [];

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
      .filter(t => t.communityId === filter.communityId);

    return loaders.thread
      .loadMany(searchResultThreads.map(t => t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }

  if (filter.creatorId) {
    const filters = `creatorId:"${filter.creatorId}"`;
    let searchResultThreads = await getSearchResultThreads(filters);

    // if no threads exist, send an empty array to the client
    if (!searchResultThreads || searchResultThreads.length === 0) return [];

    const getPublicChannelIds = getPublicChannelIdsForUsersThreads(
      // $FlowIssue
      filter.creatorId
    );
    const getPrivateChannelIds = IS_AUTHED_USER
      ? // $FlowIssue
        getPrivateChannelIdsForUsersThreads(filter.creatorId)
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
      .filter(t => t.creatorId === filter.creatorId);

    return loaders.thread
      .loadMany(searchResultThreads.map(t => t.threadId))
      .then(data => data.filter(thread => thread && !thread.deletedAt));
  }

  // user is searching their everything feed
  if (filter.everythingFeed) {
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
    return loaders.thread.loadMany(searchResultThreads.map(t => t.threadId));
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
