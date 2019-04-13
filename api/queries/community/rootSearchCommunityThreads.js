// @flow
/*

    DEPRECATED 2/1/2018 by @brian

*/
import type { GraphQLContext } from '../../';
import initIndex from 'shared/algolia';
const communityThreadsSearchIndex = initIndex('threads_and_messages');
import { getCommunityById } from '../../models/community';
import {
  getPublicChannelIdsInCommunity,
  getPrivateChannelIdsInCommunity,
  getUsersJoinedPrivateChannelIds,
} from '../../models/search';
import { intersection } from 'lodash';

export default async (
  _: any,
  { communityId, searchString }: { communityId: string, searchString: string },
  { user, loaders }: GraphQLContext
) => {
  let getSearchResultThreads = (filters: string) =>
    communityThreadsSearchIndex
      .search({ query: searchString, filters })
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
    .filter(t => t.communityId === communityId);

  return loaders.thread
    .loadMany(searchResultThreads.map(t => t.threadId))
    .then(data => data.filter(thread => thread && !thread.deletedAt));
};
