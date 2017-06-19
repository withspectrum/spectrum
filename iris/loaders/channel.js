// @flow
import { getChannels } from '../models/channel';
import createLoader from './create-loader';
import type { Loader } from './types';

export const __createChannelLoader = () =>
  createLoader(channels => getChannels(channels));

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
