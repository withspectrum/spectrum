// @flow
const debug = require('debug')('athena:queue:track-user-thread-last-seen');
import Raven from 'shared/raven';
import {
  getUsersThread,
  setUserThreadLastSeen,
  createUserThread,
} from '../models/usersThreads';

type JobData = {
  data: {
    threadId: string,
    userId: string,
    timestamp: number,
  },
};

export default async (job: JobData) => {
  const { userId, threadId, timestamp } = job.data;

  if (!userId || !threadId || !timestamp) {
    debug(
      `missing data, not running job:\nuserId: ${userId}\nthreadId: ${threadId}\ntimestamp: ${timestamp}`
    );
    return;
  }
  const date = new Date(parseInt(timestamp, 10));
  debug(
    `new job\nthreadId: ${threadId}\nuserId: ${userId}\ntimestamp: ${timestamp}`
  );

  const record = await getUsersThread(userId, threadId);

  if (record) {
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
      debug(
        '❌ Error in job for\nuserId: ${userId}\nthreadId: ${threadId}\ntimestamp: ${timestamp}'
      );
      debug(err);
      Raven.captureException(err);
      console.log(err);
    });
};
