// @flow
import { getTotalMessageCount, getNewMessageCount } from '../../models/message';
import {
  NEW_MESSAGE_COUNT_WEIGHT,
  TOTAL_MESSAGE_COUNT_WEIGHT,
} from '../constants';
import { getCommunityById } from 'shared/db/queries/community';
import { getChannelById } from 'shared/db/queries/channel';
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
  const promises = threads.map(
    async (thread): Promise<DBThreadWithMessageString> => {
      const [community, channel, newMessageCount] = await Promise.all([
        getCommunityById(thread.communityId),
        getChannelById(thread.channelId),
        getNewMessageCount(thread.id, timeframe),
      ]);

      const signedCommunity = signCommunity(community);
      const totalMessageCount =
        thread.messageCount || (await getTotalMessageCount(thread.id));

      // $FlowFixMe
      return {
        ...thread,
        community: signedCommunity,
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
      return `<span class="newMessageCount">1 new message</span>`;
    } else {
      return `<span class="newMessageCount">${newMessageCount} new messages</span>`;
    }
  } else {
    return `<span class="totalMessageCount">${totalMessageCount} messages </span><span class="newMessageCount">(${newMessageCount} new)</span>`;
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
      const score =
        thread.newMessageCount * NEW_MESSAGE_COUNT_WEIGHT +
        thread.totalMessageCount * TOTAL_MESSAGE_COUNT_WEIGHT;

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
