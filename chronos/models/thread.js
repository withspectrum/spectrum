// @flow
const { db } = require('shared/db');
import type { DBThread } from 'shared/types';
import { getRangeFromTimeframe } from 'chronos/models/utils';
import type { Timeframe } from 'chronos/types';

export const getThreadsInChannelsInTimeframe = async (
  timeframe: Timeframe,
  channelIds: Array<string>
): Promise<Array<DBThread>> => {
  const range = getRangeFromTimeframe(timeframe);
  let threads = [];

  const channelPromises = channelIds.map(async channelId => {
    const threadsInChannelAndTimeframe = await db
      .table('threads')
      .between([channelId, db.now().sub(range)], [channelId, db.now()], {
        index: 'channelIdAndLastActive',
        leftBound: 'open',
        rightBound: 'open',
      })
      .orderBy({ index: db.desc('channelIdAndLastActive') })
      .filter(thread => db.not(thread.hasFields('deletedAt')))
      .run();

    threads = [...threads, ...threadsInChannelAndTimeframe];
  });

  return await Promise.all([...channelPromises]).then(() => {
    return threads;
  });
};
