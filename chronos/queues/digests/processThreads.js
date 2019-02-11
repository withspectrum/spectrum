// @flow
import { getTotalMessageCount, getNewMessageCount } from '../../models/message';
import {
  NEW_MESSAGE_COUNT_WEIGHT,
  TOTAL_MESSAGE_COUNT_WEIGHT,
  WATERCOOLER_WEIGHT_REDUCTION,
} from '../constants';
import { getCommunitiesById } from 'shared/db/queries/community';
import { getChannelsById } from 'shared/db/queries/channel';
import type {
  Timeframe,
  ThreadWithDigestData,
  CleanDigestThread,
} from 'chronos/types';
import { signCommunity } from 'shared/imgix';
import truncate from 'shared/truncate';

import type { DBThread, DBCommunity, DBChannel } from 'shared/types';

type DBThreadWithMetadata = {
  ...$Exact<DBThread>,
  community: DBCommunity,
  channel: DBChannel,
  messageCountString: string,
  newMessageCount: number,
  totalMessageCount: number,
};

type DBThreadWithMessageString = {
  ...$Exact<DBThreadWithMetadata>,
  messageCountString: string,
};

export const attachMetadataToThreads = async (
  threads: Array<DBThread>,
  timeframe: Timeframe
): Promise<Array<DBThreadWithMetadata>> => {
  const [communities, channels] = await Promise.all([
    getCommunitiesById(threads.map(({ communityId }) => communityId)),
    getChannelsById(threads.map(({ channelId }) => channelId)),
  ]);

  const signedCommunities = communities.map(community =>
    signCommunity(community)
  );

  const promises = threads.map(
    async (thread): Promise<DBThreadWithMessageString> => {
      const community = signedCommunities.find(
        community => community.id === thread.communityId
      );
      const channel = channels.find(channel => channel.id === thread.channelId);
      const newMessageCount = await getNewMessageCount(thread.id, timeframe);
      const totalMessageCount = thread.messageCount
        ? thread.messageCount
        : await getTotalMessageCount(thread.id);

      // $FlowFixMe
      return {
        ...thread,
        community,
        channel,
        newMessageCount,
        totalMessageCount,
      };
    }
  );

  return await Promise.all([...promises]);
};

export const getMessageCountString = (
  newMessageCount: number,
  totalMessageCount: number
): string => {
  if (totalMessageCount === 0) {
    return `<span class="newMessageCount">New thread</span>`;
  } else if (newMessageCount === totalMessageCount) {
    if (newMessageCount === 1) {
      return `<span class="newMessageCount" style="color: #E2197A;">1 new message</span>`;
    } else {
      return `<span class="newMessageCount" style="color: #E2197A;">${newMessageCount} new messages</span>`;
    }
  } else {
    return `<span class="totalMessageCount">${totalMessageCount} messages </span><span class="newMessageCount" style="color: #E2197A;">(${newMessageCount} new)</span>`;
  }
};

export const attachMessageCountStringToThreads = async (
  threads: Array<DBThreadWithMetadata>
): Promise<Array<DBThreadWithMessageString>> => {
  const promises = threads.map(thread => {
    let messageCountString = getMessageCountString(
      thread.newMessageCount,
      thread.totalMessageCount
    );

    return {
      ...thread,
      messageCountString,
    };
  });

  return Promise.all([...promises]);
};

export const attachScoreToThreads = async (
  threads: Array<DBThreadWithMessageString>
): Promise<Array<ThreadWithDigestData>> => {
  const promises = threads
    .map(thread => {
      let score =
        thread.newMessageCount * NEW_MESSAGE_COUNT_WEIGHT +
        thread.totalMessageCount * TOTAL_MESSAGE_COUNT_WEIGHT;

      // watercooler threads tend to have more messages than the average thread
      // often in the hundreds. So even with a small weight placed on total
      // message count, watercoolers are often outranking new threads.
      // to solve for this, we reduce the overall score of watercooler threads
      // by a constant percentage to give higher priority to new conversations.
      if (thread.watercooler) {
        score = score * WATERCOOLER_WEIGHT_REDUCTION;
      }

      return {
        ...thread,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return Promise.all([...promises]);
};

export const cleanThreadData = async (
  threads: Array<ThreadWithDigestData>
): Promise<Array<CleanDigestThread>> => {
  const promises = threads.map(thread => {
    return {
      id: thread.id,
      content: {
        title: truncate(thread.content.title, 80),
      },
      community: {
        slug: thread.community.slug,
        name: thread.community.name,
        profilePhoto: thread.community.profilePhoto,
      },
      channel: {
        slug: thread.channel.slug,
        name: thread.channel.name,
      },
      messageCountString: thread.messageCountString,
    };
  });

  return Promise.all([...promises]);
};
