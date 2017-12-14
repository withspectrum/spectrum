import { getThreadNotificationStatusForUser } from '../models/usersThreads';
import {
  getUserPermissionsInChannel,
  DEFAULT_USER_CHANNEL_PERMISSIONS,
} from '../models/usersChannels';
const { getMessages } = require('../models/message');
import { addQueue } from '../utils/workerQueue';
import { TRACK_USER_THREAD_LAST_SEEN } from 'shared/bull/queues';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GraphQLContext } from '../';
import { encode, decode } from '../utils/base64';
import {
  getPublicChannelIdsInCommunity,
  getPrivateChannelIdsInCommunity,
  getUsersJoinedPrivateChannelIds,
  getPublicChannelIdsForUsersThreads,
  getPrivateChannelIdsForUsersThreads,
  getUsersJoinedChannels,
} from '../models/search';
import { intersection } from 'lodash';
import { getChannelById, getChannels } from '../models/channel';
import { getCommunityById } from '../models/community';
import initIndex from 'shared/algolia';
const searchIndex = initIndex('threads_and_messages');

type FilterTypes = {
  communityId?: string,
  channelId?: string,
  creatorId?: string,
  everythingFeed?: boolean,
};

module.exports = {
  Query: {
    thread: (
      _: any,
      { id }: { id: string },
      { loaders, user }: GraphQLContext
    ) =>
      loaders.thread.load(id).then(thread => {
        // if a thread wasn't found
        if (!thread) return null;

        /*
          If no user exists, we need to make sure the thread being fetched is not in a private channel
        */
        if (!user) {
          return Promise.all([
            thread,
            loaders.channel.load(thread.channelId),
          ]).then(([thread, channel]) => {
            // if the channel is private, don't return any thread data
            if (channel.isPrivate) return null;
            return thread;
          });
        } else {
          // if the user is signed in, we need to check if the channel is private as well as the user's permission in that channel
          return Promise.all([
            thread,
            loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
            loaders.channel.load(thread.channelId),
          ]).then(([thread, permissions, channel]) => {
            // if the thread is in a private channel where the user is not a member, don't return any thread data
            if (channel.isPrivate && !permissions.isMember) return null;
            return thread;
          });
        }
      }),
    searchThreads: async (
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
            console.log('err', err);
          });

      const IS_AUTHED_USER = user && user.id;

      // searching a channel
      if (filter.channelId) {
        const filters = `channelId:"${filter.channelId}"`;
        let searchResultThreads = await getSearchResultThreads(filters);

        // if no threads exist, send an empty array to the client
        if (!searchResultThreads || searchResultThreads.length === 0) return [];

        const getChannel = getChannelById(filter.channelId);
        const usersPermissionsInChannel = IS_AUTHED_USER
          ? getUserPermissionsInChannel(filter.channelId, user.id)
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

        const getCommunity = getCommunityById(filter.communityId);
        const getPublicChannelIds = getPublicChannelIdsInCommunity(
          filter.communityId
        );
        const getPrivateChannelIds = IS_AUTHED_USER
          ? getPrivateChannelIdsInCommunity(filter.communityId)
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
          filter.creatorId
        );
        const getPrivateChannelIds = IS_AUTHED_USER
          ? getPrivateChannelIdsForUsersThreads(filter.creatorId)
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
        return loaders.thread.loadMany(
          searchResultThreads.map(t => t.threadId)
        );
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
    },
  },
  Thread: {
    attachments: ({ attachments }: { attachments: Array<any> }) =>
      attachments &&
      attachments.map(attachment => {
        return {
          attachmentType: attachment.attachmentType,
          data: JSON.stringify(attachment.data),
        };
      }),
    channel: (
      { channelId }: { channelId: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.channel.load(channelId),
    community: (
      { communityId }: { communityId: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.community.load(communityId),
    participants: (
      { id, creatorId }: { id: string, creatorId: string },
      _: any,
      { loaders }: GraphQLContext
    ) => {
      return loaders.threadParticipants
        .load(id)
        .then(result => (result ? result.reduction : []));
    },
    isCreator: (
      { creatorId }: { creatorId: string },
      _: any,
      { user }: GraphQLContext
    ) => {
      if (!creatorId || !user) return false;
      return user.id === creatorId;
    },
    receiveNotifications: (
      { id }: { id: string },
      __: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;
      if (!currentUser) {
        return false;
      } else {
        return loaders.userThreadNotificationStatus
          .load([currentUser.id, id])
          .then(result => (result ? result.receiveNotifications : false));
      }
    },
    messageConnection: (
      { id, watercooler }: { id: String },
      { first = 999999, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const cursor = decode(after);
      // Get the index from the encoded cursor, asdf234gsdf-2 => ["-2", "2"]
      const lastDigits = cursor.match(/-(\d+)$/);
      const lastMessageIndex =
        lastDigits && lastDigits.length > 0 && parseInt(lastDigits[1], 10);
      return getMessages(id, {
        // Only send down 200 messages for the watercooler?
        first,
        after: lastMessageIndex,
      }).then(result => {
        if (user && user.id) {
          addQueue(TRACK_USER_THREAD_LAST_SEEN, {
            threadId: id,
            userId: user.id,
            timestamp: Date.now(),
          });
        }
        return {
          pageInfo: {
            hasNextPage: result && result.length >= first,
          },
          edges: result.map((message, index) => ({
            cursor: encode(`${message.id}-${lastMessageIndex + index + 1}`),
            node: message,
          })),
        };
      });
    },
    creator: async (
      { creatorId, communityId }: { creatorId: string, communityId: string },
      _: any,
      { loaders }: GraphQLContext
    ) => {
      const creator = await loaders.user.load(creatorId);

      const permissions = await loaders.userPermissionsInCommunity.load([
        creatorId,
        communityId,
      ]);

      return {
        ...creator,
        contextPermissions: {
          communityId,
          reputation: permissions ? permissions.reputation : 0,
          isModerator: permissions ? permissions.isModerator : false,
          isOwner: permissions ? permissions.isOwner : false,
        },
      };
    },
    messageCount: (
      { id }: { id: string },
      __: any,
      { loaders }: GraphQLContext
    ) => {
      return loaders.threadMessageCount
        .load(id)
        .then(messageCount => (messageCount ? messageCount.reduction : 0));
    },
    currentUserLastSeen: (
      { id }: DBThread,
      _: any,
      { user }: GraphQLContext
    ) => {
      if (!user || !user.id) return null;

      return getThreadNotificationStatusForUser(id, user.id).then(result => {
        if (!result || result.length === 0) return;
        const data = result[0];
        if (!data || !data.lastSeen) return null;

        return data.lastSeen;
      });
    },
  },
};
