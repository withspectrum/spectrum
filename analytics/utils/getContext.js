// @flow
import { transformations } from './index';
import { getThreadNotificationStatusForUser } from '../models/usersThreads';
import { getReactionById, getThreadReactionById } from '../models/reaction';
import { getMessageById } from '../models/message';
import { getThreadById } from '../models/thread';
import { getChannelById } from '../models/channel';
import { getCommunityById } from '../models/community';
import { getUserPermissionsInChannel } from '../models/usersChannels';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
import { getNotificationById } from '../models/notification';
/*

  Given an entityId, return structured data to track in internal analytics
  E.g. given a reactionId, return the reaction, message, thread, channel, and community
  where the reaction was left

  E.g. given a threadId, return the thread, channel and community

*/
type EntityObjType = {
  reactionId?: string,
  threadReactionId?: string,
  messageId?: string,
  threadId?: string,
  channelId?: string,
  communityId?: string,
  notificationId?: string,
  userId: string,
};

export const getContext = async (obj: EntityObjType) => {
  if (obj.reactionId) {
    const reaction = await getReactionById(obj.reactionId);
    const message = await getMessageById(reaction.messageId);
    const thread = await getThreadById(message.threadId);

    // if no thread was found, we are in a dm
    if (!thread) {
      return {
        reaction: transformations.analyticsReaction(reaction),
        message: transformations.analyticsMessage(message),
      };
    }

    const [
      channel,
      community,
      channelPermissions,
      communityPermissions,
      threadPermissions,
    ] = await Promise.all([
      getChannelById(thread.channelId),
      getCommunityById(thread.communityId),
      getUserPermissionsInChannel(obj.userId, thread.channelId),
      getUserPermissionsInCommunity(obj.userId, thread.communityId),
      getThreadNotificationStatusForUser(thread.id, obj.userId),
    ]);

    return {
      reaction: transformations.analyticsReaction(reaction),
      message: transformations.analyticsMessage(message),
      thread: {
        ...transformations.analyticsThread(thread),
        ...transformations.analyticsThreadPermissions(threadPermissions),
        isPinned: community.pinnedThreadId
          ? community.pinnedThreadId === thread.id
          : false,
      },
      channel: {
        ...transformations.analyticsChannel(channel),
        ...transformations.analyticsChannelPermissions(channelPermissions),
      },
      community: {
        ...transformations.analyticsCommunity(community),
        ...transformations.analyticsCommunityPermissions(communityPermissions),
      },
    };
  }

  if (obj.threadReactionId) {
    const threadReaction = await getThreadReactionById(obj.threadReactionId);
    const thread = await getThreadById(threadReaction.threadId);

    // if no thread was found, we are in a dm
    if (!thread) {
      return {};
    }

    const [
      channel,
      community,
      channelPermissions,
      communityPermissions,
      threadPermissions,
    ] = await Promise.all([
      getChannelById(thread.channelId),
      getCommunityById(thread.communityId),
      getUserPermissionsInChannel(obj.userId, thread.channelId),
      getUserPermissionsInCommunity(obj.userId, thread.communityId),
      getThreadNotificationStatusForUser(thread.id, obj.userId),
    ]);

    return {
      threadReaction: transformations.analyticsReaction(threadReaction),
      thread: {
        ...transformations.analyticsThread(thread),
        ...transformations.analyticsThreadPermissions(threadPermissions),
        isPinned: community.pinnedThreadId
          ? community.pinnedThreadId === thread.id
          : false,
      },
      channel: {
        ...transformations.analyticsChannel(channel),
        ...transformations.analyticsChannelPermissions(channelPermissions),
      },
      community: {
        ...transformations.analyticsCommunity(community),
        ...transformations.analyticsCommunityPermissions(communityPermissions),
      },
    };
  }

  if (obj.messageId) {
    const message = await getMessageById(obj.messageId);
    const thread = await getThreadById(message.threadId);

    // if no thread was found, we are in a dm
    if (!thread) {
      return {
        message: transformations.analyticsMessage(message),
      };
    }

    const [
      channel,
      community,
      channelPermissions,
      communityPermissions,
      threadPermissions,
    ] = await Promise.all([
      getChannelById(thread.channelId),
      getCommunityById(thread.communityId),
      getUserPermissionsInChannel(obj.userId, thread.channelId),
      getUserPermissionsInCommunity(obj.userId, thread.communityId),
      getThreadNotificationStatusForUser(thread.id, obj.userId),
    ]);

    return {
      message: transformations.analyticsMessage(message),
      thread: {
        ...transformations.analyticsThread(thread),
        ...transformations.analyticsThreadPermissions(threadPermissions),
        isPinned: community.pinnedThreadId
          ? community.pinnedThreadId === thread.id
          : false,
      },
      channel: {
        ...transformations.analyticsChannel(channel),
        ...transformations.analyticsChannelPermissions(channelPermissions),
      },
      community: {
        ...transformations.analyticsCommunity(community),
        ...transformations.analyticsCommunityPermissions(communityPermissions),
      },
    };
  }

  if (obj.threadId) {
    const thread = await getThreadById(obj.threadId);

    const [
      channel,
      community,
      channelPermissions,
      communityPermissions,
      threadPermissions,
    ] = await Promise.all([
      getChannelById(thread.channelId),
      getCommunityById(thread.communityId),
      getUserPermissionsInChannel(obj.userId, thread.channelId),
      getUserPermissionsInCommunity(obj.userId, thread.communityId),
      getThreadNotificationStatusForUser(thread.id, obj.userId),
    ]);

    return {
      thread: {
        ...transformations.analyticsThread(thread),
        ...transformations.analyticsThreadPermissions(threadPermissions),
        isPinned: community.pinnedThreadId
          ? community.pinnedThreadId === thread.id
          : false,
      },
      channel: {
        ...transformations.analyticsChannel(channel),
        ...transformations.analyticsChannelPermissions(channelPermissions),
      },
      community: {
        ...transformations.analyticsCommunity(community),
        ...transformations.analyticsCommunityPermissions(communityPermissions),
      },
    };
  }

  if (obj.channelId) {
    const channel = await getChannelById(obj.channelId);
    const [
      community,
      channelPermissions,
      communityPermissions,
    ] = await Promise.all([
      getCommunityById(channel.communityId),
      getUserPermissionsInChannel(obj.userId, channel.id),
      getUserPermissionsInCommunity(obj.userId, channel.communityId),
    ]);

    return {
      channel: {
        ...transformations.analyticsChannel(channel),
        ...transformations.analyticsChannelPermissions(channelPermissions),
      },
      community: {
        ...transformations.analyticsCommunity(community),
        ...transformations.analyticsCommunityPermissions(communityPermissions),
      },
    };
  }

  if (obj.communityId) {
    const communityId = obj.communityId;

    const [community, communityPermissions] = await Promise.all([
      getCommunityById(obj.communityId),
      getUserPermissionsInCommunity(obj.userId, communityId),
    ]);
    return {
      community: {
        ...transformations.analyticsCommunity(community),
        ...transformations.analyticsCommunityPermissions(communityPermissions),
      },
    };
  }

  if (obj.notificationId) {
    const notificationId = obj.notificationId;
    const notification = await getNotificationById(notificationId);
    return {
      event: notification.event,
    };
  }
};
