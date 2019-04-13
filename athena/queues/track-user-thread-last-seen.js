// @flow
const debug = require('debug')('athena:queue:track-user-thread-last-seen');
import Raven from 'shared/raven';
import {
  getUsersThread,
  setUserThreadLastSeen,
  createUserThread,
} from '../models/usersThreads';
import type { Job, UserThreadLastSeenJobData } from 'shared/bull/types';
import type { DBUsersThreads } from 'shared/types';

export default async (job: Job<UserThreadLastSeenJobData>) => {
  const { userId, threadId, timestamp } = job.data;

  if (!userId || !threadId || !timestamp) {
    debug(
      `missing data, not running job:\nuserId: ${userId}\nthreadId: ${threadId}\ntimestamp: ${new Date(
        timestamp
      ).toString()}`
    );
    return;
  }
  // Timestamp will be serialized to Redis, so it's either a string date "Thu 20 Nov 2017" or a
  // string timestamp. "1835463856" We gotta make sure to handle both those cases, so we try and
  // parse to int first, and if that fails (i.e. returns NaN) we assume it's a string date.
  let parsedTimestamp =
    typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  if (isNaN(parsedTimestamp)) parsedTimestamp = timestamp;
  const date = new Date(parsedTimestamp);
  debug(
    `new job\nthreadId: ${threadId}\nuserId: ${userId}\ntimestamp: ${new Date(
      timestamp
    ).toString()}`
  );

  const record: ?DBUsersThreads = await getUsersThread(userId, threadId);

  if (record) {
    if (
      record.lastSeen &&
      new Date(record.lastSeen).getTime() > new Date(date).getTime()
    ) {
      debug(
        `old lastSeen ${record.lastSeen.toString()} is later than new lastSeen ${date.toString()}, not running job:\nuserId: ${userId}\nthreadId: ${threadId}\ntimestamp: ${new Date(
          timestamp
        ).toString()}`
      );
      return;
    }

    debug(
      `existing usersThread, updating usersThreads#${record.id} with lastSeen`
    );
    return setUserThreadLastSeen(userId, threadId, date);
  }

  debug(`no userThread record yet, creating new one`);
  return createUserThread({
    userId,
    threadId,
    lastSeen: date,
  })
    .then(() => {
      debug(`lastSeen successfully stored`);
    })
    .catch(err => {
      console.error('❌ Error in job');
      console.error(err);
      Raven.captureException(err);
    });
};
