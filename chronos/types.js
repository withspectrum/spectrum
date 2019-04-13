// @flow
import type { DBCommunity, DBChannel, DBThread } from 'shared/types';

export type Timeframe = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export type ThreadWithDigestData = {
  ...$Exact<DBThread>,
  community: DBCommunity,
  channel: DBChannel,
  messageCountString: string,
  newMessageCount: number,
  totalMessageCount: number,
  score: number,
};

export type CleanDigestThread = {
  id: string,
  content: {
    title: string,
  },
  community: {
    slug: string,
    name: string,
    profilePhoto: string,
  },
  channel: {
    slug: string,
    name: string,
  },
  messageCountString: string,
};
