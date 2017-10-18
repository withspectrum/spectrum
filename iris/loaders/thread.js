// @flow
import { getThreads } from '../models/thread';
import { getMessageCountInThreads } from '../models/message';
import { getParticipantsInThreads } from '../models/usersThreads';
import createLoader from './create-loader';
import type { Loader } from './types';

export const __createThreadLoader = () =>
  createLoader(threads => getThreads(threads));

export const __createThreadParticipantsLoader = () =>
  createLoader(threadIds => getParticipantsInThreads(threadIds), 'group');

export const __createThreadMessageCountLoader = () =>
  createLoader(threadIds => getMessageCountInThreads(threadIds), 'group');

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
