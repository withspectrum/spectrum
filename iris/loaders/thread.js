// @flow
import { getThreads } from '../models/thread';
import createLoader from './create-loader';
import type { Loader } from './types';

export const __createThreadLoader = () =>
  createLoader(threads => getThreads(threads));

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
