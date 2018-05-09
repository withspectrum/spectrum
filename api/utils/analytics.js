// @flow
import { transformations } from 'shared/analytics';
// TODO: Turn into a loder
import { getThreadNotificationStatusForUser } from '../models/usersThreads';
/*

  Given an entityId, return structured data to track in internal analytics
  E.g. given a reactionId, return the reaction, message, thread, channel, and community
  where the reaction was left

  E.g. given a threadId, return the thread, channel and community

*/
type EntityObjType = {
  reactionId?: string,
  messageId?: string,
  threadId?: string,
  channelId?: string,
  communityId?: string,
  userId: string,
};

export const getEntityDataForAnalytics = (loaders: any) => async (
  obj: EntityObjType
) => {
  if (obj.reactionId) {
    const reaction = await loaders.reaction.load(obj.reactionId);
    const message = await loaders.message.load(reaction.messageId);
    const thread = await loaders.thread.load(message.threadId);

    const [
      channel,
      community,
      channelPermissions,
      communityPermissions,
      threadPermissions,
    ] = await Promise.all([
      loaders.channel.load(thread.channelId),
      loaders.community.load(thread.communityId),
      loaders.userPermissionsInChannel.load([obj.userId, thread.channelId]),
      loaders.userPermissionsInCommunity.load([obj.userId, thread.communityId]),
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

  if (obj.messageId) {
    const message = await loaders.message.load(obj.messageId);
    const thread = await loaders.thread.load(message.threadId);

    const [
      channel,
      community,
      channelPermissions,
      communityPermissions,
      threadPermissions,
    ] = await Promise.all([
      loaders.channel.load(thread.channelId),
      loaders.community.load(thread.communityId),
      loaders.userPermissionsInChannel.load([obj.userId, thread.channelId]),
      loaders.userPermissionsInCommunity.load([obj.userId, thread.communityId]),
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
    const thread = await loaders.thread.load(obj.threadId);

    const [
      channel,
      community,
      channelPermissions,
      communityPermissions,
      threadPermissions,
    ] = await Promise.all([
      loaders.channel.load(thread.channelId),
      loaders.community.load(thread.communityId),
      loaders.userPermissionsInChannel.load([obj.userId, thread.channelId]),
      loaders.userPermissionsInCommunity.load([obj.userId, thread.communityId]),
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
    const channel = await loaders.channel.load(obj.channelId);
    const [
      community,
      channelPermissions,
      communityPermissions,
    ] = await Promise.all([
      loaders.community.load(channel.communityId),
      loaders.userPermissionsInChannel.load([obj.userId, obj.channelId]),
      loaders.userPermissionsInCommunity.load([
        obj.userId,
        channel.communityId,
      ]),
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
    const [community, communityPermissions] = await Promise.all([
      loaders.community.load(obj.communityId),
      loaders.userPermissionsInCommunity.load([obj.userId, obj.communityId]),
    ]);
    return {
      community: {
        ...transformations.analyticsCommunity(community),
        ...transformations.analyticsCommunityPermissions(communityPermissions),
      },
    };
  }
};
