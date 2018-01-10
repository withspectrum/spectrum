// @flow
const debug = require('debug')('iris:queries:thread');
import {
  getUserPermissionsInChannel,
  DEFAULT_USER_CHANNEL_PERMISSIONS,
} from '../models/usersChannels';
const { getMessages } = require('../models/message');
import { addQueue } from '../utils/workerQueue';
import { TRACK_USER_THREAD_LAST_SEEN } from 'shared/bull/queues';
import UserError from '../utils/UserError';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GraphQLContext } from '../';
import type { DBThread } from 'shared/types';
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
import { getCommunityById, getCommunities } from '../models/community';
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
    attachments: ({ attachments }: DBThread) =>
      attachments &&
      attachments.map(attachment => {
        return {
          attachmentType: attachment.attachmentType,
          data: JSON.stringify(attachment.data),
        };
      }),
    channel: ({ channelId }: DBThread, _: any, { loaders }: GraphQLContext) =>
      loaders.channel.load(channelId),
    community: (
      { communityId }: DBThread,
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.community.load(communityId),
    participants: (
      { id, creatorId }: DBThread,
      _: any,
      { loaders }: GraphQLContext
    ) => {
      return loaders.threadParticipants
        .load(id)
        .then(result => (result ? result.reduction : []));
    },
    isCreator: ({ creatorId }: DBThread, _: any, { user }: GraphQLContext) => {
      if (!creatorId || !user) return false;
      return user.id === creatorId;
    },
    receiveNotifications: (
      { id }: DBThread,
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
    messageConnection: async (
      { id }: DBThread,
      {
        first,
        after,
        last,
        before,
      }: { ...PaginationOptions, last: number, before: string },
      { user, loaders }: GraphQLContext
    ) => {
      // Make sure users don't provide bonkers arguments that paginate in both directions at the same time
      if (
        (first && last) ||
        (after && before) ||
        (first && before) ||
        (after && last)
      ) {
        debug('invalid pagination options provided:');
        debug(
          'first:',
          first,
          ' last:',
          last,
          ' after:',
          after,
          ' before:',
          before
        );
        throw new UserError(
          'Cannot paginate back- and forwards at the same time. Please only ask for the first messages after a certain point or the last messages before a certain point.'
        );
      }

      debug(`get messages for ${id}`);
      let cursor = after || before;
      try {
        cursor = decode(cursor);
        if (cursor) cursor = parseInt(cursor, 10);
      } catch (err) {
        debug(err);
        throw new UserError(
          'Invalid cursor passed to thread.messageConnection.'
        );
      }
      if (cursor) debug(`cursor: ${cursor}`);

      let options = {
        // Default first/last to 50 if their counterparts after/before are provided
        // so users can query messageConnection(after: "cursor") or (before: "cursor")
        // without any more options
        first: first ? first : after ? 50 : null,
        last: last ? last : before ? 50 : null,
        // Set after/before to the cursor depending on which one was requested by the user
        after: after ? cursor : null,
        before: before ? cursor : null,
      };

      // If we didn't get any arguments at all (i.e messageConnection {})
      // then just fetch the first 50 messages
      // $FlowIssue
      if (Object.keys(options).every(key => !options[key])) {
        options = {
          first: 50,
        };
      }

      debug('pagination options for query:', options);

      // Load one message too much so that we know whether there's
      // a next or previous page
      options.first && options.first++;
      options.last && options.last++;

      return getMessages(id, options).then(result => {
        if (user && user.id) {
          addQueue(TRACK_USER_THREAD_LAST_SEEN, {
            threadId: id,
            userId: user.id,
            timestamp: Date.now(),
          });
        }
        let messages = result;
        // Check if more messages were returned than were requested, which would mean
        // there's a next/previous page. (depending on the direction of the pagination)
        const loadedMoreFirst =
          options.first && result.length > options.first - 1;
        const loadedMoreLast = options.last && result.length > options.last - 1;

        // Get rid of the extranous message if there is one
        if (loadedMoreFirst) {
          debug('not sending extranous message loaded first');
          messages = result.slice(0, result.length - 1);
        } else if (loadedMoreLast) {
          debug('not sending extranous message loaded last');
          messages = result.reverse().slice(1, result.length);
        }

        return {
          pageInfo: {
            // Use the extranous message that was maybe loaded to figure out whether
            // there is a next/previous page, otherwise just try and guess based on
            // if a cursor was provided
            // $FlowIssue
            hasNextPage: loadedMoreFirst || !!options.before,
            // $FlowIssue
            hasPreviousPage: loadedMoreLast || !!options.after,
          },
          edges: messages.map((message, index) => ({
            cursor: encode(message.timestamp.getTime().toString()),
            node: message,
          })),
        };
      });
    },
    creator: async (
      { creatorId, communityId }: DBThread,
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
    messageCount: ({ id }: DBThread, __: any, { loaders }: GraphQLContext) => {
      return loaders.threadMessageCount
        .load(id)
        .then(messageCount => (messageCount ? messageCount.reduction : 0));
    },
    currentUserLastSeen: (
      { id }: DBThread,
      _: any,
      { user, loaders }: GraphQLContext
    ) => {
      if (!user || !user.id) return null;

      return loaders.userThreadNotificationStatus
        .load([user.id, id])
        .then(result => {
          if (!result || result.length === 0) return;
          const data = result;
          if (!data || !data.lastSeen) return null;

          return data.lastSeen;
        });
    },
  },
};
