// @flow
import type { DBCommunity } from 'shared/types';
import { getThreads } from '../../models/thread';

export default async ({ pinnedThreadId }: DBCommunity) => {
  let pinnedThread;
  if (pinnedThreadId) {
    pinnedThread = await getThreads([pinnedThreadId]);
  }

  if (pinnedThread && Array.isArray(pinnedThread) && pinnedThread.length > 0)
    return pinnedThread[0];
  return null;
};
