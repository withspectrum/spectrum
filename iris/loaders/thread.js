// @flow
import { getThreads } from '../models/thread';
import { getMessageCountInThreads } from '../models/message';
import { getParticipantsInThreads } from '../models/usersThreads';
import createLoader from './create-loader';
import type { Loader } from './types';

const TEN_SECONDS = 10000;

export const __createThreadLoader = createLoader(threads =>
  getThreads(threads)
);

export const __createThreadParticipantsLoader = createLoader(
  threadIds => getParticipantsInThreads(threadIds),
  { getKeyFromResult: 'group' }
);

export const __createThreadMessageCountLoader = createLoader(
  threadIds => getMessageCountInThreads(threadIds),
  { getKeyFromResult: 'group', cacheExpiryTime: TEN_SECONDS }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
