// @flow
import { transformations } from 'shared/analytics';

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
};

export const getEntityDataForAnalytics = (loaders: any) => async (
  obj: EntityObjType
) => {
  if (obj.reactionId) {
    const reaction = await loaders.reaction.load(obj.reactionId);
    const message = await loaders.message.load(reaction.messageId);
    const thread = await loaders.thread.load(message.threadId);

    const [channel, community] = await Promise.all([
      loaders.channel.load(thread.channelId),
      loaders.community.load(thread.communityId),
    ]);

    return {
      reaction: transformations.analyticsReaction(reaction),
      message: transformations.analyticsMessage(message),
      thread: transformations.analyticsThread(thread),
      channel: transformations.analyticsChannel(channel),
      community: transformations.analyticsCommunity(community),
    };
  }

  if (obj.messageId) {
    const message = await loaders.message.load(obj.messageId);
    const thread = await loaders.thread.load(message.threadId);

    const [channel, community] = await Promise.all([
      loaders.channel.load(thread.channelId),
      loaders.community.load(thread.communityId),
    ]);

    return {
      message: transformations.analyticsMessage(message),
      thread: transformations.analyticsThread(thread),
      channel: transformations.analyticsChannel(channel),
      community: transformations.analyticsCommunity(community),
    };
  }

  if (obj.threadId) {
    const thread = await loaders.thread.load(obj.threadId);

    const [channel, community] = await Promise.all([
      loaders.channel.load(thread.channelId),
      loaders.community.load(thread.communityId),
    ]);

    return {
      thread: transformations.analyticsThread(thread),
      channel: transformations.analyticsChannel(channel),
      community: transformations.analyticsCommunity(community),
    };
  }

  if (obj.channelId) {
    const channel = await loaders.channel.load(obj.channelId);
    const community = await loaders.community.load(channel.communityId);
    return {
      channel: transformations.analyticsChannel(channel),
      community: transformations.analyticsCommunity(community),
    };
  }

  if (obj.communityId) {
    const community = await loaders.community.load(obj.communityId);
    return transformations.analyticsCommunity(community);
  }
};
